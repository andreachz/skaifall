// main.js

// very first line in app
process.emitWarning = (msg, type, code, ...args) => {
  if (type === 'DeprecationWarning' && String(msg).includes('punycode')) {
    return; // swallow punycode deprecation warnings
  }
  if(process.__proto__.emitWarning)
  return process.__proto__.emitWarning.call(process, msg, type, code, ...args);
};

const fs = require('fs');
const path = require('path');

const {getPageInfo, chatRequirementsAPI, conversationAPI, updateState} = require('./apis')

// const code = fs.readFileSync(path.join(__dirname, 'page-env-emulator.js'), 'utf8');
// eval(code); // executes in THIS scope

// const code2 = fs.readFileSync(path.join(__dirname, 'openai-code.js'), 'utf8');
// eval(code2); // executes in THIS scope

const {store, DEFAULT_STORE, resetStore} = require('./store')
const {SS,generateTokens: XEe, Fp} = require('./openai-code.js');
const { chatPrompt } = require('./interfaces/cli.js');
const { updateProxyListFile } = require('../../../proxy/proxy-fetch-parse.js');
const { registerNewUser, loginUser } = require('./oai-auth-api-cjar.js');
const store_auth = require('./store_auth.js');

const USER_DATA_PATH = '../userdata.json'



// ;(async ()=>{
// if(!fs.existsSync(path.join(__dirname,USER_DATA_PATH))){

//   let data = await registerNewUser()
  
//   store_auth.data.access_token = data.accessToken.toString();
//   store_auth.data.cookie = data.sessionCookies.toString();
//   store_auth.data.username = data.username.toString();
//   store_auth.data.password = data.password.toString();
//   console.log(data, store_auth.data,'xx')
//   fs.writeFileSync(USER_DATA_PATH, JSON.stringify(store_auth.data,null,1))
//   resetStore()
//   updateState()
// }
// else{
//   let data=JSON.parse(fs.readFileSync(USER_DATA_PATH))
//   store_auth.data.access_token = data.access_token.toString();
//   store_auth.data.cookie = data.cookie.toString();

//   if(1){
//   data = await loginUser(data.username, data.password)

//   store_auth.data.access_token = data.accessToken.toString();
//   store_auth.data.cookie = data.sessionCookies.toString();
//   store_auth.data.username = data.username.toString();
//   store_auth.data.password = data.password.toString();
//   fs.writeFileSync(USER_DATA_PATH, JSON.stringify(store_auth.data,null,1))
//   }
//   // console.log('ciao', store_auth.data)
// }
// })()



setTimeout(()=>{

;(async ()=>{
        // await updateProxyListFile()        
        chatPrompt()
})()
},100)