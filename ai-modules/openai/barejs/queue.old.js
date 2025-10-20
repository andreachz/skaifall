const { updateStateWorkers } = require("./apis");
const { runRequestServer } = require("./interfaces/cli");
const { DEFAULT_STORE } = require("./store");

const N_WORKERS = 10;

// helper to clone a fresh worker
const makeWorker = () => structuredClone
  ? structuredClone(DEFAULT_STORE)
  : JSON.parse(JSON.stringify(DEFAULT_STORE));

const clone = (o) => structuredClone ? structuredClone(o) : JSON.parse(JSON.stringify(o));

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
  console.log(`Changed index ${prop}:`, oldVal, "→", newVal);

  // If you truly want to ignore changes during init, this is sufficient:
  if (isInit) return;

  // Example: do something when all workers are ready
  const allReady = workers.every(Boolean);
  if (allReady) {
    // ... your post-init logic
  }


}

// Start with distinct objects
let workers = observeArray(Array.from({ length: N_WORKERS }, makeWorker), onChange);

let isInit = true;

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
  // Optional: signal that init finished
  console.log("Initialization complete");
})();


function findReadyWorker(arr){
  const index = arr.findIndex(v => v !== null && v !== undefined);
  return index !== -1 ? { value: arr[index], index } : {value: undefined, index: -1};
}

function runRequestServerQueue(prompt, _model, stream, options){
    let wi = findReadyWorker(workers)
    let store_ = clone(wi.value)
    let index = wi.index
    
    updateStateWorkers(store_).then(x=>workers[index]=x)

    
    // return runRequestServer(prompt, _model, stream, options, store_)
    return runRequestServer(prompt, _model, stream, options={...options, worker_store: store_})

}