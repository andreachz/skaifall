const {updateState, conversationAPI, updateStateWorkers, fileUploadTask} = require('../apis')
const {store} = require('../store')
const {extractUsefulTextFromChunk, listenForKeyOnce} = require('../helpers')
const {coercePromptToText, waitForStoreTokensUpdating} = require('./cli')


// setInterval(()=>{
//   console.log(store.isUpdatingTokens)
// },1000)

async function runRequestServer(prompt, _model, stream = false, options = {}) {
  

  // // console.log(options, store)

  // // let mediaAbsPath = getPathsFromPrompt(prompt)

  let worker_store = options.worker_store

  let this_store
  if(worker_store){
    this_store=worker_store
  }
  {
    this_store=store
  }




  if(!worker_store){
    if(!this_store.proofToken)
    await updateState();
  }


  await waitForStoreTokensUpdating(this_store)

  setTimeout(()=>{updateState()},500)

  // let this_store = await updateStateIsolated()


  const { onChunk, signal, one_shot } = options || {};
  
  // console.log(options, one_shot)
  // else updateStateWorkers(worker_store)

  const textPrompt = coercePromptToText(prompt);
  let finalText = '';

  // Build the arg object for conversationAPI
  const apiOpts = {
    stream,
    signal,
    onChunk: stream
      ? (s) => {
          const chunk = extractUsefulTextFromChunk(s) ?? '';
          if (chunk) {
            finalText += chunk;
            if (typeof onChunk === 'function') onChunk(chunk);
          }
        }
      : undefined,
    // Keep these hooks available if your backend uses them;
    // they’re no-ops by default and won’t affect behavior.
    onToken: () => {},
    onEvent: () => {},
  };

  // conversationAPI returns { text, controller } when stream=true in your previous code.
  // We only need to return the final text (to match other generate fns).
  if (stream) {
    const { text } = await conversationAPI(
      textPrompt,
      // mediaAbsPath,
      worker_store||one_shot?undefined:this_store.conversation_id,
      worker_store||one_shot?undefined:this_store.parent_message_id,
      access_token = undefined,
      cookie = undefined,
      apiOpts
    );
    // Prefer the streamed aggregation; fallback to API's text if present
    return finalText || text || '';
  } else {
    const { text } = await conversationAPI(
      textPrompt,
      // mediaAbsPath,
      worker_store||one_shot?undefined:this_store.conversation_id,
      worker_store||one_shot?undefined:this_store.parent_message_id,
      access_token = undefined,
      cookie = undefined,
      apiOpts
    );
    // Non-stream path: no chunks; just return full text
    return text || '';
  }
}

function clearChat(){
    store.conversation_id = undefined
    store.parent_message_id = undefined
}


module.exports = {runRequestServer, clearChat}