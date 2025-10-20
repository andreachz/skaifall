const { updateStateWorkers } = require("./apis");
const { runRequestServer } = require("./interfaces/server-interfaces");
const { DEFAULT_STORE } = require("./store");

const N_WORKERS = 10;

const ENABLE_USE_WORKERS = 0 

// helper to clone a fresh worker
const makeWorker = () => structuredClone
  ? structuredClone(DEFAULT_STORE)
  : JSON.parse(JSON.stringify(DEFAULT_STORE));

const clone = (o) => structuredClone ? structuredClone(o) : JSON.parse(JSON.stringify(o));

// ---- waiters & init gate -----------------------------------
let waiters = [];
let isInit = true;
let resolveInit;
const initDone = new Promise(r => (resolveInit = r));

// Notify all waiters if a worker is available
function notifyIfAvailable() {
  if (findReadyWorker(workers).index !== -1) {
    const toResolve = waiters;
    waiters = [];
    toResolve.forEach(fn => fn());
  }
}
const waitOne = () => new Promise(res => waiters.push(res));

// ------------------------------------------------------------

function observeArray(arr, callback) {
  return new Proxy(arr, {
    set(target, property, value, receiver) {
      const oldValue = target[property];
      const result = Reflect.set(target, property, value, receiver);
      if (property !== "length") callback(property, oldValue, value);
      return result;
    },
    deleteProperty(target, property) {
      const oldValue = target[property];
      const result = Reflect.deleteProperty(target, property);
      callback(property, oldValue, undefined);
      return result;
    }
  });
}

function onChange(prop, oldVal, newVal) {
  // console.log(`Changed index ${prop}:`, oldVal, "→", newVal);
  if (isInit) return;
  // wake any waiters when a worker becomes ready
  notifyIfAvailable();
}



function findReadyWorker(arr){
  const index = arr.findIndex(v => v !== null && v !== undefined && !v.isUpdatingTokens && v.proofToken);
  return index !== -1 ? { value: arr[index], index } : { value: undefined, index: -1 };
}

// Claim a worker slot atomically by flipping it to undefined while busy
function tryClaimWorker() {
  const { value, index } = findReadyWorker(workers);
  if (index === -1) return { index: -1, store_: undefined };
  const store_ = clone(value);
  // mark as busy; this prevents other callers from picking the same slot
  workers[index] = undefined;
  return { index, store_ };
}

async function runRequestServerQueue(prompt, _model, stream, options) {
  if(!ENABLE_USE_WORKERS){
    return {msg: 'feature disabled'}
  }
  // Ensure initialization finished
  if (isInit) await initDone;

  // Wait until we can claim a worker
  let claim;
  // small loop + event wait avoids races between multiple callers
  // (only the one that successfully flips a slot to undefined proceeds)
  // eslint-disable-next-line no-constant-condition
  while (true) {
    claim = tryClaimWorker();
    if (claim.index !== -1) break;
    await waitOne();
  }
  let { index, store_ } = claim;

  console.log('now using worker', index)

  // Kick off worker state refresh for that slot; when it completes, the slot becomes ready again
  // (pass index if your updateStateWorkers expects it)
  // updateStateWorkers(clone(store_), index).then(x => {
  //   workers[index] = x; // triggers onChange -> notifyIfAvailable()
  // }).catch(err => {
  //   console.error("updateStateWorkers failed:", err);
  //   // ensure the slot doesn't stay stuck; re-seed with a fresh worker
  //   workers[index] = makeWorker();
  // });

  // Persistently refresh the slot in the background; the slot remains "busy" (undefined)
  // until updateStateWorkers eventually succeeds.
  refreshWorkerSlot(index, store_);

  // Run the actual request with the claimed store
  return runRequestServer(prompt, _model, stream, options, store_ );
}




// --- helpers for persistent retry ---------------------------------
const inflightRefresh = new Map();

const delay = (ms) => new Promise(r => setTimeout(r, ms));
// exponential backoff with jitter; unbounded retries, capped delay
const backoff = (attempt, { base = 250, max = 10_000 } = {}) => {
  const exp = Math.min(max, base * Math.pow(2, attempt));
  const jitter = exp * (Math.random() * 0.2 - 0.1); // ±10%
  return Math.max(0, exp + jitter);
};

/**
 * Persistently refresh a worker slot until updateStateWorkers succeeds.
 * Ensures only one refresher runs per index.
 */
function refreshWorkerSlot(index, seedStore) {
  if (inflightRefresh.has(index)) return inflightRefresh.get(index);

  const p = (async () => {
    let attempt = 0;
    // keep trying until success
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        // use a fresh clone each attempt
        let cloned = clone(seedStore)
        // cloned.isUpdatingTokens = true
        // workers[index].isUpdatingTokens = true
        // cloned.isUpdatingTokens = true
        
        const next = await updateStateWorkers(cloned, index);
        if(!next){throw new Error('aaa')}
        workers[index] = next;              // ready again -> onChange() notifies waiters
        inflightRefresh.delete(index);
        // workers[index].isUpdatingTokens=false
        return next;
      } catch (err) {
        console.error(`updateStateWorkers failed for slot ${index} (attempt ${attempt + 1}):`, err);
        await delay(backoff(attempt++));
        // loop and retry
      }
    }
  })();

  inflightRefresh.set(index, p);
  return p;
}
// -------------------------------------------------------------------



let workers
if(ENABLE_USE_WORKERS){
// Start with distinct objects
 workers = observeArray(Array.from({ length: N_WORKERS }, makeWorker), onChange);

// Initialize all workers and then flip isInit
(async () => {
  await Promise.all(
    workers.map(async (_x, i) => {
      const initial = makeWorker(); // fresh per worker
      const updated = await updateStateWorkers(initial, i);
      workers[i] = updated; // triggers onChange, but isInit blocks it
    })
  );
  isInit = false;
  resolveInit();
  console.log("Initialization complete");
})();

setInterval(()=>{
  workers.forEach((w,i)=>{
      if(w && w.chatReq && w.chatReq.expire_at && ((w.chatReq.expire_at - 5) < new Date().valueOf()/1000) && !w.isUpdatingTokens){
        refreshWorkerSlot(i,w)
      }
  })
},2000)

}
module.exports = {runRequestServerQueue}