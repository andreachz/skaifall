// rewrite: use a proper cookie jar

// const {SS, XEe: generateTokens} = require('./openai-code');
const { getNewState, getOaiDeviceId, getOaiSentinelToken, getPageInfo } = require('./apis');

const readline = require('readline');
const fs = require('fs');
const tls = require('tls');

const { getRandomUserAgent } = require('./helpers');
const { newTempMail, waitMessage, getTempMailCreds } = require('../../../temp-mail/api');
const { runCurlImpersonate, runCurlImpersonate2 } = require('./impersonate-api');

// --- NEW: cookie jar setup (no more manual cookie headers) ---
const { CookieJar } = require('tough-cookie');
const { fetch: undiciFetch } = require('undici');

// EITHER use the undici entrypoint…
const fetchCookie = require('fetch-cookie').default;
// …or (works too on many setups):
// const fetchCookie = require('fetch-cookie').default;

const jar = new CookieJar();
const fetch = fetchCookie(undiciFetch, jar);


// -------------------------------------------------------------

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

;(async () => {
  // Simple helper to keep common headers tidy
  const ua = getRandomUserAgent(0);
  const baseHeaders = {
    'accept-language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
    'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'User-Agent': ua
  };

  // Hit chatgpt.com (cookies auto-captured in jar)
  let rr = await fetch('https://chatgpt.com/auth/login', {
    headers: {
      ...baseHeaders,
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      priority: 'u=0, i',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1'
    },
    referrer: 'https://www.chatgpt.com/',
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    redirect: 'follow'
  });

  async function getCookieByName(url, name) {
  return new Promise((resolve, reject) => {
    jar.getCookies(url, (err, cookies) => {
      if (err) return reject(err);

      const cookie = cookies.find(c => c.key === name);
      resolve(cookie ? cookie.value : null);
    });
  });
}

  let rrr = await rr.text();
  console.log('initial length:', rrr.length);

  // Temp mail
  let tempMail = await newTempMail();

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
  // let did = getOaiDeviceId()
  // let did = cookie0.find(x=>x.includes('oai-did=')).split('=')[1].split(';')[0]

  let did = await getCookieByName('https://chatgpt.com/auth/login', 'oai-did')
  // console.log(did)
  // process.exit()

  let did2 = crypto.randomUUID()
  let random43 = generateUrlSafeString(43)

  let csrf = (await getCookieByName('https://chatgpt.com/auth/login', '__Host-next-auth.csrf-token')).split('%')[0]
console.log(csrf)

  let res_signin = await fetch(`https://chatgpt.com/api/auth/signin/openai?prompt=login&screen_hint=login_or_signup&ext-oai-did=${did}&auth_session_logging_id=${did2}`, {
  "headers": {
    ...baseHeaders,
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
    // "cookie": extractCookies([...cookie0,]).join('; '),
    "Referer": "https://chatgpt.com/?utm_source=google&utm_medium=paidsearch_brand&utm_campaign=GOOG_C_SEM_GBR_Core_CHT_BAU_ACQ_PER_MIX_ALL_EMEA_IT_IT_052825&utm_term=chatgpt&utm_content=183234765107&utm_ad=754994199481&utm_match=e&gad_source=1&gad_campaignid=22605680082&gbraid=0AAAAA-IW-UXEt1p02NnDsfzeVDwVYdaIH&gclid=EAIaIQobChMI8tuUpe3YjwMVgJCDBx3XRgDYEAAYASAAEgJiV_D_BwE",
    "User-Agent": getRandomUserAgent(0)
  },
  "body": `callbackUrl=%2F&csrfToken=${csrf}&json=true`,
  "method": "POST"
});

console.log(await jar.getCookies('https://chatgpt.com/auth/login'))


// process.exit()
  // /authorize (jar stores Set-Cookie automatically)
  // let authurl = `https://auth.openai.com/api/accounts/authorize?client_id=app_X8zY6vW2pQ9tR3dE7nK1jL5gH&scope=openid%20email%20profile%20offline_access%20model.request%20model.read%20organization.read%20organization.write&response_type=code&redirect_uri=https%3A%2F%2Fchatgpt.com%2Fapi%2Fauth%2Fcallback%2Fopenai&audience=https%3A%2F%2Fapi.openai.com%2Fv1&device_id=${did}&prompt=login&screen_hint=login_or_signup&ext-oai-did=${did}&auth_session_logging_id=${did2}&state=${random43}`
  let authurl = (await res_signin.json()).url

  console.log(authurl)

  // process.exit()
  let res_authorize = await fetch(
    authurl,
    {
      headers: {
        ...baseHeaders,
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        priority: 'u=0, i',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'cross-site',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1'
      },
      referrer: 'https://chatgpt.com/',
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      redirect: 'manual'
    }
  );
  

  console.log('response /authorize', await res_authorize.text(), res_authorize.ok, res_authorize.status, res_authorize.statusText);





// process.exit()

  let res_login = await fetch("https://auth.openai.com/log-in-or-create-account", {
    "headers": {
      ...baseHeaders,
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      // "accept-language": "it-IT,it;q=0.9",
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
      // "cookie": extractCookies([...cookie0,...cookie]).join('; '),
      // "User-Agent": getRandomUserAgent(0)
    },
    "body": null,
    "method": "GET"
  });

  console.log('response /log-in-or-create-account', await res_login.text(), res_login.ok, res_login.status, res_login.statusText)
  // let cookie1 = res_login.headers.getSetCookie()
  // console.log('cookies log-in-or-create-account', cookie1)


 did = await getCookieByName('https://chatgpt.com/auth/login', 'oai-did')


  const oaisentinel_autorize_continue = await getOaiSentinelToken('authorize_continue',did);

  let email = tempMail.mailbox;
  console.log(email);
  let password = 'international';

  // /authorize/continue
  let res_continue = await fetch('https://auth.openai.com/api/accounts/authorize/continue', {
    headers: {
      ...baseHeaders,
      accept: 'application/json',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'openai-sentinel-token': JSON.stringify(oaisentinel_autorize_continue),
      pragma: 'no-cache',
      priority: 'u=1, i',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      traceparent: '00-00000000000000004f35afb18b243564-17a6d6c41cc59a37-01',
      tracestate: 'dd=s:1;o:rum',
      'x-datadog-origin': 'rum',
      'x-datadog-parent-id': '1704285646790957623',
      'x-datadog-sampling-priority': '1',
      'x-datadog-trace-id': '5707661279840449892'
    },
    referrer: 'https://auth.openai.com/log-in-or-create-account',
    body: JSON.stringify({
      username: { kind: 'email', value: email },
      screen_hint: 'login_or_signup'
    }),
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    redirect: 'manual'
  });

  console.log('response /continue with mail', await res_continue.text(), res_continue.ok, res_continue.status, res_continue.statusText);

  const oaisentinel_username_password_create = await getOaiSentinelToken('username_password_create');

  // register
  let res_register = await fetch('https://auth.openai.com/api/accounts/user/register', {
    headers: {
      ...baseHeaders,
      accept: 'application/json',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'openai-sentinel-token': JSON.stringify(oaisentinel_username_password_create),
      pragma: 'no-cache',
      priority: 'u=1, i',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      traceparent: '00-00000000000000001a59bc4887143827-2880f1b2600838a9-01',
      tracestate: 'dd=s:1;o:rum',
      'x-datadog-origin': 'rum',
      'x-datadog-parent-id': '2918598306953705641',
      'x-datadog-sampling-priority': '1',
      'x-datadog-trace-id': '1898755737603291175'
    },
    referrer: 'https://auth.openai.com/create-account/password',
    body: JSON.stringify({ username: email, password }),
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    redirect: 'manual'
  });

  console.log(await res_register.text(), res_register.ok, res_register.status, res_register.statusText);

  // email-otp/send
  let res_otp_send = await fetch('https://auth.openai.com/api/accounts/email-otp/send', {
    headers: {
      ...baseHeaders,
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      priority: 'u=0, i',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1'
    },
    referrer: 'https://auth.openai.com/create-account/password',
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    redirect: 'manual'
  });

  console.log('response /send', await res_otp_send.text(), res_otp_send.ok, res_otp_send.status, res_otp_send.statusText);

  // email-verification page
  let res_email_ver = await fetch('https://auth.openai.com/email-verification', {
    headers: {
      ...baseHeaders,
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      priority: 'u=0, i',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1'
    },
    referrer: 'https://auth.openai.com/create-account/password',
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    redirect: 'manual'
  });

  console.log('response /email-verification:', await res_email_ver.text(), res_email_ver.ok, res_email_ver.status, res_email_ver.statusText);

  // fetch OTP from temp mail
  console.log('waiting for message otp via mail...');
  let msg = await waitMessage(getTempMailCreds());
  let otpcode = msg.subject.split(' ').slice(-1)[0].toString();
  console.log(`you entered code: ${otpcode}`);

  await delay(1000);

  // validate OTP
  let res_validate = await fetch('https://auth.openai.com/api/accounts/email-otp/validate', {
    headers: {
      ...baseHeaders,
      accept: 'application/json',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      pragma: 'no-cache',
      priority: 'u=1, i',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      traceparent: '00-0000000000000000f4b933cec07464b7-353c238878ce8441-01',
      tracestate: 'dd=s:1;o:rum',
      'x-datadog-origin': 'rum',
      'x-datadog-parent-id': '3835980051662144577',
      'x-datadog-sampling-priority': '1',
      'x-datadog-trace-id': '17634182779031020727'
    },
    referrer: 'https://auth.openai.com/email-verification',
    body: JSON.stringify({ code: otpcode }),
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    redirect: 'manual'
  });

  console.log('response /validate:', await res_validate.text(), res_validate.ok, res_validate.status, res_validate.statusText);

  // create account
  const oaisentinel_oauth_create_account = await getOaiSentinelToken('oauth_create_account');

  let res_create_account = await fetch('https://auth.openai.com/api/accounts/create_account', {
    headers: {
      ...baseHeaders,
      accept: 'application/json',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'openai-sentinel-token': oaisentinel_oauth_create_account,
      pragma: 'no-cache',
      priority: 'u=1, i',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      traceparent: '00-0000000000000000084b1674e742071a-7e7896eb1dddf327-01',
      tracestate: 'dd=s:1;o:rum',
      'x-datadog-origin': 'rum',
      'x-datadog-parent-id': '9113199782546764583',
      'x-datadog-sampling-priority': '1',
      'x-datadog-trace-id': '597596066908604186'
    },
    referrer: 'https://auth.openai.com/about-you',
    body: JSON.stringify({
      name: 'luca contini',
      birthdate: '1990-05-05'
    }),
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    redirect: 'manual'
  });

  let res_create_account_j = await res_create_account.json();
  console.log(
    'response /create_account',
    res_create_account_j,
    res_create_account.ok,
    res_create_account.status,
    res_create_account.statusText
  );

  // follow the continue_url (authorization)
  let res_auth = await fetch(res_create_account_j.continue_url, {
    headers: {
      ...baseHeaders,
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      priority: 'u=0, i',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1'
    },
    referrer: 'https://auth.openai.com/about-you',
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    redirect: 'manual'
  });

  let auth_body = await res_auth.text();
  console.log('response /auth?audience', auth_body, res_auth.ok, res_auth.status, res_auth.statusText);

  // consent link is inside body; extract first href (same as before)
  const consentHref = auth_body.split('"')[1];

  let res_consent = await fetch(consentHref, {
    headers: {
      ...baseHeaders,
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      priority: 'u=0, i',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      referer: 'https://auth.openai.com/log-in/password',
    },
    referrer: 'https://auth.openai.com/log-in/password',
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    redirect: 'manual'
  });

  console.log('response /consent?consent', await res_consent.text(), res_consent.ok, res_consent.status, res_consent.statusText);

  // hop to the location from consent
  let res_location = await fetch(res_consent.headers.get('location'), {
    headers: {
      ...baseHeaders,
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      priority: 'u=0, i',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      referer: 'https://auth.openai.com/',
    },
    referrer: 'https://auth.openai.com/',
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    redirect: 'manual'
  });

  console.log(
    'response from location 2nd (/auth?audience):',
    (await res_location.text()).slice(0),
    res_location.ok,
    res_location.status,
    res_location.statusText
  );

  console.log('next location:', res_location.headers.get('location'));


  console.log('cook', await jar.getCookies('https://chatgpt.com'))
  // process.exit()
  // Final exchange to openai callback (DON’T add cookie header; jar handles it)
  let res_oai_code = await fetch(res_location.headers.get('location'), {
    headers: {
      ...baseHeaders,
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      priority: 'u=0, i',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      referer: 'https://auth.openai.com/',
    },
    referrer: 'https://auth.openai.com/',
    method: 'GET',
    // NOTE: with fetch-cookie, you can still omit credentials; the jar handles cookies.
    // If you need same-site semantics, keep credentials:
    // credentials: 'include',
    redirect: 'manual'
  });

  // let bbody = await res_oai_code.text();
  console.log(
    'response from location (/openai?code):',
    // bbody,
    res_oai_code.ok,
    res_oai_code.status,
    res_oai_code.statusText,
    res_oai_code.headers,
    // (bbody.split('accessToken').length - 1)
  );
  // fs.writeFileSync('file.html', bbody);

  // If there’s another hop to chatgpt:
  if (res_oai_code.headers.get('location')) {
    let res_chatgpt = await fetch(res_oai_code.headers.get('location'), {
      headers: {
        ...baseHeaders,
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        priority: 'u=0, i',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'cross-site',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1'
      },
      referrer: 'https://auth.openai.com/',
      method: 'GET',
      credentials: 'include',
      redirect: 'manual'
    });
    console.log(
      'response from location (chatgpt.com):',
      // (await res_chatgpt.text()).slice(0),
      res_chatgpt.ok,
      res_chatgpt.status,
      res_chatgpt.statusText,
      res_chatgpt.headers
    );

    let chatgpt_body = await res_chatgpt.text()
    let accessToken = chatgpt_body.split('accessToken\\",\\"')[1].split('\\"')[0]
    
    let sessionCookies = await jar.getCookies('https://chatgpt.com')
    // console.log(accessToken)
    const result = {accessToken: accessToken, sessionCookies}
    console.log(result)
    return result
  }

  process.exit(0);
})();

function askQuestion(query) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(query, (ans) => { rl.close(); resolve(ans); }));
}
