let navigator = {userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', webdriver: true}
let window = {
    top: {hasOwnProperty: function (prop) {let props = ['__DDG_BE_VERSION__','__DDG_FE_CHAT_HASH__']; return props.includes(prop)}},
    document: {querySelector: function(q){
        if(q=='#jsa'){
            //iframe
            return {
                getAttribute: function(a){
                    if(a=='sandbox'){
                        return 'allow-scripts allow-same-origin'
                    }
                },
                contentDocument: {
                        querySelector: function(q){
                            if(q=='meta[http-equiv="Content-Security-Policy"]'){
                                return {
                                    getAttribute: function(a){
                                        if(a=='content')
                                        return "default-src 'none'; script-src 'unsafe-inline';"
                                    }
                                }
                            }
                        }
                },
                contentWindow:{
                    visualViewport: {
                        scale: 1
                    }
                }
            }
        }
    },
    createElement: function(tag){
        return {
            srcdoc: ''
        }
    },
    body: {
        appendChild: function(el){
            
        },
        removeChild: function(el){

        }
    }
}
}
let document = window.document
window.top.document = document

setTimeout(()=>{
eval(`(async function(){const _0x3d7b58=_0x2e98;function _0x5906(){const _0x46d016=['removeChild','JSON','from','cbcb9457d4687a1689739680f24259c2a2e4b7718fb80c74d167e87325903fc7h8jbt','querySelectorAll','69vcQWPO','filter','map','iframe','h8jbt','createElement','join','266972znkZJB','stringify','Promise','i3jp0','Symbol','280765KwaNdq','some','keys','Proxy','6662368MuvdUi','849116zgSFbJ','userAgent','body','toString','srcdoc','A6oejs8B8Af5s8QNiMOjGaCl/xt1m2HjebemfmiHQRM=','length','790947xkZhQs','self','fromCharCode','1756861669523','102GkiRpD','div','+ycpiH1k+aQ0L1WDknoPOJArBBk2ZPt49sjkwlgQhtw=','Array','40GRRQJy','Object','top','1614718pXRhaf','push','charCodeAt','endsWith','reduce','get','5944162DFCzyH','webdriver','innerHTML','contentWindow','all'];_0x5906=function(){return _0x46d016;};return _0x5906();}function _0x2e98(_0xb53583,_0x3aa7fb){const _0x59067e=_0x5906();return _0x2e98=function(_0x2e98ee,_0x510399){_0x2e98ee=_0x2e98ee-0x12b;let _0x5260d9=_0x59067e[_0x2e98ee];return _0x5260d9;},_0x2e98(_0xb53583,_0x3aa7fb);}(function(_0x166606,_0xf6f6a5){const _0x57c992=_0x2e98,_0xad22dc=_0x166606();while(!![]){try{const _0x13bc4a=-parseInt(_0x57c992(0x137))/0x1+-parseInt(_0x57c992(0x158))/0x2+parseInt(_0x57c992(0x147))/0x3*(parseInt(_0x57c992(0x14e))/0x4)+-parseInt(_0x57c992(0x153))/0x5*(-parseInt(_0x57c992(0x130))/0x6)+parseInt(_0x57c992(0x13d))/0x7+-parseInt(_0x57c992(0x157))/0x8+-parseInt(_0x57c992(0x12c))/0x9*(-parseInt(_0x57c992(0x134))/0xa);if(_0x13bc4a===_0xf6f6a5)break;else _0xad22dc['push'](_0xad22dc['shift']());}catch(_0x2023b1){_0xad22dc['push'](_0xad22dc['shift']());}}}(_0x5906,0xc7c8c));const _0x11e2d9=[['ua',![]],[_0x3d7b58(0x14b),![]],[_0x3d7b58(0x151),![]]],_0x316b60=await Promise[_0x3d7b58(0x141)]([navigator[_0x3d7b58(0x159)],(function(){const _0x36d6ef=_0x3d7b58,_0x13d212=document['createElement'](_0x36d6ef(0x131));return _0x13d212[_0x36d6ef(0x13f)]='<p><div></p><p></div',String(0x7b0+_0x13d212[_0x36d6ef(0x13f)][_0x36d6ef(0x12b)]*_0x13d212[_0x36d6ef(0x146)]('*')[_0x36d6ef(0x12b)]);}()),(function(){const _0x192e8d=_0x3d7b58;return String([navigator[_0x192e8d(0x13e)]===!![],(function(){const _0x10ff6c=_0x192e8d,_0x2634c8=document[_0x10ff6c(0x14c)](_0x10ff6c(0x14a));_0x2634c8[_0x10ff6c(0x15c)]='DuckDuckGo\x20Fraud\x20&\x20Abuse',document[_0x10ff6c(0x15a)]['appendChild'](_0x2634c8);let _0x1124a0;return _0x2634c8[_0x10ff6c(0x140)]&&_0x2634c8['contentWindow'][_0x10ff6c(0x12d)]&&_0x2634c8[_0x10ff6c(0x140)][_0x10ff6c(0x12d)][_0x10ff6c(0x13c)]?_0x1124a0=_0x2634c8[_0x10ff6c(0x140)][_0x10ff6c(0x12d)][_0x10ff6c(0x13c)][_0x10ff6c(0x15b)]():_0x1124a0=undefined,document['body'][_0x10ff6c(0x142)](_0x2634c8),!!_0x1124a0;}()),(function(){const _0x53c34e=_0x192e8d,_0x3a7299=[_0x53c34e(0x133),_0x53c34e(0x135),_0x53c34e(0x150),_0x53c34e(0x156),_0x53c34e(0x152),_0x53c34e(0x143),'Window'],_0x4752ef=Object[_0x53c34e(0x155)](window[_0x53c34e(0x136)])[_0x53c34e(0x148)](_0x459846=>_0x3a7299[_0x53c34e(0x154)](_0x13bbb0=>_0x459846!==_0x13bbb0&&_0x459846[_0x53c34e(0x13a)]('_'+_0x13bbb0)&&window[_0x53c34e(0x136)][_0x459846]===window[_0x53c34e(0x136)][_0x13bbb0]));return _0x4752ef[_0x53c34e(0x12b)]>0x0;}())][_0x192e8d(0x149)](Number)[_0x192e8d(0x13b)]((_0x5bfde9,_0x21dac4)=>_0x5bfde9+_0x21dac4,0xea5));}())]),_0x2fb94b=[],_0x5119ed={},_0xf88263='b04febb97bba532a';for(let _0x5063d6=0x0;_0x5063d6<_0x316b60[_0x3d7b58(0x12b)];_0x5063d6++){const _0xe51db=_0x316b60[_0x5063d6];Array['isArray'](_0xe51db)?(_0x2fb94b[_0x3d7b58(0x138)](_0xe51db[0x0]),_0xe51db['length']>0x1&&_0x11e2d9[_0x5063d6][0x1]&&(_0x5119ed[_0x11e2d9[_0x5063d6][0x0]]=_0xe51db[0x1])):_0x2fb94b[_0x3d7b58(0x138)](_0xe51db);}const _0x53b75b=Array[_0x3d7b58(0x144)](JSON[_0x3d7b58(0x14f)](_0x5119ed))[_0x3d7b58(0x149)]((_0x28e28b,_0x28f4de)=>String[_0x3d7b58(0x12e)](_0x28e28b[_0x3d7b58(0x139)](0x0)^_0xf88263[_0x3d7b58(0x139)](_0x28f4de%_0xf88263[_0x3d7b58(0x12b)])))[_0x3d7b58(0x14d)]('');return{'server_hashes':[_0x3d7b58(0x132),_0x3d7b58(0x15d),'gXX+Sc34CVcQZ3KTsKamYvBTrKeCbrR9nBKHJOWoEes='],'client_hashes':_0x2fb94b,'signals':{},'meta':{'v':'4','challenge_id':_0x3d7b58(0x145),'timestamp':_0x3d7b58(0x12f),'debug':_0x53b75b}};})().then(d=>console.log(d))`)
    },100)
