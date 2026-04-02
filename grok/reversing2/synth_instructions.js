// implementazione inline di quello che prima era il modulo 880932
const tH = (() => {
    "use strict";

    // ==== INIZIO: copia qui TUTTA la parte comune del modulo 880932 ====
    // 1. function _() { ... }
    function _() {
        let x = ["ySo4WQm", "WPddMmoPqWm", /* ... TUTTO IL RESTO ... */, "lSk9CmoPWPO"];
        return (_ = function () {
            return x;
        })();
    }

    // 2. function e(x, c) { ... }
    function e(x, c) {
        let d = _();
        return (e = function (_, c) {
            let a = d[_ -= 206];
            if (void 0 === e.fVDkTy) {
                var f = function (x) {
                    let _ = "", e = "";
                    for (let e = 0, c, d, a = 0; d = x.charAt(a++); ~d && (c = e % 4 ? 64 * c + d : d,
                        e++ % 4) && (_ += String.fromCharCode(255 & c >> (-2 * e & 6))))
                        d = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=".indexOf(d);
                    for (let x = 0, c = _.length; x < c; x++)
                        e += "%" + ("00" + _.charCodeAt(x).toString(16)).slice(-2);
                    return decodeURIComponent(e);
                };
                e.FTFMJp = function (x, _) {
                    let e, c = [], d = 0, a, b = "";
                    for (e = 0,
                        x = f(x); e < 256; e++)
                        c[e] = e;
                    for (e = 0; e < 256; e++)
                        d = (d + c[e] + _.charCodeAt(e % _.length)) % 256,
                            a = c[e],
                            c[e] = c[d],
                            c[d] = a;
                    e = 0,
                        d = 0;
                    for (let _ = 0; _ < x.length; _++)
                        d = (d + c[e = (e + 1) % 256]) % 256,
                            a = c[e],
                            c[e] = c[d],
                            c[d] = a,
                            b += String.fromCharCode(x.charCodeAt(_) ^ c[(c[e] + c[d]) % 256]);
                    return b;
                },
                    x = arguments,
                    e.fVDkTy = !0;
            }
            let b = _ + d[0], W = x[b];
            return W ? a = W : (void 0 === e.rCqVBk && (e.rCqVBk = !0),
                a = e.FTFMJp(a, c),
                x[b] = a),
                a;
        })(x, c);
    }

    // 3. l’IIFE anti-debug che ruota l’array, va tenuta invariata:
    !function (x, _) {
        let c = x();
        for (; ;) try {
            var d, a;
            if (-parseInt(e(272, "cde2")) / 1 * (-parseInt((d = -561,
                e(d - -954, "dTY$"))) / 2) + parseInt(e(460, "ATU7")) / 3 + -parseInt(e(244, "O6@z")) / 4 + parseInt(e(268, "IG#j")) / 5 * (-parseInt(e(317, "gRnZ")) / 6) + parseInt((a = -503,
                e(a - -802, "dTY$"))) / 7 * (parseInt(e(209, "XSU]")) / 8) + parseInt(e(479, "L0]U")) / 9 + -parseInt(e(318, "Y9o]")) / 10 === 902421)
                break;
            c.push(c.shift());
        } catch (x) {
            c.push(c.shift());
        }
    }(_, 0);

    // ⚠️ QUI NEL MODULO ORIGINALE C’ERA:
    // x.s(["default", () => c]),
    // --> NON ci serve più, quindi NON lo copiamo.

    // 4. Ora copia *integralmente* la dichiarazione di `let c = () => { ... }`
    // così com’è nel modulo 880932:

    let c = () => {
        // tutto il tuo codice:
        // var x, _, c, d, a, f, b, W, n, r, t, u, o, i, k, S, m, O, Q, R, v, C, l, P, T, G, h, L, K, q, I, y, g, s, p, z, B, j, N, A, w, Z;
        // let F, V = { ... }, H = { ... }, J = { ... }, ...
        // ...
        // ...
        // alla fine della funzione c DEVE restare:

        return async (x, _) => {
            // corpo finale dell’async (x, _) => { ... } di 880932
            // (copialo pari pari)
        };
    };

    // ==== FINE: copia del contenuto di 880932 ====

    // Inizializziamo UNA SOLA VOLTA l’implementazione reale (quella async (x, _) => { ... })
    const impl = c();

    // e restituiamo una funzione async compatibile con la vecchia tH
    return async function tH(n, r) {
        // qui nessun 483347, nessun import dinamico:
        return impl(n, r);
    };
})();
