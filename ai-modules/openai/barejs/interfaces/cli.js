const {updateState, conversationAPI, updateStateWorkers, fileUploadTask} = require('../apis')
const {store, chatMetadata} = require('../store')
const {extractUsefulTextFromChunk, listenForKeyOnce, parseOptions, getGptModelFromChunk} = require('../helpers')
const store_auth  = require('../store_auth')
const { initAuth, logout } = require('../oai-out-manage')



updateState()
setInterval(()=>{
  // console.log(store.chatReq?.expire_at - new Date().valueOf()/1000)
  if(store.chatReq && store.chatReq.expire_at && ((store.chatReq.expire_at - 5) < new Date().valueOf()/1000) && !store.isUpdatingTokens){
    updateState()
  }
},1000)

  async function waitForStoreTokensUpdating(store){
      if (store.isUpdatingTokens) {
        await new Promise((resolve) => {
          const interval = setInterval(() => {
            if (!store.isUpdatingTokens) {
              clearInterval(interval);
              resolve();
            }
          }, 100); // check every 100ms
        });
      }
  }


async function runRequest(prompt, cli=true){
        if(cli)
        process.stdout.write('...\n')
        // process.stdout.write('...')
        if(!store.proofToken)
        await updateState()
        
        await waitForStoreTokensUpdating(store)

        chatMetadata.gpt_model=undefined
        // console.log(store.conversation_id, store.parent_message_id)
        let ichunk = 0
        const ac = new AbortController();
        let escKeyPressed
        listenForKeyOnce(undefined, ()=>{escKeyPressed=true; ac.abort();})
        try{
        const { text, controller } = await conversationAPI(
        prompt,

        // mediaAbsPath,
        store.conversation_id,
        store.parent_message_id,
        access_token = store_auth.data.access_token,
        authcookie = store_auth.data.cookie,
        {
            stream: true,
            signal: ac.signal,
            // onChunk: (s) => console.debug('chunk:', extractUsefulTextFromChunk(s)),
            onChunk: (s) => {
                if(ichunk == 0 && cli){
                    updateState()
                    // process.stdout.write('\r   \r')
                    // Move cursor up one line and to the beginning
                    process.stdout.write('\x1b[1A'); 
                    process.stdout.write('\x1b[0G'); 

                    // Clear the entire line
                    process.stdout.write('\x1b[2K'); 
                }
                // console.log(s)
                let inferredModel = getGptModelFromChunk(s)
                chatMetadata.gpt_model = inferredModel || chatMetadata.gpt_model
                // console.log(inferredModel)

                process.stdout.write(extractUsefulTextFromChunk(s))
                ichunk++
            },
            // onEvent: (evt) => console.debug('event:', evt),
            onToken: (t) => { /* append t to your UI */ }
        }
        );
        }
        catch(e){
          if(e+''.includes('[AbortError]') && escKeyPressed){
            console.log('\n\n** Request stopped by user **');
            escKeyPressed=false
          }
          else{
            console.log(e)
          }
        }
        
        

        // console.log('aaa')
        
            // If you need to cancel mid-stream:
            // ac.abort(); // or controller.abort();
}


function coercePromptToText(prompt) {
  // Accept raw string OR JSON-stringified chat messages like:
  //   '[{role:"user",content:"hi"}, ...]'
  if (typeof prompt === 'string') {
    const trimmed = prompt.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const msgs = JSON.parse(trimmed);
        const last = Array.isArray(msgs) && msgs.length ? msgs[msgs.length - 1] : null;
        if (last && typeof last.content === 'string') return last.content;
      } catch {
        // fall through to raw string if JSON parse fails
      }
    }
    return prompt;
  }
  return String(prompt ?? '');
}





function resetConversation(){
    store.conversation_id = undefined
    store.parent_message_id = undefined
}

function chatPrompt() {
        const rl = require("node:readline").createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true,
        });

        const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

        (async () => {

            if(parseOptions().ask){
              console.log('Assistant:')
              await runRequest(process.argv.slice(-1)[0])
              process.exit()
            }

            console.log('')
            console.log('==========================')
            console.log('[SkaiFall]');
            console.log('OpenAI ChatGPT Free LLM');
            console.log('==========================')
            console.log('Chat ready. Type your prompt. \nType "/exit" to quit or /reset to start a new conversation')
            
            while (true) {
            console.log('\nYou:')
            const userInput = await ask("> ");

            if (userInput.trim().toLowerCase() === "/exit") {console.log('Bye'); process.exit(); break};
            if (userInput.trim().toLowerCase() === "/reset") {resetConversation(); console.log('\n** New conversation started **'); continue};
            if (userInput.trim().toLowerCase() === "/reg") {resetConversation(); console.log('\n** New reg **'); await initAuth({ mode: 'register' }); continue};
            if (userInput.trim().toLowerCase() === "/log") {resetConversation(); console.log('\n** logging **'); await initAuth({ refreshLogin: false }); continue};
            if (userInput.trim().toLowerCase() === "/relog") {resetConversation(); console.log('\n** relogging **'); await initAuth({ refreshLogin: true }); continue};
            if (userInput.trim().toLowerCase() === "/basic") {resetConversation(); console.log('\n** basic **'); logout({ deleteFile: false }); continue};
            // if (userInput.trim().toLowerCase() === "/ll") { fileUploadTask("C:\\Users\\Andrea11\\Downloads\\icon3-wb.png"); continue};
            if (!userInput.trim()) continue;

            try {
                console.log('\nAssistant:')
                await runRequest(userInput);
                process.stdout.write("\n");
                process.stdout.write(`[${chatMetadata.gpt_model||'-'}]\n`);
                
            } catch (err) {
                console.error("[error]", err || err?.message || err);
            }
            }

            rl.close();
        })();
}

module.exports = {chatPrompt, runRequest, coercePromptToText, waitForStoreTokensUpdating}