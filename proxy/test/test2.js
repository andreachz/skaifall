// const {runCurlImpersonate} = require('./impersonate-api');
// const fetch = require('node-fetch')
const { JSDOM } = require('jsdom');
const fs=require('fs')
fetch("https://spys.one/en/http-proxy-list/", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control": "no-cache",
    "content-type": "application/x-www-form-urlencoded",
    "pragma": "no-cache",
    "priority": "u=0, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-arch": "\"x86\"",
    "sec-ch-ua-bitness": "\"64\"",
    "sec-ch-ua-full-version": "\"140.0.7339.128\"",
    "sec-ch-ua-full-version-list": "\"Chromium\";v=\"140.0.7339.128\", \"Not=A?Brand\";v=\"24.0.0.0\", \"Google Chrome\";v=\"140.0.7339.128\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-model": "\"\"",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-ch-ua-platform-version": "\"19.0.0\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1"
  },
  "referrer": "https://spys.one/en/http-proxy-list/",
  "body": "xx0=f9094aa3d38084b8a34dce408a981c00&xpp=5&xf1=0&xf2=0&xf4=0&xf5=0",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
}).then(x=>x.text())
.then(x=>{console.log(x)
// let htmlString = '<table width="100%" border=0'+x.split('<table width="100%" border=0')[1].split('</table>')[0]+'</table>'
let htmlString = x
fs.writeFileSync('page500.2.html',x)
fs.writeFileSync('data500.2.json',JSON.stringify(parseProxyHTML(htmlString), null, 1))
  

})



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
  // // return
// const res = await runCurlImpersonate({
//   url: 'https://spys.one/en/free-proxy-list',
//   method: 'POST',
//   timeoutMs: 20000,
//     "headers": {
//     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//     "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
//     "cache-control": "no-cache",
//     "content-type": "application/x-www-form-urlencoded",
//     "pragma": "no-cache",
//     "priority": "u=0, i",
//     "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
//     "sec-ch-ua-arch": "\"x86\"",
//     "sec-ch-ua-bitness": "\"64\"",
//     "sec-ch-ua-full-version": "\"140.0.7339.128\"",
//     "sec-ch-ua-full-version-list": "\"Chromium\";v=\"140.0.7339.128\", \"Not=A?Brand\";v=\"24.0.0.0\", \"Google Chrome\";v=\"140.0.7339.128\"",
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
//     "body": "xx0=f9094aa3d38084b8a34dce408a981c00&xpp=5&xf1=0&xf2=0&xf4=0&xf5=0",
// })
// console.log(res.stdout)
// })()
