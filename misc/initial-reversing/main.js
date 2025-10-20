let navigator = {userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', webdriver: false}
let window = {
    top: {hasOwnProperty: function (prop) {let props = ['__DDG_BE_VERSION__','__DDG_FE_CHAT_HASH__']; return props.includes(prop)}},
    document: {querySelector: function(q){
        if(q=='#jsa'){
            //iframe
            return {
                getAttribute: function(a){
                    if(a=='sandbox'){
                        return 'allow-scripts allow-same-origin'
                    }
                },
                contentDocument: {
                        querySelector: function(q){
                            if(q=='meta[http-equiv="Content-Security-Policy"]'){
                                return {
                                    getAttribute: function(a){
                                        if(a=='content')
                                        return "default-src 'none'; script-src 'unsafe-inline';"
                                    }
                                }
                            }
                        }
                },
                contentWindow:{
                    visualViewport: {
                        scale: 1
                    }
                }
            }
        }
    },
    createElement: function(tag){
        return {
            srcdoc: ''
        }
    },
    body: {
        appendChild: function(el){
            
        },
        removeChild: function(el){

        }
    }
}
}
let document = window.document
window.top.document = document



async function sha256Base64(s) {
  const enc = new TextEncoder();
  const hash = await crypto.subtle.digest('SHA-256', enc.encode(s));
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function buildDuckHash(res) {
    console.log(res.client_hashes)
    res.client_hashes = await Promise.all(
        res.client_hashes.map(x => sha256Base64(x))
    )
    
    res.meta.origin = "https://duckduckgo.com"
    res.meta.stack = "Error\nat l (https://duckduckgo.com/dist/wpm.main.26e905c8fd9c901bbbeb.js:1:364990)\nat async https://duckduckgo.com/dist/wpm.main.26e905c8fd9c901bbbeb.js:1:340615"
    res.meta.duration = "8"
    
    return res
}
// setTimeout(()=>{
// (async function () {
//   // Labels for (optionally) attaching extra values into the XOR'd debug field.
//   // In this variant they’re all disabled (false), so nothing gets added.
//   const labels = [
//     ['ua', false],
//     ['__DDG_FE_CHAT_HASH__', false],
//     ['sandbox', false],
//   ];

//   // Build three “client” values in parallel:
//   //   1) navigator.userAgent
//   //   2) iframe/CSP/globals checksum (as a string)
//   //   3) automation/dup-globals checksum (as a string)
//   const clientPieces = await Promise.all([
//     navigator.userAgent,

//     // (2) Inspect an iframe called #jsa and some top-window globals
//     (function () {
//       const topWin = window.top;
//       const iframe = topWin.document.querySelector('#jsa');

//       // Get the document inside the iframe (via contentDocument or contentWindow.document)
//       const doc = iframe.contentDocument || iframe.contentWindow.document;

//       // Grab the CSP meta and sandbox attribute
//       const cspContent = doc.querySelector('meta[http-equiv="Content-Security-Policy"]')
//                             .getAttribute('content');
//       const sandboxAttr = iframe.getAttribute('sandbox');

//       // Compute a checksum-like number with a base and a few booleans
//       const checks = [
//         cspContent === "default-src 'none'; script-src 'unsafe-inline';",
//         sandboxAttr === 'allow-scripts allow-same-origin',
//         topWin.hasOwnProperty('__DDG_BE_VERSION__'),
//         topWin.hasOwnProperty('__DDG_FE_CHAT_HASH__'),
//       ];

//       // Convert booleans -> 0/1 and sum onto base 0x1408 (5128), then stringify
//       const sum = checks.map(Number).reduce((a, b) => a + b, 0x1408);
//       return String(sum);
//     })(),

//     // (3) Automation/duplication checks
//     (function () {
//       // A: WebDriver (true on many headless/automation setups)
//       const isWebDriver = (navigator.webdriver === true);

//       // B: VisualViewport “scale” exists inside a temporary iframe (#jsa via srcdoc)
//       const hasViewportScale = (function () {
//         const ifr = document.createElement('iframe');
//         ifr.srcdoc = '#jsa';
//         document.body.appendChild(ifr);

//         let scaleValue;
//         if (ifr.contentWindow &&
//             ifr.contentWindow.visualViewport &&
//             ifr.contentWindow.visualViewport.scale) {
//           // capture a string form to coerce to boolean below
//           scaleValue = ifr.contentWindow.visualViewport.scale.toString();
//         } else {
//           scaleValue = undefined;
//         }

//         document.body.removeChild(ifr);
//         return !!scaleValue;
//       })();

//       // C: Look for duplicate globals like JSON / _JSON, Proxy / _Proxy, etc.
//       //    (i.e., keys that end with `_<Name>` and equal the original)
//       const watchList = ['Symbol', 'i3jp0', 'vz95n', 'Proxy', 'JSON', '__DDG_FE_CHAT_HASH__', 'Window'];
//       const dupKeys = Object.keys(window.top).filter(key =>
//         watchList.some(name =>
//           key !== name &&
//           key.endsWith('_' + name) &&
//           window.top[key] === window.top[name]
//         )
//       );
//       const hasDupGlobals = dupKeys.length > 0;

//       // Sum booleans onto base 0x1f1c (7964), then stringify
//       const sum = [isWebDriver, hasViewportScale, hasDupGlobals]
//         .map(Number)
//         .reduce((a, b) => a + b, 0x1f1c);

//       return String(sum);
//     })()
//   ]);

//   // Build the client_hashes list and (optionally) a tiny debug payload map (empty here)
//   const client_hashes = [];
//   const debugMap = {};
//   const xorKey = 'Array'; // short XOR key used below

//   for (let i = 0; i < clientPieces.length; i++) {
//     const piece = clientPieces[i];

//     if (Array.isArray(piece)) {
//       // (Not actually used by the two functions above, but supported)
//       client_hashes.push(piece[0]);
//       if (piece.length > 1 && labels[i][1]) {
//         debugMap[labels[i][0]] = piece[1];
//       }
//     } else {
//       client_hashes.push(piece);
//     }
//   }

//   // XOR-“encode” the debug JSON with a tiny key (it’s just "{}" here)
//   const rawDebug = JSON.stringify(debugMap);
//   const debug = Array.from(rawDebug)
//     .map((ch, idx) =>
//       String.fromCharCode(ch.charCodeAt(0) ^ xorKey.charCodeAt(idx % xorKey.length))
//     )
//     .join('');

//   // Final payload
//   return {
//     server_hashes: [
//       '6jVXL3PM2WM+MmapxNQPVgs4GXayljCLfzoM7P4V0rs=',
//       '/T4y++jK7YM8XViigNrVUkb6Ue6mUv5v1EyyCJz+yEk=',
//       'i3jp0'
//     ],
//     client_hashes,
//     signals: {},
//     meta: {
//       v: '4',
//       challenge_id: '227626f46eff9192f06f9e8406cb93215550cd6b90490525f5236d2b0572391cvz95n',
//       timestamp: '1756858702302',
//       debug
//     }
//   };
// })()
// .then(d=>{'result',console.log(d)});
// },100)

// const x_vqd_hash_1 = 'KGFzeW5jIGZ1bmN0aW9uKCl7Y29uc3QgXzB4YjU2OTQ1PV8weGM5M2E7KGZ1bmN0aW9uKF8weDRkNzMzNixfMHgxYTFlN2Epe2NvbnN0IF8weDUzOGYxOD1fMHhjOTNhLF8weDI3YjNjYz1fMHg0ZDczMzYoKTt3aGlsZSghIVtdKXt0cnl7Y29uc3QgXzB4M2IyNmM5PXBhcnNlSW50KF8weDUzOGYxOCgweDEwZikpLzB4MSoocGFyc2VJbnQoXzB4NTM4ZjE4KDB4ZjYpKS8weDIpKy1wYXJzZUludChfMHg1MzhmMTgoMHhmOCkpLzB4MystcGFyc2VJbnQoXzB4NTM4ZjE4KDB4MTFjKSkvMHg0KihwYXJzZUludChfMHg1MzhmMTgoMHhlZSkpLzB4NSkrLXBhcnNlSW50KF8weDUzOGYxOCgweGZiKSkvMHg2KihwYXJzZUludChfMHg1MzhmMTgoMHgxMDkpKS8weDcpKy1wYXJzZUludChfMHg1MzhmMTgoMHgxMTUpKS8weDgqKC1wYXJzZUludChfMHg1MzhmMTgoMHhmNykpLzB4OSkrcGFyc2VJbnQoXzB4NTM4ZjE4KDB4ZTkpKS8weGErLXBhcnNlSW50KF8weDUzOGYxOCgweDEwNCkpLzB4YioocGFyc2VJbnQoXzB4NTM4ZjE4KDB4MTE3KSkvMHhjKTtpZihfMHgzYjI2Yzk9PT1fMHgxYTFlN2EpYnJlYWs7ZWxzZSBfMHgyN2IzY2NbJ3B1c2gnXShfMHgyN2IzY2NbJ3NoaWZ0J10oKSk7fWNhdGNoKF8weDExNjU1Nyl7XzB4MjdiM2NjWydwdXNoJ10oXzB4MjdiM2NjWydzaGlmdCddKCkpO319fShfMHhjMGIzLDB4MzEwOWUpKTtmdW5jdGlvbiBfMHhjMGIzKCl7Y29uc3QgXzB4ZmY2MzE3PVsnMjQ3NDU2MFlpZk5wdScsJ2lzQXJyYXknLCdhbGwnLCdBcnJheScsJ2Zyb21DaGFyQ29kZScsJzQwOTg3NUJwc1p6bScsJ3JlZHVjZScsJ2dldCcsJ2FsbG93LXNjcmlwdHNceDIwYWxsb3ctc2FtZS1vcmlnaW4nLCc4Njc2N2Y1NTU5MWM5MzQ4JywnY29udGVudFdpbmRvdycsJ21hcCcsJ2NoYXJDb2RlQXQnLCc2NzIyMDZpVkphcGEnLCcxNTM2M21Rend1cCcsJzI0NTMxM3Z3UlJDWScsJ2ZpbHRlcicsJ2Zyb20nLCc1NGxOdnh6cScsJ3F1ZXJ5U2VsZWN0b3InLCdib2R5JywnRHVja0R1Y2tHb1x4MjBGcmF1ZFx4MjAmXHgyMEFidXNlJywnUHJveHknLCdrZXlzJywnaGFzT3duUHJvcGVydHknLCdtZXRhW2h0dHAtZXF1aXY9XHgyMkNvbnRlbnQtU2VjdXJpdHktUG9saWN5XHgyMl0nLCdfX0RER19CRV9WRVJTSU9OX18nLCcyMzg3YXBja1hLJywnc3RyaW5naWZ5JywnbGVuZ3RoJywnZ2V0QXR0cmlidXRlJywnaWZyYW1lJywnMTI5Mzc0b3BsRGRjJywnZG9jdW1lbnQnLCdhcHBlbmRDaGlsZCcsJ1dpbmRvdycsJ2NvbnRlbnQnLCdzZWxmJywnMUVLWURyeCcsJyNqc2EnLCdwdXNoJywnc29tZScsJ0pTT04nLCdlbmRzV2l0aCcsJzE0NjRESmtLaUInLCd0b3AnLCcyMDE4NGREcmlRWCcsJ19fRERHX0ZFX0NIQVRfSEFTSF9fJywnc2J1ZldPOURsL3JWbzVOWHd5VTQxR1U4a3d3WlR2TWE0K1JUUDlsMG5ocz0nLCd2ejk1bicsJ2pvaW4nLCc0cnl0U1F3JywnR1I2NkUzOERVSDIzZTRFR3ZoMFVJUkszOHVRZlQ1ZTk5cGR0NlRIQ09ROD0nLCdpM2pwMCcsJ09iamVjdCcsJ3NyY2RvYycsJ3JlbW92ZUNoaWxkJywndXNlckFnZW50Jywnc2FuZGJveCddO18weGMwYjM9ZnVuY3Rpb24oKXtyZXR1cm4gXzB4ZmY2MzE3O307cmV0dXJuIF8weGMwYjMoKTt9Y29uc3QgXzB4M2QxMGNiPVtbJ3VhJywhW11dLFtfMHhiNTY5NDUoMHgxMWEpLCFbXV0sW18weGI1Njk0NSgweGUzKSwhW11dXSxfMHgzOTk0ZmU9YXdhaXQgUHJvbWlzZVtfMHhiNTY5NDUoMHhlYildKFtuYXZpZ2F0b3JbXzB4YjU2OTQ1KDB4ZTcpXSwoZnVuY3Rpb24oKXtjb25zdCBfMHgxYzVlYWE9XzB4YjU2OTQ1LF8weGJjYjk2Mj13aW5kb3dbXzB4MWM1ZWFhKDB4MTE2KV0sXzB4MmE3ZTE4PV8weGJjYjk2MltfMHgxYzVlYWEoMHgxMGEpXVtfMHgxYzVlYWEoMHhmYyldKF8weDFjNWVhYSgweDExMCkpLF8weDQzZDgwZD1fMHgyYTdlMThbJ2NvbnRlbnREb2N1bWVudCddfHxfMHgyYTdlMThbJ2NvbnRlbnRXaW5kb3cnXVsnZG9jdW1lbnQnXSxfMHg3NWUxY2E9XzB4NDNkODBkW18weDFjNWVhYSgweGZjKV0oXzB4MWM1ZWFhKDB4MTAyKSlbXzB4MWM1ZWFhKDB4MTA3KV0oXzB4MWM1ZWFhKDB4MTBkKSksXzB4MzYzM2I0PV8weDJhN2UxOFtfMHgxYzVlYWEoMHgxMDcpXShfMHgxYzVlYWEoMHhlOCkpO3JldHVybiBTdHJpbmcoW18weDc1ZTFjYT09PSdkZWZhdWx0LXNyY1x4MjBceDI3bm9uZVx4Mjc7XHgyMHNjcmlwdC1zcmNceDIwXHgyN3Vuc2FmZS1pbmxpbmVceDI3OycsXzB4MzYzM2I0PT09XzB4MWM1ZWFhKDB4ZjEpLF8weGJjYjk2MlsnaGFzT3duUHJvcGVydHknXShfMHgxYzVlYWEoMHgxMDMpKSxfMHhiY2I5NjJbXzB4MWM1ZWFhKDB4MTAxKV0oXzB4MWM1ZWFhKDB4MTE4KSldWydtYXAnXShOdW1iZXIpW18weDFjNWVhYSgweGVmKV0oKF8weDIwNzFkYSxfMHgxODcyN2IpPT5fMHgyMDcxZGErXzB4MTg3MjdiLDB4MTdlYykpO30oKSksKGZ1bmN0aW9uKCl7Y29uc3QgXzB4NGM2MmU0PV8weGI1Njk0NTtyZXR1cm4gU3RyaW5nKFtuYXZpZ2F0b3JbJ3dlYmRyaXZlciddPT09ISFbXSwoZnVuY3Rpb24oKXtjb25zdCBfMHgxOTc3YzU9XzB4YzkzYSxfMHgzMzU0NDE9ZG9jdW1lbnRbJ2NyZWF0ZUVsZW1lbnQnXShfMHgxOTc3YzUoMHgxMDgpKTtfMHgzMzU0NDFbXzB4MTk3N2M1KDB4ZTUpXT1fMHgxOTc3YzUoMHhmZSksZG9jdW1lbnRbJ2JvZHknXVtfMHgxOTc3YzUoMHgxMGIpXShfMHgzMzU0NDEpO2xldCBfMHg1NGI5YWM7cmV0dXJuIF8weDMzNTQ0MVsnY29udGVudFdpbmRvdyddJiZfMHgzMzU0NDFbXzB4MTk3N2M1KDB4ZjMpXVsnc2VsZiddJiZfMHgzMzU0NDFbXzB4MTk3N2M1KDB4ZjMpXVtfMHgxOTc3YzUoMHgxMGUpXVtfMHgxOTc3YzUoMHhmMCldP18weDU0YjlhYz1fMHgzMzU0NDFbXzB4MTk3N2M1KDB4ZjMpXVtfMHgxOTc3YzUoMHgxMGUpXVtfMHgxOTc3YzUoMHhmMCldWyd0b1N0cmluZyddKCk6XzB4NTRiOWFjPXVuZGVmaW5lZCxkb2N1bWVudFtfMHgxOTc3YzUoMHhmZCldW18weDE5NzdjNSgweGU2KV0oXzB4MzM1NDQxKSwhIV8weDU0YjlhYzt9KCkpLChmdW5jdGlvbigpe2NvbnN0IF8weDIzY2Q1NT1fMHhjOTNhLF8weDVhYjU2ZD1bXzB4MjNjZDU1KDB4ZWMpLF8weDIzY2Q1NSgweGU0KSwnUHJvbWlzZScsXzB4MjNjZDU1KDB4ZmYpLCdTeW1ib2wnLF8weDIzY2Q1NSgweDExMyksXzB4MjNjZDU1KDB4MTBjKV0sXzB4ZWMzODE0PU9iamVjdFtfMHgyM2NkNTUoMHgxMDApXSh3aW5kb3dbXzB4MjNjZDU1KDB4MTE2KV0pW18weDIzY2Q1NSgweGY5KV0oXzB4ZDRkYzcyPT5fMHg1YWI1NmRbXzB4MjNjZDU1KDB4MTEyKV0oXzB4MTZkYjllPT5fMHhkNGRjNzIhPT1fMHgxNmRiOWUmJl8weGQ0ZGM3MltfMHgyM2NkNTUoMHgxMTQpXSgnXycrXzB4MTZkYjllKSYmd2luZG93W18weDIzY2Q1NSgweDExNildW18weGQ0ZGM3Ml09PT13aW5kb3dbXzB4MjNjZDU1KDB4MTE2KV1bXzB4MTZkYjllXSkpO3JldHVybiBfMHhlYzM4MTRbXzB4MjNjZDU1KDB4MTA2KV0+MHgwO30oKSldW18weDRjNjJlNCgweGY0KV0oTnVtYmVyKVtfMHg0YzYyZTQoMHhlZildKChfMHgyYjI0NGYsXzB4NTZkNTViKT0+XzB4MmIyNDRmK18weDU2ZDU1YiwweDMzNSkpO30oKSldKSxfMHg1NGYwNWI9W10sXzB4NGNiOTNlPXt9LF8weDE3N2JiND1fMHhiNTY5NDUoMHhmMik7ZnVuY3Rpb24gXzB4YzkzYShfMHgyMWVlYzksXzB4ZTU4NTNjKXtjb25zdCBfMHhjMGIzMmQ9XzB4YzBiMygpO3JldHVybiBfMHhjOTNhPWZ1bmN0aW9uKF8weGM5M2FiNixfMHg1YTQxNTgpe18weGM5M2FiNj1fMHhjOTNhYjYtMHhlMztsZXQgXzB4MjBkMGZiPV8weGMwYjMyZFtfMHhjOTNhYjZdO3JldHVybiBfMHgyMGQwZmI7fSxfMHhjOTNhKF8weDIxZWVjOSxfMHhlNTg1M2MpO31mb3IobGV0IF8weDFiYTQxYT0weDA7XzB4MWJhNDFhPF8weDM5OTRmZVtfMHhiNTY5NDUoMHgxMDYpXTtfMHgxYmE0MWErKyl7Y29uc3QgXzB4MWFhZjM5PV8weDM5OTRmZVtfMHgxYmE0MWFdO0FycmF5W18weGI1Njk0NSgweGVhKV0oXzB4MWFhZjM5KT8oXzB4NTRmMDViW18weGI1Njk0NSgweDExMSldKF8weDFhYWYzOVsweDBdKSxfMHgxYWFmMzlbXzB4YjU2OTQ1KDB4MTA2KV0+MHgxJiZfMHgzZDEwY2JbXzB4MWJhNDFhXVsweDFdJiYoXzB4NGNiOTNlW18weDNkMTBjYltfMHgxYmE0MWFdWzB4MF1dPV8weDFhYWYzOVsweDFdKSk6XzB4NTRmMDViW18weGI1Njk0NSgweDExMSldKF8weDFhYWYzOSk7fWNvbnN0IF8weDU3YzJjZj1BcnJheVtfMHhiNTY5NDUoMHhmYSldKEpTT05bXzB4YjU2OTQ1KDB4MTA1KV0oXzB4NGNiOTNlKSlbJ21hcCddKChfMHg1NGM3M2YsXzB4NDcwZWE4KT0+U3RyaW5nW18weGI1Njk0NSgweGVkKV0oXzB4NTRjNzNmWydjaGFyQ29kZUF0J10oMHgwKV5fMHgxNzdiYjRbXzB4YjU2OTQ1KDB4ZjUpXShfMHg0NzBlYTglXzB4MTc3YmI0WydsZW5ndGgnXSkpKVtfMHhiNTY5NDUoMHgxMWIpXSgnJyk7cmV0dXJueydzZXJ2ZXJfaGFzaGVzJzpbXzB4YjU2OTQ1KDB4MTFkKSxfMHhiNTY5NDUoMHgxMTkpLCdvS25tMHFGRHRFaTcwK3VWZjZQalpRMnU3VGk2Nlc3SlBSOXJ3UnVEUTY0PSddLCdjbGllbnRfaGFzaGVzJzpfMHg1NGYwNWIsJ3NpZ25hbHMnOnt9LCdtZXRhJzp7J3YnOic0JywnY2hhbGxlbmdlX2lkJzonZGY5NTkwYTIzYjIwZjhlOGJkNGEwY2E1NzVhMGY4YjdmNzU0NzAwN2UyMzNjYTA2ZTRhMjdiNTFiMWU1NmZkNnZ6OTVuJywndGltZXN0YW1wJzonMTc1Njg2NDc1NzM4NScsJ2RlYnVnJzpfMHg1N2MyY2Z9fTt9KSgp'
// setTimeout(async ()=>{
//     let res = await eval(atob(x_vqd_hash_1));
//     console.log(atob(x_vqd_hash_1))
//     // console.log(res);
//     console.log('plain result:')
//     let plain_result = await buildDuckHash(res)
//     console.log('plain result')
//     console.log(plain_result)
//     console.log()
//     console.log('b64 result:')
//     console.log(btoa(JSON.stringify(plain_result)))
// },50)

/////////////////

// const https = require('https');

// const options = {
//   method: 'GET',
//   hostname: 'duckduckgo.com',
//   path: '/duckchat/v1/status',
//   headers: {
//     'accept': '*/*',
//     'accept-language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
//     'cache-control': 'no-store',
//     'pragma': 'no-cache',
//     'priority': 'u=1, i',
//     'referer': 'https://duckduckgo.com/',
//     'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
//     'sec-ch-ua-mobile': '?0',
//     'sec-ch-ua-platform': '"Windows"',
//     'sec-fetch-dest': 'empty',
//     'sec-fetch-mode': 'cors',
//     'sec-fetch-site': 'same-origin',
//     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
//     'x-vqd-accept': '1'
//   }
// };

// const req = https.request(options, (res) => {
//   console.log('Status Code:', res.statusCode);
// //   console.log('Headers:', res.headers);   // <-- response headers

//   async function getHash(headers){
//     let res = await eval(atob(headers['x-vqd-hash-1']));
//     // console.log(res);
//     let plain_result = await buildDuckHash(res)
//     console.log('plain result:')
//     console.log(plain_result)
//     console.log()
//     console.log('b64 result:')
//     console.log(btoa(JSON.stringify(plain_result)))
//   }
//   getHash(res.headers)

//   let data = '';

//   res.on('data', (chunk) => {
//     data += chunk;
//   });

//   res.on('end', () => {
//     // console.log('Body:', data);
//   });
// });

// req.on('error', (error) => {
//   console.error('Request error:', error);
// });

// req.end();



const https = require('https');

/**
 * Fetches DuckDuckGo's duckchat status, evaluates the header payload, and returns the base64 hash string.
 * Retries with a new GET only if the eval step throws.
 *
 * @param {object} opts
 * @param {number} [opts.maxAttempts=3] - Maximum number of eval retries (each retry makes a new GET).
 * @param {object} [opts.requestOptions] - Optional override/extend of the HTTPS request options.
 * @returns {Promise<string>} Base64-encoded hash string (btoa(JSON.stringify(plain_result))).
 *
 * NOTE: Expects a global or in-scope async function `buildDuckHash(value)` to exist,
 *       exactly like in your original snippet.
 */
async function getDuckChatHash({ maxAttempts = 15, requestOptions = {} } = {}) {
  // Node-friendly atob/btoa
  const atob = (str) => Buffer.from(str, 'base64').toString('utf8');
  const btoa = (str) => Buffer.from(str, 'utf8').toString('base64');

  const defaultOptions = {
    method: 'GET',
    hostname: 'duckduckgo.com',
    path: '/duckchat/v1/status',
    headers: {
      'accept': '*/*',
      'accept-language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
      'cache-control': 'no-store',
      'pragma': 'no-cache',
      'priority': 'u=1, i',
      'referer': 'https://duckduckgo.com/',
      'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
      'x-vqd-accept': '1'
    },
    ...requestOptions,
  };

  // Helper: perform the GET and return response headers
  const fetchHeaders = () =>
    new Promise((resolve, reject) => {
      const req = https.request(defaultOptions, (res) => {
        // Drain body to free the socket, but we only need headers
        res.on('data', () => {});
        res.on('end', () => resolve(res.headers));
      });
      req.on('error', reject);
      req.end();
    });

  let attempt = 0;
  let lastError;

  while (attempt < maxAttempts) {
    attempt += 1;
    const headers = await fetchHeaders();

    const encoded = headers['x-vqd-hash-1'];
    if (!encoded) {
      // No point retrying for "missing header" unless you want to; treat as a hard error.
      throw new Error('Missing x-vqd-hash-1 header in response.');
    }

    const decoded = atob(encoded);

    try {
      // Your original logic: eval the decoded script/payload
      const resultOfEval = await eval(decoded); // eslint-disable-line no-eval

      // Then build the plain result using your existing buildDuckHash
      /* global buildDuckHash */
      const plain = await buildDuckHash(resultOfEval);
    //   console.log(plain)
      // Return base64-encoded JSON string (same as your console "b64 result")
      let hashB64 = btoa(JSON.stringify(plain));
      console.log('attempt', attempt)
      return {plain, hashB64}
    } catch (err) {
      // Only retry on eval failure, as requested
      lastError = err;
      if (attempt >= maxAttempts) break;
      // loop continues → fetch fresh headers and try again
    }
  }

  // If we’re here, all eval attempts failed
  const msg = lastError && lastError.stack ? lastError.stack : String(lastError || 'Unknown eval error');
  throw new Error(`Failed to compute hash after ${maxAttempts} attempt(s): ${msg}`);
}

// Example usage:
(async () => {
  try {
    const {plain, hashB64} = await getDuckChatHash({ maxAttempts: 15 });
    console.log('result:', plain, '\n\n', hashB64);
  } catch (e) {
    console.error(e);
  }
})();

// {"server_hashes":["9X8UYPfyiXiV+wc/xyGMuygZVVN2rYfy/qIlT9SleNI=","fgoS8jxMZumgitXyfXBnvmQ0zFWEgTZqrZ0auCKdOsI=","KOozhmh02bAd8g4IGIe0eVcRcaYxPbHcT1It2UnSCqc="],"client_hashes":["yHKxpdj0hMXjf+e+B1P5dOU3ErotdfZnYCWFYm6QEB0=","KAlrI4+vv9Wr243fTn9aLGcZbP2LXUmhlgEtAmmiGJ8=","jEV4LXO8SnIYi0jy7TGiRkRY1K+ytT1v9WiwvT2zaLI="],"signals":{},"meta":{"v":"4","challenge_id":"fe0826095d84725c40c4e48a22f640edb8214356d5c5ac8516c83835aa316356vz95n","timestamp":"1756866766788","debug":"\u001f\u0019","origin":"https://duckduckgo.com","stack":"Error\nat l (https://duckduckgo.com/dist/wpm.main.26e905c8fd9c901bbbeb.js:1:364990)\nat async https://duckduckgo.com/dist/wpm.main.26e905c8fd9c901bbbeb.js:1:340615","duration":"7"}}

// {"start":1756866765397,"events":[{"name":"startNewChat_unknown","delta":31},{"name":"recentChatsListImpression","delta":52}],"end":10930}
