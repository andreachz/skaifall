const fetch = require("node-fetch-v2");
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const { parseOptions } = require("../ai-modules/openai/barejs/helpers");

// Reuse the parser from earlier (included here for convenience)
function parseProxyDB(html) {
  function toDoc(str) {
    const dom = new JSDOM(str);
    return dom.window.document;
  }

  const doc = toDoc(html);
  const rows = doc.querySelectorAll("table tbody tr");
  const results = [];

  const txt = (el) => (el ? el.textContent.replace(/\s+/g, " ").trim() : "");
  const first = (el, sel) => (el ? el.querySelector(sel) : null);

  rows.forEach((tr) => {
    const tds = tr.querySelectorAll("td");
    if (!tds || tds.length < 9) return;

    const ip = txt(first(tds[0], "a"));
    const port = txt(first(tds[1], "a"));
    const type = txt(tds[2]);

    const countryImgAlt = first(tds[3], "img")?.getAttribute("alt") || "";
    const countryAbbrText = txt(first(tds[3], "abbr"));
    const country = countryImgAlt || countryAbbrText || txt(tds[3]);

    const anonymity = txt(first(tds[4], "span"));
    const uptime = txt(tds[5]);
    const rtime = txt(tds[6]);

    let gateway = txt(tds[7]);
    if (gateway === "–" || gateway === "-") gateway = "";

    const checkedSpan = first(tds[8], "span");
    const checkedTitle = checkedSpan?.getAttribute("title") || "";
    let checked = "";
    if (checkedTitle.includes("Last check:")) {
      const m = checkedTitle.match(/Last check:\s*([0-9-]{10}\s[0-9:]{8})/);
      checked = m ? m[1] : txt(checkedSpan);
    } else {
      checked = txt(checkedSpan);
    }

    results.push({
      ip: ip,
      port: port,
      type: type,
      address: ip+':'+port,
      country: country,
      anonymity: anonymity,
      uptime: uptime,
      avail: parseFloat(uptime.slice(0,-1))/100,
      r_time: rtime,
      gateway: gateway,
      checked: checked,
      downloaded: new Date().toISOString(),
      source: 'proxydb.net'
    });
  });

  return results;
}

// Fetch pages (offsets: 0..120 step 30) and aggregate
async function fetchAndParseProxyDB() {
  let max_items = 500
  let offset = 30
  const offsets = Array(parseInt(max_items/offset)).map((x,i)=>i*offset)
  const base = "https://proxydb.net/?country=&offset={offset}&protocol=http&protocol=https";

  const arr = [];

  for (const offset of offsets) {
    const url = base.replace("{offset}", String(offset));
    try {
      const res = await fetch(url, {
        headers: {
          "Accept": "text/html,application/xhtml+xml",
          "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' || "Mozilla/5.0",
        },
      });
      if (!res.ok) {
        console.warn(`Fetch failed (${res.status}) for offset ${offset}`);
        continue;
      }
      const html = await res.text();
    //   console.log(html)
      arr.push(...parseProxyDB(html));
      // small delay to be polite
      await new Promise((r) => setTimeout(r, 100));
    } catch (err) {
      console.error(`Error fetching offset ${offset}:`, err);
    }
  }

  return arr;
}

async function fetchAndParseSpysone(){
      const res = await fetch("https://spys.one/en/http-proxy-list/", {
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
    })

    const htmlString = await res.text()
        
    let parsed = parseProxyHTML(htmlString)
    fs.writeFileSync(PROXY_HTML_PATH, htmlString)
    return parsed
}

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
        const downloaded = new Date().toISOString()
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
            avail: parseFloat(lastChecked.split('%')[0])/100,
            downloaded,
            source: 'spys.one'
        });
    });

    return proxies.sort((b,a)=>a.avail - b.avail)
}

// // Example usage:
// (async () => {
//   const proxies = await getProxyList();
//   console.log(proxies);
//   console.log(proxies.length);
// })();


const PROXY_LIST_FILE_PATH = path.join(__dirname,'proxy.json')
const PROXY_HTML_PATH = path.join(__dirname,'proxy_spysone.html')

async function fetchProxyList(){
  console.log('updating proxy list...')
    
    let parsed1 = await fetchAndParseSpysone()
    let parsed2 = await fetchAndParseProxyDB()

    let parsed = [...parsed1, ...parsed2].sort((a,b)=>{b.avail - a.avail})

    if(parsed.length > 100){
        
        fs.writeFileSync(PROXY_LIST_FILE_PATH,JSON.stringify(parsed, null, 1))
        proxyList = parsed
        console.log('proxy update list successful')
    }
    else{
      console.log('proxy update list failed')
    }

}

let proxyList = JSON.parse(fs.readFileSync(PROXY_LIST_FILE_PATH))


// testing
// ;(async () => {

    
//     let parsed1 = await fetchAndParseSpysone()
//     // let parsed1 = []
//     let parsed2 = await fetchAndParseProxyDB()

//     let parsed = [...parsed1, ...parsed2].slice(-20)

//     console.log(parsed, parsed1.length, parsed2.length, parsed.length)
// })();




setInterval(()=>{
updateProxyListFile()
},3600*1000)

// updateProxyListFile(process.argv.find(x=>x=='uproxy'))
updateProxyListFile(parseOptions().uproxy)

// function delay(){
//   return new Promise(resolve=>{setTimeout(()=>{resolve()},7777)})
// }

async function updateProxyListFile(force){
  // if(force) console.log('updating proxy list');
  // await delay()
  if((new Date().valueOf()) - fs.statSync(PROXY_LIST_FILE_PATH).mtime.getTime() > 1*60*60*1000 || force){
    await fetchProxyList()
  }
}


function getProxyCacheList(){
    return proxyList
}

module.exports = {fetchProxyList, updateProxyListFile, getProxyCacheList}