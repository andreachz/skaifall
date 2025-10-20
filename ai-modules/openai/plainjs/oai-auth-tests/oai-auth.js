// const {SS, XEe: generateTokens} = require('./openai-code');
const {getNewState, getOaiDeviceId, getOaiSentinelToken, getPageInfo} = require('./apis')

const readline = require("readline");

const fs = require('fs')

;const { getRandomUserAgent } = require('./helpers');
const { newTempMail, waitMessage, getTempMailCreds } = require('../../../temp-mail/api');
const { runCurlImpersonate, runCurlImpersonate2 } = require('./impersonate-api');
const delay = (ms) => new Promise(r => setTimeout(r, ms));

const {fetch: fetch11, Agent} = require('undici');
const tls = require('tls')

;(async()=>{


  let rr = await fetch("https://chatgpt.com/", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
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
  redirect: 'follow'
});
let rrr = await rr.text()
let cookie0 = rr.headers.getSetCookie()
// console.log(cookie0)

// process.exit()


let tempMail = await newTempMail()

// console.log(getTempMailCreds())
// process.exit()


  function generateUrlSafeString(length = 32) {
  // const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

// console.log(generateUrlSafeString(32)); 
// e.g. "ex8qo0hWkWyFSYeiUZSifd6Xqw7FRXIzi"

  // let did = crypto.randomUUID()
//   let did = getOaiDeviceId()
    let did = cookie0.find(x=>x.includes('oai-did=')).split('=')[1].split(';')[0]
//   console.log(did)
  
  let did2 = crypto.randomUUID()
  let random43 = generateUrlSafeString(43)

let csrf = cookie0.find(x=>x.includes('__Host-next-auth.csrf-token=')).split('=')[1].split('%')[0]
console.log(csrf)

let res_signin = await fetch(`https://chatgpt.com/api/auth/signin/openai?prompt=login&screen_hint=login_or_signup&ext-oai-did=${did}&auth_session_logging_id=${did2}`, {
  "headers": {
    "accept": "*/*",
    "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/x-www-form-urlencoded",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    // "cookie": "__Host-next-auth.csrf-token=b739f0df11a912f78e03d6f50d58a9a872f18acc564fec013b3e9c2d06283811%7Cc01eefa3b71e8ab0e088ed0816110fb9904219a0f474adb2eb408f9dcb3b9d1e; oai-did=f064c7a5-51fc-45fb-9e13-22f31bc46a31; _cfuvid=itBg6Vw1yFDtLYFUyyX9LjLKrBC5_wv0Jn4fmdq6vXg-1757860957697-0.0.1.1-604800000; oai-cbs=%2F; oai-cbi=true; __Secure-next-auth.callback-url=https%3A%2F%2Fchatgpt.com%2F; __cflb=0H28vzvP5FJafnkHxjEvk77o76biQUZ4rhAuhWG32W7; __cf_bm=W028eo.HcogvxVU_8AghZwOyf_rI4JYCLIYh49wFtfs-1757876374-1.0.1.1-bcgnO0m7boMhA6AaorvLvuqriFSoHqWRHdJvycgvkFrIoNQqL3dDyig9tUSmVjxrZNj3BcH48B.zIaBILZ9BNd79GwC7wBX1JGqiT742cfM; cf_clearance=1Xp_YhUKJ.LL9VRZavXkjF4EMN0oTdGoUmjS5HB9.jA-1757876635-1.2.1.1-5V2r1uYPpSvh5VhxopTg7odKuaPfV3cM5_ar28uEpUgv5n0TFRiCLzaugAAh.fNzU2pIYy.O.GVDeKm0.SNqhMRQ8U1.zsU93yFU94jukmU8Sk2GALEnsOORhY_kFlyCKNhKRJ.Xfw81HmNQC6BXEW0AD429qB8yLKKDGkSuK9QyI_s40UPqBPSuSwSd9PCFt9ALs9IChpt8MFOtGIjB3lJ40RdbjiV5kAe27vMp_2g; oai-sc=0gAAAAABoxxKuAdoVr01gdHubU2E5ShYyB28ObGQ8PS8GBK6KOLiAhGRStNQdu-ourL7RWAN5DHGi9Ucla38r3hq1P6XwSr8_HrtrPp-Nz3doaSjlhAjcp4kxj7xFIknyW5RmN33Bxl9YQKcr90RHZHFr23K0QzlhJnS9Xg6V6S9XWVUsWGH5AYx8ow8hOCouFHoban7o7q3TkU8KDyfb_XIPeiTKpTPcBJSpVZ2ZCzaydLX4ebGevMc; _dd_s=aid=8f518279-39b9-4026-9f82-bebc34737e0b&rum=0&expire=1757877816969&logs=1&id=b7c3ef11-a4d9-4ff2-a65b-5cfd4efe3eb7&created=1757873498318; oai-asli=8ff2e7c7-5145-4245-aca7-2ee3e9d56902",
    "cookie": extractCookies([...cookie0,]).join('; '),
    "Referer": "https://chatgpt.com/?utm_source=google&utm_medium=paidsearch_brand&utm_campaign=GOOG_C_SEM_GBR_Core_CHT_BAU_ACQ_PER_MIX_ALL_EMEA_IT_IT_052825&utm_term=chatgpt&utm_content=183234765107&utm_ad=754994199481&utm_match=e&gad_source=1&gad_campaignid=22605680082&gbraid=0AAAAA-IW-UXEt1p02NnDsfzeVDwVYdaIH&gclid=EAIaIQobChMI8tuUpe3YjwMVgJCDBx3XRgDYEAAYASAAEgJiV_D_BwE",
    "User-Agent": getRandomUserAgent(0)
  },
  "body": `callbackUrl=%2F&csrfToken=${csrf}&json=true`,
  "method": "POST"
});

let cookie01 = res_signin.headers.getSetCookie()
console.log(cookie01)
// process.exit()



  
  // /authorize (jar stores Set-Cookie automatically)
//   let authurl = `https://auth.openai.com/api/accounts/authorize?client_id=app_X8zY6vW2pQ9tR3dE7nK1jL5gH&scope=openid%20email%20profile%20offline_access%20model.request%20model.read%20organization.read%20organization.write&response_type=code&redirect_uri=https%3A%2F%2Fchatgpt.com%2Fapi%2Fauth%2Fcallback%2Fopenai&audience=https%3A%2F%2Fapi.openai.com%2Fv1&device_id=${did}&prompt=login&screen_hint=login_or_signup&ext-oai-did=${did}&auth_session_logging_id=${did2}&state=${random43}`
  let authurl = (await res_signin.json()).url
  
  console.log(authurl)
// process.exit()
let res_authorize = await fetch(
    authurl
    // "https://auth.openai.com/api/accounts/authorize?client_id=app_X8zY6vW2pQ9tR3dE7nK1jL5gH&scope=openid%20email%20profile%20offline_access%20model.request%20model.read%20organization.read%20organization.write&response_type=code&redirect_uri=https%3A%2F%2Fchatgpt.com%2Fapi%2Fauth%2Fcallback%2Fopenai&audience=https%3A%2F%2Fapi.openai.com%2Fv1&device_id=80d16a7f-5f7b-4683-8b24-59d28630df54&prompt=login&screen_hint=login_or_signup&ext-oai-did=80d16a7f-5f7b-4683-8b24-59d28630df54&auth_session_logging_id=3eb22655-b0fb-481e-a70f-00301afcbe7a&state=vS92ORiaen3yuI1746EuqYV_a4zSXC6pMLLSscc7TjU"
    , {
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
    "cookie": extractCookies([...cookie0,...cookie01]).join('; '),
    "User-Agent": getRandomUserAgent(0),
    "referer": "https://chatgpt.com/",
  },
  "referrer": "https://chatgpt.com/",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include",
  redirect: 'manual'
});



// headers.raw()['set-cookie'];
console.log('response /authorize', await res_authorize.text(), res_authorize.ok, res_authorize.status, res_authorize.statusText)
let cookie = res_authorize.headers.getSetCookie()
console.log('cookies authorize', cookie)
console.log('headers', res_authorize.headers)
// process.exit()

did = cookie.find(x=>x.includes('oai-did=')).split('=')[1].split(';')[0]




let res_login = await fetch("https://auth.openai.com/log-in-or-create-account", {
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
    "upgrade-insecure-requests": "1",
    "Referer": "https://chatgpt.com/",
    "cookie": extractCookies([...cookie0,...cookie01,...cookie]).join('; '),
    "User-Agent": getRandomUserAgent(0)
  },
  "body": null,
  "method": "GET"
});

console.log('response /log-in-or-create-account', await res_login.text(), res_login.ok, res_login.status, res_login.statusText)
let cookie1 = res_login.headers.getSetCookie()
console.log('cookies log-in-or-create-account', cookie1)





let oaisentinel_autorize_continue = await getOaiSentinelToken('authorize_continue', did)
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
    "cookie": extractCookies([...cookie0,...cookie01,...cookie,...cookie1]).join('; '),
    "referer": "https://auth.openai.com/log-in-or-create-account",
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

console.log('response /continue with mail', await res_continue.text(), res_continue.ok, res_continue.status, res_continue.statusText)
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
    "referer": "https://auth.openai.com/create-account/password",
    "cookie": extractCookies([...cookie0,...cookie01,...cookie,...cookie1, ...cookie2,]).join('; '),
    "User-Agent": getRandomUserAgent(0),
    "referer": "https://auth.openai.com/create-account/password",
    
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

console.log(await res_register.text(), res_register.ok, res_register.status, res_register.statusText)

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
    "cookie": extractCookies([...cookie0,...cookie01,...cookie,...cookie1, ...cookie2, ...cookie3]).join('; '),
    "User-Agent": getRandomUserAgent(0),
    redirect: 'manual',
    "referer": "https://auth.openai.com/create-account/password",
  },
  "referrer": "https://auth.openai.com/create-account/password",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include",
  redirect: 'manual'
});

console.log('response /send', await res_otp_send.text(), res_otp_send.ok, res_otp_send.status, res_otp_send.statusText)

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
    "cookie": extractCookies([...cookie0,...cookie01,...cookie,...cookie1, ...cookie2, ...cookie3, ...cookie4,]).join('; '),
    "User-Agent": getRandomUserAgent(0),
    "referer": "https://auth.openai.com/create-account/password"
  },
  "referrer": "https://auth.openai.com/create-account/password",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include",
  redirect: 'manual'
});

console.log('response /email-verification:', await res_email_ver.text(), res_email_ver.ok, res_email_ver.status, res_email_ver.statusText)
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
    "cookie": extractCookies([...cookie0,...cookie01,...cookie,...cookie1, ...cookie2, ...cookie3, ...cookie4, ...cookie4_1,]).join('; '),
    "User-Agent": getRandomUserAgent(0),
    "referer": "https://auth.openai.com/email-verification"
  },
  "referrer": "https://auth.openai.com/email-verification",
  "body": JSON.stringify({code: otpcode}),
  "method": "POST",
  "mode": "cors",
  "credentials": "include",
  redirect: 'manual'
});
console.log(extractCookies([...cookie0,...cookie01,...cookie,...cookie1, ...cookie2, ...cookie3, ...cookie4, ...cookie4_1,]).join('; '))
console.log('response /validate:', await res_validate.text(), res_validate.ok, res_validate.status, res_validate.statusText)


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
    "User-Agent": getRandomUserAgent(0),
    "referer": "https://auth.openai.com/about-you",
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
console.log('response /create_account', res_create_account_j , res_create_account.ok, res_create_account.status, res_create_account.statusText, )

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
    "cookie": extractCookies([...cookie0,...cookie01,...cookie,...cookie1, ...cookie2, ...cookie3, ...cookie4, ...cookie4_1,...cookie5,...cookie6]).join('; '),
    "User-Agent": getRandomUserAgent(0),
    "referer": "https://auth.openai.com/about-you"
  },
  "referrer": "https://auth.openai.com/about-you",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include",
  redirect: 'manual' //302
});

let auth_body = await res_auth.text()
console.log('response /auth?audience', auth_body , res_auth.ok, res_auth.status, res_auth.statusText)
console.log('headers', res_auth.headers)
// fs.writeFileSync('file.html',auth_body)

let cookie7 = res_auth.headers.getSetCookie()

// process.exit()


// <a href="https://auth.openai.com/api/accounts/consent?consent_challenge=KhotejHMkIXBpM2qFdjKJuKd60wSggrzyoMbrcfUxp0-kxedlf8925VmXRbMNGuWM5wVNoyx9bBJIT6JN5MJn6MIeDQDbyFUeFvudOYI-SnpylEzkRMjyVLwjI_xyucadwv8B88F-Yyhy6uJA8cLS6P2-Uou2178_aUWyt5KznP7QFe-tki2CgI8YFJrVHZbUiEedugQXvSMf2Fkq15J8u6H8ioZY2517GQOpQA_1D-bUs8dmJSuS-rK10YvUzuCWCgMgq36S47Fmxp2BNGPEOT_CcLgv4_L-WI9Y-X1dpR0URP-c36yC8ZrX__zali3NUP0M55b7lQNcS5-VDUmEQOU-3V46ibQ7BwOtSyNB6T1oUKXIK-FEIjjLpvDE0RicxNUJ5yUTYEQggfGjafA4t2Liredu_NPX4Ns_n4YJI-Pf4mr98jni7fMxOXiMduwe7s8ll37ZnNcxNgrQquO5fN78SzE6J3CGWEQ-tuyVHzuHAh_4uHUqf7gED-pvIw9VyA2DDUNMoBYtgmJqekAYe_u7OJbz9uSOAXCFSmDKp76AJ7TeRkKDYTlDphFAOEqnr7Xys5B6E_VTNdGkZxLT4e68CSoyMZKRIHzz-Q4vGkISureg4dL7b644EDeDkygaj6hnzyzm6nkQq2Kdi4a0EDNPL5pAoFKNGZJ_wLNSyYH5a5HMEy2-gfuX9JvGf1cJUsiHnGKArtQqkGVPBH4472ZUcgVmDRb-Wb4njCGvoilMnvvSOF-4H865Freh0RZ0rV4JcjVdtETgy1EptuuDnhAsakiOn0zRBRg5MLE1vnd8X2j9jTDxfa9rSSx9KDbeDanRVmwOJ-LdJIgeceEjqmptFUXjYdoD78zEk4qqhNdwN8uRZILfDJLIMlGosIy1eWOOX9gAkvX7yetuWryoDSrJYEAPHdW5l2jEj6b2iFX7VtJkG0loQFh-DpXre4ZWA1TEjYvKuYLzlt5KGFIw0TnfTCWfBXyR5FXBkkZYEEiI6zIe_GD7HA59MHngMdZ4EOQM_fECuTZSHgHLAsmUDOcZUTHKn7KglaBH6FGc9Ncn6lEfR_4YaFcx8Eiy_hBYQVvJ0pnfI9j7_DyN3tBHQ-ztMjHiBED-kBgS4YszNkxkDxwKqjnHZfJvIgijrkkbJ3GltNwiUjfKmmvVitg_36CRSBVcaXmVuq6_Gea1G6gyml3YAyxDHKxyOk4g0UWgxp4626dvrpxLAU41HC1j-1dlEEIRtvsmldR8vTvi2f0cnd5kD2e_QjEBtAGQxkMjGoDv6YYkIK8dFvz1McrisM1JbREUa_CKxatuvYuO4CUJ4PEzwF1VNJQYGASmNYpuEw6C8mHpxNmuEhUL3FOL66GAax6oDmJEzT6g1dMztguzl2bsgm29eIuPr38ser5boYw784f_-KI80cvjAm9Kuz_7m5gP-f_kO-BZiSn6-C7yX5SkJ0KoNKj3Wlu7wAbDSoUl4i5iqBESpw-jqMTwFg0A35ckCuvGMbNwEnIjchCH4k38_vobtOC_5pVRTKnnQX0qK9QQ9MmXLct-lcIYmuiLrN3mAjFg-mr9FPHNzC5-DQUaA9pPqyQ98S652luqtwJLFKhsOsJsTUNITibjBgzfD1ZXQUefjJj2J6Owo8z3ICQPDFnnNngE9SjB7QeWxUqMfotxooNBr_KExw-gLTEnCYz2-68d0-TTrWVRSm0fUZ6OUU8kTQmoA7GvJ2JHUJ7ofewSij1SPHyhsgKYGoZR8_KDd1kY58rS5cX95jy3WHR1n69LFQV4a_MvSgaa4sPtkeo16tQJDigRrQeO9jYLE3PXX6klyuc8iQ6_yuicbW6rJO9T6Oiedkfr_2zQ5dWqA5vWGX8_g7nXbMP_gOI4KAK7sTyYh8WbDe2dFpP1M65VLArmzF3cWRbLbo4-2pMj7gcyi6FTbTlKhINrEuyC_cbCbTrosed-CmOljU_BZPihZr_4IPy_9t2ZJdfnSDCQE-YQ-WPEHVZ2uWsEAJtyB7TeOZuCsgRrvhrwxNeCl4F7Rb7DFz9vQl3NMMoMSCznrmtEyhTsOeMOgfa3yOiUYp_JolNHYyNtCMz5AcoKGsRlhIVk9P-NZFJfTXJvE40XrZUej0ZqT9zeMe0vNAisN3FWYu-e1pqvkb8Q9nabF8a63lVG4X_FYDTnU0Vjxkq-Qw8oux1QSY6_VIWIZIKupiyq_HDUrAz390DwX3pJPhesMr1Ai51P5oKeragaDjDH0TqSGSRKh8hiydDXLVK2cBAR-tb-Ef5AGlWF5qxyDv169VVTdQYVinjgrdsgPccKMuKCFujF9aKVDnN6Q0kbWrALE4DBz5ixZJPcK9CnBlwqK3l0pGfDVAegI722b1Hk_eMznFLU9N9W59qiLjBekO3XQRGqzCQ3PkPWash4yRTK9v5soF8mElb-TGVlK0OQYAyX4-FNLnCm5thqGL3KCeoArL0TNUaLj8_qFXOl_AUPBptORi2D_-rwAUuR7OtBt8NdWe6FH_AawRi0K93C-dGctJkCEctAqEe89fEFeVmdRopa5uOnmuJ0vBOdSL8ts0HGMbLe_bEXX8HHVJnrKoedrca6WLBNQW8LV-ajVuvpUFMn1h0UentpUL-b8JXD8x7bxLXBCl7lB838lpunIC6JUzG9TqefGUNRT-EvUhvn1r7DP0K8qRaOgceJBHJc1-XMec0xYLlGtMp_Af2Q3Sjf9QdkegszDA7TcmSeZkiOiDyxeSqEQrreAeh">Found</a>.

// solaxir796@ekuali.com
// international


let res_consent = await fetch(auth_body.split('"')[1], {
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
    "cookie": extractCookies([...cookie0,...cookie01,...cookie,...cookie1, ...cookie2, ...cookie3, ...cookie4, ...cookie4_1,...cookie5,...cookie6,...cookie7]).join('; '),
    "User-Agent": getRandomUserAgent(0),
    "referer": "https://auth.openai.com/log-in/password",
  },
  "referrer": "https://auth.openai.com/log-in/password",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include",
  redirect: 'manual'
});

console.log('response /consent?consent', await res_consent.text() , res_consent.ok, res_consent.status, res_consent.statusText)
console.log('headers', res_consent.headers)
let cookie8 = res_consent.headers.getSetCookie()



let res_location = await fetch(res_consent.headers.get('location'), {
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
    "upgrade-insecure-requests": "1",
    "cookie": extractCookies([...cookie0,...cookie01,...cookie,...cookie1, ...cookie2, ...cookie3, ...cookie4, ...cookie4_1,...cookie5,...cookie6,...cookie7,...cookie8]).join('; '),
    "User-Agent": getRandomUserAgent(0),
    "referer": "https://auth.openai.com/"
  },
  "referrer": "https://auth.openai.com/",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include",
  redirect: 'manual'
});

console.log('response from location 2nd (/auth?audience):', (await res_location.text()).slice(0), res_location.ok, res_location.status, res_location.statusText)
console.log(res_location.headers)

let cookie9 = res_location.headers.getSetCookie()


console.log('==')
console.log(res_location.headers.get('location'))
console.log('')
console.log( extractCookies([...cookie0,...cookie01,...cookie,...cookie1, ...cookie2, ...cookie3, ...cookie4, ...cookie4_1,...cookie5,...cookie6,...cookie7,...cookie8,...cookie9]).join('; '))
console.log('')
console.log( getRandomUserAgent(0))
console.log('==')
// process.exit()

let res_oai_code = await fetch(res_location.headers.get('location'), {
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
    "upgrade-insecure-requests": "1",
    "cookie": extractCookies([...cookie0,...cookie01,...cookie, ...cookie2, ...cookie3, ...cookie4, ...cookie4_1,...cookie5,...cookie6,...cookie7,...cookie8,...cookie9]).join('; '),
    "User-Agent": getRandomUserAgent(0),
    "referer": "https://auth.openai.com/",
  },
  "referrer": "https://auth.openai.com/",
  "body": null,
  "method": "GET",
  "mode": "cors",
//   "credentials": "include",
  redirect: 'manual'
});

// console.log(res_oai_code.headers)
let bbody = await res_oai_code.text()
console.log('response from location (/openai?code):', bbody , res_oai_code.ok, res_oai_code.status, res_oai_code.statusText, (bbody.split("accessToken").length - 1))
console.log(res_oai_code.headers)
console.log(!res_oai_code.headers.get('location').includes('error'))
// fs.writeFileSync('file.html', bbody)
let cookie10 = res_oai_code.headers.getSetCookie()

console.log(extractCookies([...cookie0,...cookie01,...cookie, ...cookie2, ...cookie3, ...cookie4, ...cookie4_1,...cookie5,...cookie6,...cookie7,...cookie8,...cookie9]))



// const res = await runCurlImpersonate2({
//     url: res_location.headers.get('location'),
//     method: 'GET',
//     headers: {
//         "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//         "accept-language": "it-IT,it;q=0.9",
//         "cache-control": "no-cache",
//         "pragma": "no-cache",
//         "priority": "u=0, i",
//         "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
//         "sec-ch-ua-mobile": "?0",
//         "sec-ch-ua-platform": "\"Windows\"",
//         "sec-fetch-dest": "document",
//         "sec-fetch-mode": "navigate",
//         "sec-fetch-site": "cross-site",
//         "sec-fetch-user": "?1",
//         "upgrade-insecure-requests": "1",
//         "cookie": extractCookies([
//             ...cookie,
//             ...cookie2,
//             ...cookie3,
//             ...cookie4,
//             ...cookie4_1,
//             ...cookie5,
//             ...cookie6,
//             ...cookie7,
//             ...cookie8,
//             ...cookie9
//         ]).join('; '),
//         "User-Agent": getRandomUserAgent(0)
//     },
//     followRedirects: true,
//     returnHeaders: true,
//     referrer: "https://auth.openai.com/",
//     credentials: 'include',
//     mode: 'cors'

//     // `referrer`, `body`, `mode`, `credentials`, `redirect` are not part of curl directly,
//     // but if your runCurlImpersonate wrapper supports them, you can add.
//     // Otherwise, they’ll be ignored.
// });

// console.log(res,'aaa')






let res_chatgpt = await fetch(res_oai_code.headers.get('location'), {
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
    "upgrade-insecure-requests": "1",
    "cookie": extractCookies([...cookie0,...cookie01,...cookie,...cookie1, ...cookie2, ...cookie3, ...cookie4, ...cookie4_1,...cookie5,...cookie6,...cookie7,...cookie8,...cookie9,...cookie10]).join('; '),
    "User-Agent": getRandomUserAgent(0),
    "referer": "https://auth.openai.com/",
  },
  "referrer": "https://auth.openai.com/",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include",
  redirect: 'manual'

});
let chatgpt_body =  await res_chatgpt.text()
console.log('response from location (chatgpt.com):',chatgpt_body.slice(0,100), res_chatgpt.ok, res_chatgpt.status, res_chatgpt.statusText)
console.log(res_chatgpt.headers)

// fs.writeFileSync('file.html',  chatgpt_body)

let accessToken = chatgpt_body.split('accessToken\\",\\"')[1].split('\\"')[0]
console.log(accessToken)

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