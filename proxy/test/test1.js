const fetch = require("node-fetch");
const { HttpsProxyAgent } = require("https-proxy-agent");

// Proxy server
// const proxyUrl = "http://185.250.65.162:312";
// 45.186.6.104:3128
const proxyUrl = `http://
177.234.194.30:999	




`.trim().replaceAll('\n','').replaceAll(' ','');
console.log(proxyUrl)
// Crea l'agent con il proxy
const agent = new HttpsProxyAgent(proxyUrl);

async function postWithProxy() {
  try {
    const response = await fetch("https://api.ipify.org/?format=json", {
      method: "GET",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ msg: "ciao dal proxy!" }),
      agent, // usa il proxy
            timeout: 20000, // 20 secondi

    });

    const data = await response.text();
    console.log("Risposta:", data);
  } catch (err) {
    console.error("Errore nella richiesta:", err);
  }
}

postWithProxy();
