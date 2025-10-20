// Client library for Boonstra Quiz (Apps Script backend)
// Configure API_URL to your deployed Apps Script web app (deployed URL provided by you)
const API_URL = 'https://script.google.com/macros/s/AKfycbxukS8vvGdJkhp7XVnkDaG42Msp-B7DQusgsbmfDIB8-uAcKPyA8Q69mw-XjSqo5itj/exec';

(function () {
  async function apiGet(params = {}) {
    const url = new URL(API_URL);
    Object.keys(params).forEach(k => url.searchParams.set(k, params[k]));
    const res = await fetch(url.toString(), { method: 'GET', cache: 'no-cache' });
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  }

  async function apiPost(body = {}) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    // Apps Script often returns 200 with JSON containing ok:false for errors
    if (!res.ok) {
      const text = await res.text().catch(()=>null);
      throw new Error('Network error: ' + (text || res.statusText));
    }
    const j = await res.json();
    if (j && j.ok === false) throw new Error(j.error || 'API error');
    return j;
  }

  // Public API expected by the static pages
  async function registerOrGetUser(name) {
    if (!name || !name.trim()) throw new Error('Name is required');
    const payload = await apiPost({ action: 'register', name: String(name).trim() });
    // payload.user as per the Apps Script implementation
    if (!payload.user) throw new Error('Unexpected API response');
    return payload.user;
  }

  async function getUsersSorted() {
    const payload = await apiGet({ action: 'users' });
    const users = payload.users || [];
    // ensure numeric scores and sort descending
    return users.map(u => ({ ...u, score: Number(u.score) || 0 }))
                .sort((a,b) => (b.score || 0) - (a.score || 0));
  }

  async function getCurrentQuestion() {
    // Apps Script sample returns currentQuestionId in -> ?action=question
    const payload = await apiGet({ action: 'question' });
    // Provide consistent shape: { id: "...", text: null } (you can expand in Apps Script later)
    return payload.currentQuestionId ? { id: String(payload.currentQuestionId), text: null } : null;
  }

  async function incrementScore({ id, name, amount = 1 } = {}) {
    if (!id && !name) throw new Error('id or name required to increment score');
    const body = { action: 'incscore', amount: Number(amount) || 1 };
    if (id) body.id = id;
    if (name) body.name = name;
    const payload = await apiPost(body);
    return payload.updated || null;
  }

  // Admin helpers
  // Check admin password by attempting to set the current question to its existing value.
  // This is a harmless verification (it sets currentQuestionId to the same value if password is correct).
  async function checkAdminPassword(pw) {
    // Fetch current question id
    const q = await getCurrentQuestion();
    const currentId = q && q.id ? q.id : '';
    try {
      await apiPost({ action: 'setcurrentquestion', questionId: currentId, password: pw });
      return true;
    } catch (err) {
      return false;
    }
  }

  async function setCurrentQuestion(questionId, password) {
    const payload = await apiPost({ action: 'setcurrentquestion', questionId: String(questionId || ''), password });
    return payload;
  }

  // Expose the API for the pages
  window.Boonstra = {
    // data operations
    registerOrGetUser,
    getUsersSorted,
    getCurrentQuestion,
    incrementScore,

    // admin
    checkAdminPassword,
    setCurrentQuestion,

    // raw helpers in case you want to do custom calls
    _apiGet: apiGet,
    _apiPost: apiPost,
    API_URL
  };
})();
