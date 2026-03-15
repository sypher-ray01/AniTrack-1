/* ============================================
   AniTrack — Fake Auth System
   Web Crypto API SHA-256 · Session Tokens
   ============================================ */

const Auth = (() => {
  const SESSION_EXPIRY_HOURS = 24;

  /**
   * Hash a password using SHA-256 via Web Crypto API.
   * @param {string} password
   * @returns {Promise<string>} hex digest
   */
  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  /**
   * Generate a session token.
   */
  const generateToken = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
  };

  /**
   * Get all registered users.
   */
  const getUsers = () => {
    return Storage.getItem('users') || [];
  };

  /**
   * Save users array.
   */
  const saveUsers = (users) => {
    Storage.setItem('users', users);
  };

  /**
   * Register a new user.
   * @param {{ username: string, email: string, password: string }} data
   * @returns {Promise<{ success: boolean, message: string, user?: object }>}
   */
  const register = async ({ username, email, password }) => {
    if (!username || !email || !password) {
      return { success: false, message: 'All fields are required.' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    const users = getUsers();
    const emailExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      return { success: false, message: 'Email is already registered.' };
    }

    const usernameExists = users.some(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    if (usernameExists) {
      return { success: false, message: 'Username is already taken.' };
    }

    const passwordHash = await hashPassword(password);
    const user = {
      id: Storage.generateId(),
      username,
      email: email.toLowerCase(),
      passwordHash,
      avatar: '',
      bio: '',
      darkMode: true,
      isAdmin: false,
      joinedAt: new Date().toISOString(),
      stats: {
        totalAnime: 0,
        episodesWatched: 0,
        daysWatched: 0,
        meanScore: 0,
      },
    };

    users.push(user);
    saveUsers(users);

    // Auto-login after register
    await createSession(user);

    return { success: true, message: 'Registration successful!', user };
  };

  /**
   * Log in an existing user.
   * @param {{ email: string, password: string }} data
   * @returns {Promise<{ success: boolean, message: string, user?: object }>}
   */
  const login = async ({ email, password }) => {
    if (!email || !password) {
      return { success: false, message: 'Email and password are required.' };
    }

    const users = getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, message: 'No account found with that email.' };
    }

    const hash = await hashPassword(password);
    if (hash !== user.passwordHash) {
      return { success: false, message: 'Incorrect password.' };
    }

    await createSession(user);
    return { success: true, message: 'Login successful!', user };
  };

  /**
   * Create a session for the user.
   */
  const createSession = async (user) => {
    const token = generateToken();
    const expiresAt = new Date(
      Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000
    ).toISOString();

    Storage.setItem('session', { userId: user.id, token, expiresAt });

    // Store active user reference (without password hash)
    const { passwordHash, ...safeUser } = user;
    Storage.setItem('user', safeUser);
  };

  /**
   * Log out the current user.
   */
  const logout = () => {
    localStorage.removeItem('at_session')
    location.href = '/login.html'
  }

  /**
   * Get the current logged-in user (or null).
   */
  const getCurrentUser = () => {
    const session = Storage.getItem('session');
    if (!session) return null;

    // Check expiry
    if (new Date(session.expiresAt) < new Date()) {
      logout();
      return null;
    }

    return Storage.getItem('user');
  };

  /**
   * Quick auth check.
   */
  const isAuthenticated = () => {
    return getCurrentUser() !== null;
  };

  /**
   * Check if current user is admin.
   */
  const isAdmin = () => {
    const user = getCurrentUser();
    return user?.isAdmin === true;
  };

  /**
   * Redirect guard — call on pages that require auth.
   * Redirects to login.html if not authenticated.
   */
  const requireAuth = () => {
    if (!isAuthenticated()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  };

  /**
   * Require admin privileges — redirects to index if not admin.
   */
  const requireAdmin = () => {
    if (!requireAuth()) return false;
    if (!isAdmin()) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  };

  /**
   * Update the current user's profile.
   * @param {object} updates — fields to merge
   */
  const updateProfile = (updates) => {
    const user = getCurrentUser();
    if (!user) return false;

    const updatedUser = { ...user, ...updates };
    Storage.setItem('user', updatedUser);

    // Also update in users array
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      saveUsers(users);
    }

    return true;
  };

  return {
    hashPassword,
    register,
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    isAdmin,
    requireAuth,
    requireAdmin,
    updateProfile,
  };
})();

window.Auth = Auth;
