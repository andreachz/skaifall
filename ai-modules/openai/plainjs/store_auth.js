// store_auth.js (CommonJS version)
let data = {
  access_token: undefined,
  cookie: undefined
};

const DEFAULT_STORE_AUTH = JSON.parse(JSON.stringify(data))

module.exports = {data, DEFAULT_STORE_AUTH};
