// Common client-side utilities for the static GitHub Pages site
(function () {
  const STORAGE_USERS = 'boonstra-users';
  const STORAGE_QUESTIONS = 'boonstra-questions';
  const STORAGE_ADMIN_PW = 'boonstra-admin-password';

  function loadUsers() {
    try {
      const raw = localStorage.getItem(STORAGE_USERS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
  function saveUsers(users) {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  }

  function loadQuestions() {
    try {
      const raw = localStorage.getItem(STORAGE_QUESTIONS);
      return raw ? JSON.parse(raw) : { current: null, questions: [] };
    } catch (e) {
      return { current: null, questions: [] };
    }
  }
  function saveQuestions(q) {
    localStorage.setItem(STORAGE_QUESTIONS, JSON.stringify(q));
  }

  function findUserByName(name) {
    const users = loadUsers();
    const lower = name.trim().toLowerCase();
    return users.find(u => u.name.toLowerCase() === lower);
  }

  function registerOrGetUser(name) {
    if (!name || !name.trim()) throw new Error('Name is required');
    const users = loadUsers();
    const lower = name.trim().toLowerCase();
    const existing = users.find(u => u.name.toLowerCase() === lower);
    if (existing) return existing;
    const user = { id: Date.now().toString(), name: name.trim(), score: 0, createdAt: new Date().toISOString() };
    users.push(user);
    saveUsers(users);
    return user;
  }

  function getCurrentQuestion() {
    const q = loadQuestions();
    return q.current;
  }

  function getUsersSorted() {
    const users = loadUsers();
    return users.slice().sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  function getAdminPassword() {
    const pw = localStorage.getItem(STORAGE_ADMIN_PW);
    return pw || 'changeme';
  }
  function checkAdminPassword(pw) {
    return pw === getAdminPassword();
  }
  function setAdminPassword(pw) {
    localStorage.setItem(STORAGE_ADMIN_PW, pw);
  }

  // Export to global namespace for the static pages
  window.Boonstra = {
    loadUsers,
    saveUsers,
    loadQuestions,
    saveQuestions,
    findUserByName,
    registerOrGetUser,
    getCurrentQuestion,
    getUsersSorted,
    getAdminPassword,
    checkAdminPassword,
    setAdminPassword
  };
})();
