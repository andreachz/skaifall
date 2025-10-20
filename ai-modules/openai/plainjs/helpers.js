const {userAgents} = require('./constants')
function parseEventStreamMessages(stream) {
  // Split lines, keep only those starting with "data:"
  const lines = stream.split("\n").map(l => l.trim()).filter(l => l.startsWith("data:"));

  const results = [];
  for (const line of lines) {
    const jsonPart = line.replace(/^data:\s*/, "");
    if (jsonPart === "[DONE]") continue; // skip end marker

    try {
      results.push(JSON.parse(jsonPart));
    } catch (e) {
      // If it's not valid JSON (like server metadata lines), wrap as string
      results.push(jsonPart);
    }
  }

  return results;
}


function extractMessageContent(events) {
  return events
    .filter(e => e && e.v && (typeof e.v === "string" || e.v.length))
    .map(e => {
        if(typeof e.v === "string"){
            return e.v
        }
        else{
            return (e.v.find(x=>x?.o=="append")||'_').v
        }
    }) // join parts array into string
    .join(""); // join all chunks into one final string
}



function extractUsefulTextFromChunk(chunk) {
  const texts = [];

  function extractTextsFromObj(obj) {
    // Caso 1: {"p": "...", "o": "append", "v": "testo"}
    if (typeof obj.v === "string" && obj.o === "append") {
      texts.push(obj.v);
      return;
    }

    // Caso 2: Patch con lista di operazioni
    if ((obj.o === "patch" || obj.o === undefined) && Array.isArray(obj.v)) {
      for (const op of obj.v) {
        if (op && op.o === "append" && typeof op.v === "string") {
          texts.push(op.v);
        }
      }
      return;
    }

    // Caso 3: Oggetto con message completo
    if (obj.v && typeof obj.v === "object" && obj.c != 1) {
      // Esempio: {"v": {"message": {...}}}
      const msg = obj.v.message;
      if (msg && msg.content && msg.content.content_type === "text") {
        const parts = msg.content.parts;
        if (Array.isArray(parts)) {
          const joined = parts.filter(p => typeof p === "string").join("");
          if (joined) texts.push(joined);
        }
      }

      // Caso raro: {"v": {"v": "testo"}}
      if (typeof obj.v.v === "string" && !("message" in obj.v)) {
        texts.push(obj.v.v);
      }
      return;
    }

    // Caso 4: {"v": "testo"}
    if (typeof obj.v === "string") {
      texts.push(obj.v);
    }
  }

  for (const line of chunk.split("\n")) {
    if (!line.startsWith("data:")) continue;

    const payload = line.slice(5).trim();

    // ignora non-JSON (tipo "v1", "DONE")
    if (!(payload.startsWith("{") && payload.endsWith("}"))) continue;

    let obj;
    try {
      obj = JSON.parse(payload);
    } catch {
      continue;
    }

    // ignora metadati
    if (["server_ste_metadata", "message_stream_complete", "conversation_detail_metadata"]
        .includes(obj.type)) {
      continue;
    }
    // console.log(obj)
    extractTextsFromObj(obj);
  }

  return texts.join("");
}




// Simple random rotation
function getRandomUserAgent(i) {
  if(i !== undefined){
    return userAgents[i]
  }
  const index = Math.floor(Math.random() * userAgents.length);
  return userAgents[index];
}

/* Example:
const out = reconstructMessageTexts(rawEventStreamString);
console.log(out);
// -> ["", "ciao", "Ciao! Come va?"]  (you can filter empty system messages if you want)
*/


// // Example usage
// const rawData = `... your big stream string ...`;
// console.log(reconstructMessages(rawData));


// // Example
// const rawData = `... your stream string ...`;
// console.log(JSON.stringify(parseEventStreamMessages(rawData), null, 2));


function listenForKeyOnce(key_='\u001b', callback) {
  // Save current raw mode so we can restore later
  const wasRaw = process.stdin.isRaw;

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  const handler = (key) => {
    if (key === key_) { // ESC
      process.stdin.removeListener('data', handler);
      if (!wasRaw) process.stdin.setRawMode(false); // restore raw mode
      callback();
    }
  };

  process.stdin.on('data', handler);
}


function parseOptions(argv) {
  const options = {};
  const args = (argv||process.argv).slice(2); // skip node + script.js

  args.forEach((arg, i) => {
    if (arg.startsWith("--")) {
      // --key=value OR --key value
      const [key, value] = arg.includes("=")
        ? arg.slice(2).split("=")
        : [arg.slice(2), args[i + 1] && !args[i + 1].startsWith("-") ? args[i + 1] : true];

      // try to cast to number/boolean if possible
      if (value === "true") options[key] = true;
      else if (value === "false") options[key] = false;
      else if (!isNaN(value)) options[key] = Number(value);
      else options[key] = value;
    } else if (arg.startsWith("-")) {
      // short flag like -d
      const flags = arg.slice(1).split("");
      flags.forEach(flag => (options[flag] = true));
    }
  });

  return options;
}

// Example usage:
// const opts = parseOptions(process.argv);
// console.log(opts);


function getGptModelFromChunk(s){
  // "model_slug": "gpt-5", 
  // event: delta
  // data: {"v": {"message": {"id": "2b45b056-be90-44bf-a128-4878edc31cb0", "author": {"role": "assistant", "name": null, "metadata": {}}, "create_time": 1760385847.020515, "update_time": null, "content": {"content_type": "model_editable_context", "model_set_context": "", "repository": null, "repo_summary": null, "structured_context": null}, "status": "finished_successfully", "end_turn": null, "weight": 1.0, "metadata": {"request_id": "98e171ac9af6ae73-BOG", "message_type": "next", "model_slug": "gpt-5", "default_model_slug": "auto", "parent_id": "e4ed15b1-1439-4727-84e8-beff7f969b9f", "turn_exchange_id": "1e8055f5-07d5-405c-9ce1-e16a7cd9e224", "timestamp_": "absolute", "model_switcher_deny": []}, "recipient": "all", "channel": null}, "conversation_id": "68ed5b35-bfe4-8325-895e-fd65dbf79bf1", "error": null}, "c": 2}
  if(!s.includes('"model_slug"')){
    return undefined
  }
  
  return s.split('"model_slug": "')[1].split('", ')[0]
}

module.exports = {parseEventStreamMessages, extractMessageContent, extractUsefulTextFromChunk, getRandomUserAgent, listenForKeyOnce, parseOptions, getGptModelFromChunk}