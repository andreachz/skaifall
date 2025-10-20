const { generate: dd_generate } = require("../ai-modules/duckduckgo/llms");
const { generate: openai_generate } = require("../ai-modules/openai/pup/chatgpt");
const { runRequestServer: openai_barejs_generate } = require("../ai-modules/openai/barejs/interfaces/server-interfaces");
const { runRequestServerQueue: openai_barejs_generate_workers } = require("../ai-modules/openai/barejs/workers");

const { providers } = require("./constants");
const { openaiRequestModeServer } = require("../ai-modules/openai/barejs/interfaces/server-interfaces");

function selectorByProvider(provider, opts={use_workers: false}){

    if(provider == providers.duckduckgo){
        const generate_ = (prompt, model, stream, options={})=>{
            return dd_generate(prompt, model, {
            maxChatAttempts: 5,
            maxHashAttempts: 5,
            stream: stream,
            onChunk: options.onChunk,
            streamSignal: options.signal,
            });
        }
        return generate_
    }
    if(provider == providers.openai){
        // const PUPPETEER = false
        // if(PUPPETEER){
        // const generate_ = (prompt, model, stream, options={})=>{
        //     return openai_generate(JSON.parse(prompt).pop().content, undefined, stream, options)
        // }
        // return generate_
        // }
        

        if(opts?.use_workers){
        const generate_ = (prompt, model, stream, options={})=>{
            return openai_barejs_generate_workers(JSON.parse(prompt).pop().content, undefined, stream, options)
        }
        return generate_
        }
        
        const generate_ = (prompt, model, stream, options={})=>{
            return openai_barejs_generate(JSON.parse(prompt).pop().content, undefined, stream, options)
        }
        
        return generate_
    }

}


module.exports={selectorByProvider}