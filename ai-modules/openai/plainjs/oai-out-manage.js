const fs = require('fs');
const path = require('path');

const { registerNewUser, loginUser } = require('./oai-auth-api-cjar.js');
const store_auth = require('./store_auth.js');
const { resetStore } = require('./store.js');
const { updateState } = require('./apis.js');

const USER_DATA_PATH = '../userdata.json'


// Assumes these exist in your module scope or are imported:
// - fs, path
// - registerNewUser(): Promise<{ accessToken, sessionCookies, username, password }>
// - loginUser(username, password): Promise<{ accessToken, sessionCookies, username, password }>
// - resetStore(), updateState()
// - store_auth: { data: { access_token?: string, cookie?: string, username?: string, password?: string } }
// - USER_DATA_PATH (optional; can be overridden via options.userDataPath)

/**
 * @typedef {Object} Credentials
 * @property {string} username
 * @property {string} password
 *
 * @typedef {Object} InitAuthOptions
 * @property {'auto'|'register'|'login'} [mode='auto']
 *   - 'auto': if user data file is missing, register; otherwise login
 *   - 'register': always register a new user (overwrites file if persist is true)
 *   - 'login': always login using provided credentials or those stored on disk
 * @property {string} [userDataPath=USER_DATA_PATH] Path to JSON file (relative to __dirname accepted)
 * @property {Credentials} [credentials] Optional explicit credentials for 'login' mode
 * @property {boolean} [persist=true] Write updated auth data back to disk
 * @property {boolean} [refreshLogin=false]
 *   If true and mode='auto' with an existing file, re-login using stored creds
 * @property {(data: any)=>void} [onUpdate] Callback invoked with the final auth data
 */

/**
 * Initializes auth according to the chosen strategy.
 * Returns the normalized auth data: { access_token, cookie, username, password }.
 * @param {InitAuthOptions} opts
 */
async function initAuth(opts = {}) {
  const {
    mode = 'auto',
    userDataPath = typeof USER_DATA_PATH !== 'undefined' ? USER_DATA_PATH : './auth.json',
    credentials,
    persist = true,
    refreshLogin = false,
    onUpdate,
  } = opts;

  const filePath = path.isAbsolute(userDataPath)
    ? userDataPath
    : path.join(__dirname, userDataPath);

  const fileExists = fs.existsSync(filePath);

  /** @type {{ access_token: string, cookie: string, username?: string, password?: string }} */
  let authStateFromDisk = null;

  if (fileExists) {
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      authStateFromDisk = JSON.parse(raw);
    } catch (err) {
      // If the file is corrupted, treat as non-existent
      authStateFromDisk = null;
    }
  }

  // Helper to persist and update in-memory store
  const applyAndPersist = (dataObj) => {
    store_auth.data.access_token = dataObj.accessToken?.toString?.() || dataObj.access_token?.toString?.() || '';
    store_auth.data.cookie = dataObj.sessionCookies?.toString?.() || dataObj.cookie?.toString?.() || '';
    if (dataObj.username) store_auth.data.username = dataObj.username.toString();
    if (dataObj.password) store_auth.data.password = dataObj.password.toString();
    if (dataObj.name) store_auth.data.name = dataObj.name.toString();
    if (dataObj.birthdate) store_auth.data.birthdate = dataObj.birthdate.toString();
    if (dataObj.tempmail) store_auth.data.tempmail = JSON.parse(JSON.stringify(dataObj.tempmail));

    if (persist) {
      const toWrite = {
        access_token: store_auth.data.access_token,
        cookie: store_auth.data.cookie,
        username: store_auth.data.username,
        password: store_auth.data.password,
        name: store_auth.data.name,
        birthdate: store_auth.data.birthdate,
        tempmail: store_auth.data.tempmail
      };
      fs.writeFileSync(filePath, JSON.stringify(toWrite, null, 2), 'utf8');
    }

    // Optional external hooks
    if (typeof onUpdate === 'function') onUpdate({ ...store_auth.data });

    // Local lifecycle hooks (keep your originals)
    if (typeof resetStore === 'function') resetStore();
    if (typeof updateState === 'function') updateState();

    return { ...store_auth.data };
  };

  // Strategy resolution
  if (mode === 'register') {
    const data = await registerNewUser();
    return applyAndPersist(data);
  }

  if (mode === 'login') {
    let user = credentials?.username ?? authStateFromDisk?.username;
    let pass = credentials?.password ?? authStateFromDisk?.password;

    if (!user || !pass) {
      throw new Error(
        "[initAuth] 'login' mode requires credentials (via options.credentials) or a valid user data file."
      );
    }

    const data = await loginUser(user, pass);
    return applyAndPersist(data);
  }

  // mode === 'auto'
  if (!fileExists || !authStateFromDisk) {
    // No saved state: register then persist
    const data = await registerNewUser();
    return applyAndPersist(data);
  } else {
    // We have saved state
    if (refreshLogin) {
      // Re-login using stored credentials
      const user = authStateFromDisk.username;
      const pass = authStateFromDisk.password;

      if (!user || !pass) {
        // If stored creds are missing, fall back to register
        const data = await registerNewUser();
        return applyAndPersist(data);
      }

      const data = await loginUser(user, pass);
      return applyAndPersist(data);
    } else {
      // Just load into memory without a fresh login
      return applyAndPersist({
        accessToken: authStateFromDisk.access_token,
        sessionCookies: authStateFromDisk.cookie,
        username: authStateFromDisk.username,
        password: authStateFromDisk.password,
      });
    }
  }
}


// // 1) Auto mode (default): register if file missing; otherwise just load from disk
// await initAuth();

// // 2) Auto mode but force a fresh login if a file exists
// await initAuth({ refreshLogin: true });

// // 3) Always register a brand-new user and overwrite the saved file
// await initAuth({ mode: 'register' });

// // 4) Always login using explicit credentials (won’t read from disk for creds)
// await initAuth({
//   mode: 'login',
//   credentials: { username: 'alice', password: 's3cret' },
// });

// // 5) Use a custom storage path and disable persistence
// await initAuth({
//   userDataPath: './.cache/my-auth.json',
//   persist: false,
// });



/**
 * Logs out the current user.
 *
 * @param {Object} [opts]
 * @param {string} [opts.userDataPath=USER_DATA_PATH] Path to the stored auth file.
 * @param {boolean} [opts.deleteFile=true] Whether to remove the saved auth file.
 * @param {boolean} [opts.reset=true] Whether to call resetStore() and updateState().
 */
function logout(opts = {}) {
  const {
    userDataPath = typeof USER_DATA_PATH !== 'undefined' ? USER_DATA_PATH : './auth.json',
    deleteFile = true,
    reset = true,
  } = opts;

  const filePath = path.isAbsolute(userDataPath)
    ? userDataPath
    : path.join(__dirname, userDataPath);

  // Clear in-memory store
  store_auth.data = {
    access_token: '',
    cookie: '',
    username: '',
    password: '',
  };

  // Delete saved file if requested
  if (deleteFile && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.warn(`[logout] Failed to delete auth file at ${filePath}:`, err.message);
    }
  }

  // Reset app state if requested
  if (reset) {
    if (typeof resetStore === 'function') resetStore();
    if (typeof updateState === 'function') updateState();
  }

  return { ...store_auth.data };
}

// // Soft logout (just clears memory, keeps file on disk)
// logout({ deleteFile: false });

// // Full logout (default: clears memory + removes file)
// logout();

// // Custom path logout
// logout({ userDataPath: './.cache/my-auth.json' });


module.exports = {initAuth, logout}