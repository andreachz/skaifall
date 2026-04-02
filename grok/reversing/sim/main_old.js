// Original POST request metadata object (for reference)
/*
{
  e: {
    url: "https://grok.com/rest/app-chat/conversations/6443e039-0289-492c-903f-ebed4b879894/responses",
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "...",
      credentials: "include"
    }
  },
  t: {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "...",
    credentials: "include"
  },
  n: "POST",
  r: "hiCpBL6t1S0ZlSnb6balj4DedPrp2tNJZUaukU7H4SivOXKsfH/0tT3Cp21uCR4XK4bUP4L5JsQiqbU+9AxbY4rXYJMUhQ",
  o: "f4bd5dcc-1c90-4ef3-8714-a782f7380357"
}
*/

// Load a script chunk dynamically (probably a runtime helper)
["object" == typeof document ? document.currentScript : void 0, 483347, (loader) => {
  loader.v((callback) => 
    Promise.all(["static/chunks/84383766740feaa1.js"].map(path => loader.l(path)))
      .then(() => callback(880932))
  );
}];

// Lazy initialization for async module loading
async function loadModule(name, method) {
  // Cache the module load
  modulePromise = modulePromise || new Promise(resolve => {
    e.A(483347).then(mod => resolve(mod.default()));
  });

  const module = await modulePromise;
  return await module(name, method);
}

// Main function that modifies the request headers with unique IDs
let prepareRequest = async (req) => {
  let methodName, moduleValue;

  // Generate a unique UUID for each request
//   const requestId = (0, i.v4)();
  const requestId = "6443e039-0289-492c-903f-ebed4b879894"

  // Ensure request init object and headers exist
  req.init = req.init || {};
  req.init.headers = req.init.headers || {};

  try {
    // Call the dynamic module loader to get a "statsig" ID
    moduleValue = await loadModule(
      // Extract pathname from URL (without query params)
      (new URL(req.url).pathname || "").split("?")[0].trim() || "",
      req.init.method || ""
    );
  } catch (error) {
    // If it fails, encode the error message safely
    moduleValue = btoa(`e:${error}`);
  }

  // Add headers safely depending on their type
  if (req.init.headers instanceof Headers) {
    req.init.headers.set("x-xai-request-id", requestId);
    req.init.headers.set("x-statsig-id", moduleValue);
  } else if (Array.isArray(req.init.headers)) {
    req.init.headers.push(["x-xai-request-id", requestId]);
    req.init.headers.push(["x-statsig-id", moduleValue]);
  } else {
    req.init.headers["x-xai-request-id"] = requestId;
    req.init.headers["x-statsig-id"] = moduleValue;
  }

  return req;
};


let req = {
  e: {
    url: "https://grok.com/rest/app-chat/conversations/6443e039-0289-492c-903f-ebed4b879894/responses",
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "...",
      credentials: "include"
    }
  },
  t: {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "...",
    credentials: "include"
  },
  n: "POST",
  r: "hiCpBL6t1S0ZlSnb6balj4DedPrp2tNJZUaukU7H4SivOXKsfH/0tT3Cp21uCR4XK4bUP4L5JsQiqbU+9AxbY4rXYJMUhQ",
  o: "f4bd5dcc-1c90-4ef3-8714-a782f7380357"
}

console.log(prepareRequest(req))