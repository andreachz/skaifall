const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
// const fetch = require("node-fetch");
const { HttpsProxyAgent } = require('https-proxy-agent');
const { HttpProxyAgent }  = require('http-proxy-agent');
const { URL } = require('url');
const { Readable } = require("node:stream"); // Node core


const fetch2 = require("node-fetch-v2");
// const { fetchAndParseSpyone, fetchAndParseProxyDB } = require('./proxy-fetch-parse');



// ///////////////////////

// import { HttpsProxyAgent } from 'https-proxy-agent';

/**
 * Race a set of proxies, using each up to `repeats` times with `spacingMs` between retries.
 * The first attempt for which `isWinner(res, body)` returns truthy wins.
 * All other in-flight/scheduled attempts are aborted.
 *
 * @param {Array<{address: string}>} proxies - list of proxies { address }
 * @param {string} url - the fetch URL
 * @param {object} args - base fetch options (method, headers, body, etc.)
 * @param {object} opts - extra options
 *   - repeats: number of retries per proxy (default 1)
 *   - spacingMs: delay between retries per proxy (default 0)
 *   - perRequestTimeoutMs: max time per fetch (default 20s)
 *   - maxProxies: limit how many proxies to consider (default 100)
 *   - isWinner: async fn(res, body) => boolean (default: res.ok && body.length > 0)
 */
async function raceProxies(
  proxies,
  url,
  args = {},
  {
    repeats = 1,
    spacingMs = 0,
    perRequestTimeoutMs = 20_000,
    maxProxies = 100,
    consume = true,
    isWinner = async (res, body) => res.ok && !!body, // default check
  } = {}
) {
  const list = proxies.slice(0, maxProxies);

  const series = list.map(p =>
    makeAttemptSeries(p, url, args, { repeats, spacingMs, perRequestTimeoutMs, isWinner, consume })
  );

  const promises = series.map(s => s.promise);
  const aborters = series.map(s => s.abort);
  
  // Build a race that resolves with the FIRST rejection (chronologically).
  // We turn each rejection into a resolution payload so Promise.race can pick it.
  // const firstRejection = Promise.race(
  //   promises.map((p, i) =>
  //     p.then(
  //       // If it fulfills, never resolve in this race.
  //       () => new Promise(() => {}),
  //       (error) => ({
  //         index: i,
  //         error,
  //         at: Date.now(),
  //       })
  //     )
  //   )
  // );


  let winner;
  try {
    winner = await Promise.any(promises);
  }
  catch(e){
    
    console.log(e);
    // console.log('returing dummy winner, ')
    // console.log('returning first rejected loser as fallback');
    // winner = await firstRejection; // should already be in { proxy, res, body, ms, attempt } format
    
  }
  finally {
    aborters.forEach(abort => abort()); // stop everyone else
  }

  return winner; // { proxy, res, body, ms, attempt }
}

async function raceProxies2_forStream(proxies, url, args = {}, opts = {}) {
  const {
    repeats = 1,
    spacingMs = 0,
    perRequestTimeoutMs = 20_000,
    maxProxies = 100,
    consume = true,
    isWinner = async (res, body) => res.ok && !!body,
  } = opts;

  const list = proxies.slice(0, maxProxies);
  const series = list.map(p =>
    makeAttemptSeries(p, url, args, { repeats, spacingMs, perRequestTimeoutMs, isWinner, consume })
  );

  // Wrap so Promise.any tells us *which* promise won
  const wrapped = series.map((s, i) =>
    s.promise.then(v => ({ i, v }))
  );

  let winnerIndex = -1;
  let winnerValue;

  try {
    const { i, v } = await Promise.any(wrapped);
    winnerIndex = i;
    winnerValue  = v;
  } finally {
    series.forEach((s, i) => {
      if (i !== winnerIndex) s.abort();   // abort only losers
    });
  }

  return winnerValue; // { proxy, res, body, ms, attempt }
}


function makeAttemptSeries(proxyEntry, url, args, opts) {
  const { repeats, spacingMs, isWinner, consume } = opts;

  let canceled = false;
  let currentAbort = null;
  let spacingTimer = null;

  const abort = () => {
    canceled = true;
    if (spacingTimer) clearTimeout(spacingTimer);
    if (currentAbort) currentAbort();
  };

  const promise = new Promise(async (resolve, reject) => {
    const startSeries = Date.now();

    for (let i = 0; i < repeats; i++) {
      if (canceled) return reject(new Error('Series canceled'));

      try {
        const { result, aborter } = attemptOnce(proxyEntry, url, args, opts);
        currentAbort = aborter;
        
        const res_ = await result;
        let res = res_
        // If we're streaming, convert node-fetch v2 body (Node Readable) -> Web ReadableStream
        if (!consume && res && res.body) {
          try {
            const webBody = Readable.toWeb(res.body); // this is a Web ReadableStream
            res = new Response(webBody, {
              status: res.status,
              statusText: res.statusText,
              headers: new Headers(res.headers.raw()), // convert node-fetch v2 Headers
            });
          } catch (e) {
            console.error('toWeb failed', e);
          }
        }
        // console.log(typeof res.body.getReader); // 'function'

        // if(!consume){
        //   console.log(res.status, res.ok)
        // }
        let body
        if(consume)
        body = await res.text();
        // console.log(body)

        // // Suppose `res` is a Node http.IncomingMessage
        // const webStream = Readable.toWeb(res);

        // const response_webStream = new Response(webStream, {
        //   status: res.statusCode,
        //   statusText: res.statusMessage,
        //   headers: res.headers, // careful: Node gives raw object; Response wants HeadersInit
        // });
        
        // console.log(body.slice(0,-20))
        if (await isWinner(res, body) || (await isWinnerGeneric(res, body) && !consume)) {
          // console.log('winner', proxyEntry.address)
          return resolve({
            proxy: proxyEntry,
            res,
            body,
            ms: Date.now() - startSeries,
            attempt: i + 1,
          });
        } else {
          throw new Error('Not a winner');
        }
      } catch (err) {
        currentAbort = null;
        if (i === repeats - 1) return reject(err);

        // wait spacingMs before next retry
        await new Promise(r => {
          spacingTimer = setTimeout(r, spacingMs);
        });
      }
    }
  });

  return { promise, abort };
}

function attemptOnce(proxyEntry, url, args, { perRequestTimeoutMs }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), perRequestTimeoutMs);

  const proxyUrl = 'http://' + proxyEntry.address;
  // const agent = new HttpsProxyAgent(proxyUrl);
  const target   = new URL(url);
  const agent    = target.protocol === 'http:'
    ? new HttpProxyAgent(proxyUrl)
    : new HttpsProxyAgent(proxyUrl);

  const result = (async () => {
    try {
      return await fetch2(url, {
        ...args,
        agent,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  })();

  return {
    result,
    aborter: () => {
      clearTimeout(timer);
      controller.abort();
    },
  };
}



// const proxies = [
//   { address: '1.2.3.4:8080' },
//   { address: '5.6.7.8:8080' },
//   // ...
// ];

// const url = "https://api.ipify.org/?format=json";
// const args = { method: "GET" };

const isWinner = async (res, body) => {
  
  if (!res.ok) return false;
  try {
    // console.log(body.slice(-20),'xx')  
    return body.includes('"token"') && !body.includes('"force_login":true')
    // const json = JSON.parse(body);
    // return typeof json.ip === "string"; // winner if response has "ip"
  } catch {
    return false;
  }
};
const isWinnerGeneric = async (res, body) => {
  if (!res.ok) return false;
  try {
    return true
    // const json = JSON.parse(body);
    // return typeof json.ip === "string"; // winner if response has "ip"
  } catch {
    return false;
  }
};
const isWinnerDuckDuckGo = async (res, body) => {
  if (!res.ok) return false;
  try {
    return true
    // const json = JSON.parse(body);
    // return typeof json.ip === "string"; // winner if response has "ip"
  } catch {
    return false;
  }
};

// raceProxies(proxies, url, args, { repeats: 3, spacingMs: 300, isWinner })
//   .then(w => {
//     console.log('Winner proxy:', w.proxy.address, 'attempt', w.attempt, 'in', w.ms, 'ms');
//     console.log('IP response:', w.body);
//   })
//   .catch(err => {
//     console.error('All proxies failed:', err);
//   });


// console.log(__dirname)




const isWinnerStreaming = async (res /*, _body */) => {
  if (!res.ok) return false;
  const ctype = res.headers.get('content-type') || '';
  // Typical SSE header; relax this if your server sets a different one.
  return ctype.includes('text/event-stream');
};





module.exports = {raceProxies, isWinner, isWinnerDuckDuckGo, isWinnerGeneric, isWinnerStreaming, raceProxies2_forStream}