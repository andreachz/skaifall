// const fetch = require("node-fetch");
const { HttpsProxyAgent } = require("https-proxy-agent");

// Proxy server
// const proxyUrl = "http://108.141.130.146:80";
const proxyUrl = "http://104.24.181.225:80";

// https://proxylist.geonode.com/api/proxy-list?limit=500&page=1&sort_by=lastChecked&sort_type=desc

// Crea l'agent con il proxy
const agent = new HttpsProxyAgent(proxyUrl);

async function postWithProxy() {
  try {
    const response = await fetch("https://google.com", {
      method: "get",
      headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ msg: "ciao dal proxy!" }),
      agent, // usa il proxy
    });

    const data = await response.text();
    console.log("Risposta:", data);
  } catch (err) {
    console.error("Errore nella richiesta:", err);
  }
}

postWithProxy();
