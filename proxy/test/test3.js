// const {runCurlImpersonate} = require('./impersonate-api');
// const fetch = require('node-fetch')

// const {runCurlImpersonate} = require('../ai-modules/openai/plainjs/impersonate-api')

const { JSDOM } = require('jsdom');
const fs = require('fs')

let page = fs.readFileSync('page500.2.html')

let a = parseProxyHTML(page)
fs.writeFileSync('data500.2.json',JSON.stringify(a, null, 1))
// console.log(a)



const fetch = require("node-fetch");
const { HttpsProxyAgent } = require("https-proxy-agent");


(async ()=>{
  return
  
function testProxies(a){
  a = a.slice(0,333)
  for(let i = 0; i<a.length; i++){
  const proxyUrl = `http://`+a[i].address
  console.log(proxyUrl)

  // Crea l'agent con il proxy
  const agent = new HttpsProxyAgent(proxyUrl);


  postWithProxy(agent)

  async function postWithProxy(agent) {
    try {
      // const response = await fetch("https://api.ipify.org/?format=json", {
      //   method: "GET",
      // //   headers: { "Content-Type": "application/json" },
      // //   body: JSON.stringify({ msg: "ciao dal proxy!" }),
      //   agent, // usa il proxy
      //         timeout: 20000, // 20 secondi

      // });

          let url = "https://chatgpt.com/backend-anon/sentinel/chat-requirements"
    let args = {
    "headers": {
        "accept": "*/*",
        "accept-language": "it-IT,it;q=0.9",
        "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
        "accept-encoding": "gzip, deflate, br, zstd",
        "cache-control": "no-cache",
        "content-type": "application/json",
        // "content-length": body.length+'',
        "oai-client-version": "prod-9d358314d30a26d59ec2f2390d079c86e2c0018f",
        "oai-device-id": "b83b32ec-805f-44f9-b36e-1007cbcb734e",
        "oai-language": "it-IT",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        // "cookie": store.stored_cookie,
        // "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
        "referrer": "https://chatgpt.com/",
    },
    "referrer": "https://chatgpt.com/",
    "body": "{\"p\":\"gAAAAACWzMwMDAsIkZyaSBTZXAgMDUgMjAyNSAyMjoxMDo1MiBHTVQrMDIwMCAoT3JhIGxlZ2FsZSBkZWxs4oCZRXVyb3BhIGNlbnRyYWxlKSIsNDI5NDcwNTE1MiwxLCJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTM5LjAuMC4wIFNhZmFyaS81MzcuMzYiLG51bGwsInByb2QtOWQzNTgzMTRkMzBhMjZkNTllYzJmMjM5MGQwNzljODZlMmMwMDE4ZiIsIml0LUlUIiwiaXQtSVQiLDAsImxvZ2lu4oiSW29iamVjdCBOYXZpZ2F0b3JMb2dpbl0iLCJfcmVhY3RMaXN0ZW5pbmd1d2U5YjB5cDVqaCIsInJlc2l6ZUJ5Iiw3MjUuMjk5OTk5OTgyMTE4NiwiMTQ4MTAyODMtNzEzNS00NjljLThmZTItOTY4ZDYyZTE4MzE0IiwiIiwxMiwxNzU3MTAzMDUyMTk4LjFd\"}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include",
    "redirect": 'follow',
    agent: agent
    }

      const response = await fetch(url, args)

      // const data = await response.text();
      const data = await response.text();
      // if(data.includes('{"ip":'))
      if(data.includes('"token"') && !data.includes('"force_login":true'))
      console.log("Risposta:", data);
    } catch (err) {
      // console.error("Errore nella richiesta:", err);
    }
  }



  }
}

testProxies(a)

// postWithProxy();
})()


function parseProxyHTML(htmlString) {
    const dom = new JSDOM(htmlString);
    const document = dom.window.document;

    
    const script = Array.from(document.querySelectorAll('script'))[4];
    let protection = script.innerHTML

    
    const rows = Array.from(document.querySelectorAll('tr.spy1x, tr.spy1xx'));
    const proxies = [];

    rows.slice(1).forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 9) return;

        function getPort(s){
          
          if(s.split('').filter(x=>x==':').length>1){
            return s.split(':').slice(-1)[0]
          }
          
          
          // console.log(s.split('+'))
          
          // return
          let ss=(protection+' ""+'+s.split('+').slice(1).join('+')).split('').slice(0,-1).join('')
          
          let port = eval(ss)

          
          
          // console.log('port', port)
          return port
        }

      
        const proxyAddress = cells[0].textContent.trim()
        
        const proxyType = cells[1].textContent.trim();
        const anonymity = cells[2].textContent.trim();
        const country = cells[3].textContent.trim();
        const hostnameOrg = cells[4].textContent.trim();
        const latency = cells[5].textContent.trim();
        const uptime = cells[7].textContent.trim();
        const lastChecked = cells[8].textContent.trim();

        proxies.push({
            ip: proxyAddress,
            ip_: proxyAddress.split('doc')[0],
            address: proxyAddress.split('doc')[0]+':'+getPort(proxyAddress),
            port: getPort(proxyAddress),
            type: proxyType,
            anonymity: anonymity,
            country: country,
            organization: hostnameOrg,
            latency: latency,
            uptime: uptime,
            lastChecked: lastChecked,
            avail: parseFloat(lastChecked.split('%')[0])/100
        });
    });

    return proxies.sort((b,a)=>a.avail - b.avail)
}




// ;(async()=>{
//   // return
// const res = await runCurlImpersonate({
//   url: 'https://spys.one/en/free-proxy-list',
//   method: 'POST',
//   timeoutMs: 20000,
//     headers: {
//     // "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//     // "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
//     "cache-control": "no-cache",
//     "content-type": "application/x-www-form-urlencoded",
//     "pragma": "no-cache",
//     "priority": "u=0, i",
//     // "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
//     "sec-ch-ua-arch": "\"x86\"",
//     "sec-ch-ua-bitness": "\"64\"",
//     "sec-ch-ua-full-version": "\"140.0.7339.128\"",
//     // "sec-ch-ua-full-version-list": "\"Chromium\";v=\"140.0.7339.128\", \"Not=A?Brand\";v=\"24.0.0.0\", \"Google Chrome\";v=\"140.0.7339.128\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-model": "\"\"",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-ch-ua-platform-version": "\"19.0.0\"",
//     "sec-fetch-dest": "document",
//     "sec-fetch-mode": "navigate",
//     "sec-fetch-site": "same-origin",
//     "sec-fetch-user": "?1",
//     "upgrade-insecure-requests": "1"
//   },
//     body: "xx0=f9094aa3d38084b8a34dce408a981c00&xpp=5&xf1=0&xf2=0&xf4=0&xf5=0",
// })
// console.log({res})
// })()
