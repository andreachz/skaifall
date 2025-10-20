// store.js (CommonJS version)
let store = {
  stored_cookie: null,
  data_build: null,
  chatReq: null,
  reqToken: null,
  proofToken: null,
  turnstileToken: null,
  conversation_id: undefined,
  parent_message_id: undefined,

  oldtoken: null,
  isUpdatingTokens: false
};

let chatMetadata = {
  gpt_model: undefined
}

const DEFAULT_STORE = JSON.parse(JSON.stringify(store));

function resetStore() {
  // Clear existing keys in `store` and copy from DEFAULT_STORE
  Object.keys(store).forEach(key => {
    store[key] = DEFAULT_STORE[key];
  });
}

module.exports = { store, DEFAULT_STORE, resetStore, chatMetadata };
