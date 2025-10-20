// const {SS, XEe: generateTokens} = require('./openai-code');
const {getNewState, getOaiDeviceId, getOaiSentinelToken} = require('./apis')

const readline = require("readline");



;const { getRandomUserAgent } = require('./helpers');
const { newTempMail, waitMessage, getTempMailCreds } = require('../../../temp-mail/api');
const delay = (ms) => new Promise(r => setTimeout(r, ms));

;(async()=>{

let tempMail = await newTempMail()

// console.log(getTempMailCreds())
// process.exit()

let res_authorize = await fetch("https://auth.openai.com/api/accounts/authorize?client_id=app_X8zY6vW2pQ9tR3dE7nK1jL5gH&scope=openid%20email%20profile%20offline_access%20model.request%20model.read%20organization.read%20organization.write&response_type=code&redirect_uri=https%3A%2F%2Fchatgpt.com%2Fapi%2Fauth%2Fcallback%2Fopenai&audience=https%3A%2F%2Fapi.openai.com%2Fv1&device_id=80d16a7f-5f7b-4683-8b24-59d28630df54&prompt=login&screen_hint=login_or_signup&ext-oai-did=80d16a7f-5f7b-4683-8b24-59d28630df54&auth_session_logging_id=3eb22655-b0fb-481e-a70f-00301afcbe7a&state=vS92ORiaen3yuI1746EuqYV_a4zSXC6pMLLSscc7TjU", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "priority": "u=0, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "cross-site",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "User-Agent": getRandomUserAgent(0)
  },
  "referrer": "https://chatgpt.com/",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include",
  redirect: 'manual'
});


// headers.raw()['set-cookie'];
console.log('response /authorize', await res_authorize.text(), res_authorize.ok)
let cookie = res_authorize.headers.getSetCookie()
console.log('cookies authorize', cookie)
let oaisentinel_autorize_continue = await getOaiSentinelToken('authorize_continue')
// return
// console.log(token)

// let email = process.argv[2] || 'tacehi7492@fanwn.com'
let email = tempMail.mailbox
console.log(email)
let password = '00000000000000004f35afb18b243564'

let res_continue = await fetch("https://auth.openai.com/api/accounts/authorize/continue", {
  "headers": {
    "accept": "application/json",
    "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "openai-sentinel-token": JSON.stringify(oaisentinel_autorize_continue),
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "traceparent": "00-00000000000000004f35afb18b243564-17a6d6c41cc59a37-01",
    "tracestate": "dd=s:1;o:rum",
    "x-datadog-origin": "rum",
    "x-datadog-parent-id": "1704285646790957623",
    "x-datadog-sampling-priority": "1",
    "x-datadog-trace-id": "5707661279840449892",
    "User-Agent": getRandomUserAgent(0),
    "cookie": cookie.join('; ')
  },
  "referrer": "https://auth.openai.com/log-in-or-create-account",
  "body": JSON.stringify(
    {
    "username": {
        "kind": "email",
        "value": email
    },
    "screen_hint": "login_or_signup"
    }
  ),
  "method": "POST",
  "mode": "cors",
  "credentials": "include",
  redirect: 'manual'
});

console.log('response /continue with mail', await res_continue.text(), res_continue.ok)
// response /continue with mail {
//   "continue_url": "https://auth.openai.com/create-account/password",
//   "method": "GET",
//   "page": {
//     "type": "create_account_password",
//     "backstack_behavior": "default"
//   }
// } true
// {"continue_url":"https://auth.openai.com/api/accounts/email-otp/send","method":"GET","page":{"type":"email_otp_send","backstack_behavior":"default"}} true

let oaisentinel_username_password_create = await getOaiSentinelToken('username_password_create')
let cookie2 = res_continue.headers.getSetCookie()

let res_register = await fetch("https://auth.openai.com/api/accounts/user/register", {
  "headers": {
    "accept": "application/json",
    "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "openai-sentinel-token": JSON.stringify(oaisentinel_username_password_create),
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "traceparent": "00-00000000000000001a59bc4887143827-2880f1b2600838a9-01",
    "tracestate": "dd=s:1;o:rum",
    "x-datadog-origin": "rum",
    "x-datadog-parent-id": "2918598306953705641",
    "x-datadog-sampling-priority": "1",
    "x-datadog-trace-id": "1898755737603291175",
    "cookie": cookie2.join('; '),
    "User-Agent": getRandomUserAgent(0),
    
  },
  "referrer": "https://auth.openai.com/create-account/password",
  "body": JSON.stringify({
    username: email,
    password: password
  }),
  "method": "POST",
  "mode": "cors",
  "credentials": "include",
  redirect: 'manual'
});

console.log(await res_register.text(), res_register.ok)

let cookie3 = res_register.headers.getSetCookie()


let res_otp_send = await fetch("https://auth.openai.com/api/accounts/email-otp/send", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "it-IT,it;q=0.9",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "priority": "u=0, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "cookie": cookie3.join('; '),
    "User-Agent": getRandomUserAgent(0),
    redirect: 'manual'
  },
  "referrer": "https://auth.openai.com/create-account/password",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include",
  redirect: 'manual'
});

console.log('response /send', await res_otp_send.text(), res_otp_send.ok)

let cookie4 = res_otp_send.headers.getSetCookie()


let res_email_ver = await fetch("https://auth.openai.com/email-verification", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "it-IT,it;q=0.9",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "priority": "u=0, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "cookie": cookie4.join('; '),
    "User-Agent": getRandomUserAgent(0)
  },
  "referrer": "https://auth.openai.com/create-account/password",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include",
  redirect: 'manual'
});

console.log('response /email-verification:', await res_email_ver.text(), res_email_ver.ok)
let cookie4_1 = res_email_ver.headers.getSetCookie()

let otpcode = '615059'

console.log('waiting for message otp via mail...')
// otpcode = await askQuestion("enter otp code: ");
let msg = await waitMessage(getTempMailCreds())
otpcode = msg.subject.split(' ').slice(-1)[0]

console.log(`you entered code: ${otpcode}`);
otpcode = otpcode.toString()

await delay(1000)

let res_validate = await fetch("https://auth.openai.com/api/accounts/email-otp/validate", {
  "headers": {
    "accept": "application/json",
    "accept-language": "it-IT,it;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "traceparent": "00-0000000000000000f4b933cec07464b7-353c238878ce8441-01",
    "tracestate": "dd=s:1;o:rum",
    "x-datadog-origin": "rum",
    "x-datadog-parent-id": "3835980051662144577",
    "x-datadog-sampling-priority": "1",
    "x-datadog-trace-id": "17634182779031020727",
    "cookie": extractCookies([...cookie, ...cookie2, ...cookie3, ...cookie4, ...cookie4_1,]).join('; '),
    "User-Agent": getRandomUserAgent(0),
  },
  "referrer": "https://auth.openai.com/email-verification",
  "body": JSON.stringify({code: otpcode}),
  "method": "POST",
  "mode": "cors",
  "credentials": "include",
  redirect: 'manual'
});
console.log(extractCookies([...cookie, ...cookie2, ...cookie3, ...cookie4, ...cookie4_1,]).join('; '))
console.log('response /validate:', await res_validate.text(), res_validate.ok)


let cookie5 = res_validate.headers.getSetCookie()

let oaisentinel_oauth_create_account = await getOaiSentinelToken('oauth_create_account') 

let res_create_account = await fetch("https://auth.openai.com/api/accounts/create_account", {
  "headers": {
    "accept": "application/json",
    "accept-language": "it-IT,it;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "openai-sentinel-token": oaisentinel_oauth_create_account ,
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "traceparent": "00-0000000000000000084b1674e742071a-7e7896eb1dddf327-01",
    "tracestate": "dd=s:1;o:rum",
    "x-datadog-origin": "rum",
    "x-datadog-parent-id": "9113199782546764583",
    "x-datadog-sampling-priority": "1",
    "x-datadog-trace-id": "597596066908604186",
    "cookie": cookie5.join('; '),
    "User-Agent": getRandomUserAgent(0)
  },
  "referrer": "https://auth.openai.com/about-you",
  "body": JSON.stringify({
    name: 'luca contini',
    birthdate: '1990-05-05'
  }),
  "method": "POST",
  "mode": "cors",
  "credentials": "include",
  redirect: 'manual'
});

let res_create_account_j = await res_create_account.json()
console.log('response /create_account', res_create_account_j , res_create_account.ok)

let cookie6 = res_create_account.headers.getSetCookie()

let res_auth = await fetch(res_create_account_j.continue_url, {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "it-IT,it;q=0.9",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "priority": "u=0, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "cookie": cookie6.join('; '),
    "User-Agent": getRandomUserAgent(0)
  },
  "referrer": "https://auth.openai.com/about-you",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include",
  redirect: 'manual'
});

console.log('response /auth?audience', await res_auth.text() , res_auth.ok)
console.log('headers', res_auth.headers)

let res_location = await fetch(res_auth.headers.location, {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "it-IT,it;q=0.9",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "priority": "u=0, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "cross-site",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1"
  },
  "referrer": "https://auth.openai.com/",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
});

console.log(await res_location.text())

})()


function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}



function extractCookies(setCookies) {
  const cookieMap = new Map();

  for (const cookie of setCookies) {
    const [nameValue] = cookie.split(";"); // take "name=value"
    const [name, value] = nameValue.split("=");
    cookieMap.set(name.trim(), value.trim()); // overwrite duplicates with the latest
  }

  // Rebuild into "name=value" pairs
  return Array.from(cookieMap.entries()).map(([name, value]) => `${name}=${value}`);
}


// extractCookies(setCookieHeaders).join("; ")