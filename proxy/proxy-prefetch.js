// npm i https-proxy-agent if you don't already have it
// const { HttpsProxyAgent } = require('https-proxy-agent');

async function collectWinnersWithin(
  proxies,
  url,
  args = {},
  {
    repeats = 1,
    spacingMs = 0,
    perRequestTimeoutMs = 20_000,
    maxProxies = 100,
    isWinner = async (res, body) => res.ok && !!body,
    timeoutMs = 10_000,                  // NEW: wall-clock collection window
    stopAfterFirstPerProxy = true,       // NEW: collect at most one winner per proxy by default
  } = {}
) {
  const deadline = Date.now() + Math.max(0, timeoutMs);
  const list = proxies.slice(0, maxProxies);

  const results = [];
  const aborters = [];

  const onWin = (hit) => {
    results.push(hit);
  };

  // spin up a series per proxy
  const series = list.map((p) =>
    makeCollectorSeries(p, url, args, {
      repeats,
      spacingMs,
      perRequestTimeoutMs,
      isWinner,
      deadline,
      onWin,
      stopAfterFirstPerProxy,
    })
  );

  // keep abort handles to stop everything at the deadline
  aborters.push(...series.map((s) => s.abort));

  // wait until the deadline
  await waitUntil(deadline);

  // stop everyone else once time is up
  aborters.forEach((a) => a());

  // allow any finally/cleanup in the series to settle
  await Promise.allSettled(series.map((s) => s.done));

  return results; // array of { proxy, res, body, ms, attempt, ts }
}

function makeCollectorSeries(
  proxyEntry,
  url,
  args,
  {
    repeats,
    spacingMs,
    perRequestTimeoutMs,
    isWinner,
    deadline,
    onWin,
    stopAfterFirstPerProxy,
  }
) {
  let canceled = false;
  let currentAbort = null;
  let spacingTimer = null;

  const abort = () => {
    canceled = true;
    if (spacingTimer) clearTimeout(spacingTimer);
    if (currentAbort) currentAbort();
  };

  const done = (async () => {
    const startSeries = Date.now();
    let winsForThisProxy = 0;

    for (let i = 0; i < repeats; i++) {
      if (canceled || Date.now() >= deadline) break;

      try {
        const { result, aborter } = attemptOnce(proxyEntry, url, args, {
          perRequestTimeoutMs,
        });
        currentAbort = aborter;

        const res = await result;
        const body = await res.text();

        if (await isWinner(res, body)) {
          winsForThisProxy++;
          onWin({
            proxy: proxyEntry,
            res,
            body,
            ms: Date.now() - startSeries,
            attempt: i + 1,
            ts: Date.now(),
          });

          if (stopAfterFirstPerProxy) break;
        }

        // if not a winner, fall through to retry logic
        if (i < repeats - 1 && spacingMs > 0) {
          const remaining = Math.max(0, deadline - Date.now());
          if (remaining === 0) break;
          await new Promise((r) => {
            spacingTimer = setTimeout(r, Math.min(spacingMs, remaining));
          });
        }
      } catch {
        // attempt failed or timed out
        currentAbort = null;

        if (i < repeats - 1 && !canceled) {
          const remaining = Math.max(0, deadline - Date.now());
          if (remaining === 0) break;
          await new Promise((r) => {
            spacingTimer = setTimeout(r, Math.min(spacingMs, remaining));
          });
        }
      }
    }
  })();

  return { done, abort };
}

function attemptOnce(proxyEntry, url, args, { perRequestTimeoutMs }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), perRequestTimeoutMs);

  const proxyUrl = 'http://' + proxyEntry.address;
  const agent = new HttpsProxyAgent(proxyUrl);

  const result = (async () => {
    try {
      return await fetch(url, {
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

function waitUntil(deadlineMs) {
  const delay = Math.max(0, deadlineMs - Date.now());
  return new Promise((r) => setTimeout(r, delay));
}

/* -------------------------
   Example usage:

const proxies = [
  { address: '1.2.3.4:8080' },
  { address: '5.6.7.8:8080' },
  // ...
];

const url = "https://api.ipify.org/?format=json";
const args = { method: "GET" };


collectWinnersWithin(proxies, url, args, {
  repeats: 3,
  spacingMs: 300,
  perRequestTimeoutMs: 5_000,
  timeoutMs: 7_500,
  isWinner,
  stopAfterFirstPerProxy: true,
}).then((hits) => {
  for (const h of hits) {
    console.log(
      `WIN from ${h.proxy.address} on attempt #${h.attempt} in ${h.ms}ms`,
      h.body
    );
  }
}).catch((err) => {
  console.error('Collector error:', err);
});
------------------------- */

module.exports = {collectWinnersWithin}