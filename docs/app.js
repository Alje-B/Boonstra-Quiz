// JSONP client for Boonstra Quiz (talks to Apps Script web app)
// Set API_URL to your Apps Script deployment URL (the one you provided)
const API_URL = 'https://script.google.com/macros/s/AKfycbxukS8vvGdJkhp7XVnkDaG42Msp-B7DQusgsbmfDIB8-uAcKPyA8Q69mw-XjSqo5itj/exec';

(function () {
  // JSONP helper: returns a Promise that resolves with parsed JSON
  function jsonpRequest(params = {}) {
    return new Promise((resolve, reject) => {
      const callbackName = 'jsonp_cb_' + Math.random().toString(36).slice(2);
      params.callback = callbackName;
      const url = new URL(API_URL);
      Object.keys(params).forEach(k => url.searchParams.set(k, params[k]));
      const script = document.createElement('script');
      script.src = url.toString();
      script.async = true;

      // Timeout in case something goes wrong
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('JSONP request timed out'));
      }, 15000);

      window[callbackName] = (data) => {
        clearTimeout(timeout);
        cleanup();
        resolve(data);
      };

      script.onerror = () => {
        clearTimeout(timeout);
        cleanup();
        reject(new Error('JSONP script load error'));
      };

      function cleanup() {
        try { delete window[callbackName]; } catch (e) { window[callbackName] = undefined; }
        if (script.parentNode) script.parentNode.removeChild(script);
      }

      document.head.appendChild(script);
    });
  }

  // Public API implemented via JSONP GETs
  async function apiGet(params = {}) {
    const res = await jsonpRequest(params);
    if (!res || res.ok === false) throw new Error(res && res.error ? res.error : 'API error');
    return res;
  }

  // For writes we use GET-based handlers on the Apps Script (register/incscore/setcurrentquestion)
  async function apiPostAsGet(body = {}) {
    const params = Object.assign({}, body);
    const res = await jsonpRequest(params);
    if (!res || res.ok === false) throw new Error(res && res.error ? res.error : 'API error');
    return res;
  }

  async function registerOrGetUser(name) {
    if (!name || !name.trim()) throw new Error('Name is required');
    const payload = await apiPostAsGet({ action: 'register', name: String(name).trim() });
    if (!payload.user) throw new Error('Unexpected API response');
    return payload.user;
  }

  async function getUsersSorted() {
    const payload = await apiGet({ action: 'users' });
    const users = payload.users || [];
    return users.map(u => ({ ...u, score: Number(u.score) || 0 })).sort((a,b) => (b.score || 0) - (a.score || 0));
  }

  async function getCurrentQuestion() {
    const payload = await apiGet({ action: 'question' });
    return payload.currentQuestionId ? { id: String(payload.currentQuestionId), text: null } : null;
  }

  async function incrementScore({ name, id, amount = 1 } = {}) {
    if (!name && !id) throw new Error('name or id required to increment score');
    const params = { action: 'incscore', amount: Number(amount) || 1 };
    if (name) params.name = name;
    if (id) params.id = id;
    const payload = await apiPostAsGet(params);
    return payload.updated || null;
  }

  async function checkAdminPassword(pw) {
    // harmless verification by re-setting the same currentQuestionId
    const q = await getCurrentQuestion();
    const currentId = q && q.id ? q.id : '';
    try {
      const res = await apiPostAsGet({ action: 'setcurrentquestion', questionId: currentId, password: pw });
      return res && res.ok === true;
    } catch (err) {
      return false;
    }
  }

  async function setCurrentQuestion(questionId, password) {
    const res = await apiPostAsGet({ action: 'setcurrentquestion', questionId: String(questionId || ''), password });
    return res;
  }

  window.Boonstra = {
    registerOrGetUser,
    getUsersSorted,
    getCurrentQuestion,
    incrementScore,
    checkAdminPassword,
    setCurrentQuestion,
    API_URL
  };
})();