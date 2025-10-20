import {
    z as a,
    w as Y,
    d as $,
    u as Q,
    s as X,
    F as ee
} from "./useAppNameEnum-B_RCZZaG.js";
import {
    u as oe,
    r as u,
    j as e,
    d as g
} from "./index-DjeUAv9f.js";
import {
    M as L,
    c as te
} from "./index-npON1Cka.js";
import {
    A as ie
} from "./AuthStepLayout-DRZ_4X3y.js";
import {
    C as ne
} from "./ContinueButton-ClfUcDvA.js";
import {
    u as se,
    s as b,
    L as re
} from "./auth.module-DCdjcwGA.js";
import {
    N as T
} from "./NamedDivider-BZV0W2fV.js";
import {
    P as ae
} from "./PendingFormDisabler-ByemvU9-.js";
import {
    S as me
} from "./SocialLoginButton-x1fn0BlU.js";
import {
    S as le
} from "./StickyForm-DCY7ld8k.js";
import {
    D as ue,
    U as A
} from "./UsernameKindSwitch-RWiCm7Hu.js";
import {
    u as de
} from "./useUsernameKind-DUS4mBhw.js";
import {
    u as ce
} from "./loginOptions-CfVsRop8.js";
import {
    L as t
} from "./loginOption-DXGQrmx0.js";
import {
    U as pe
} from "./username-DImii0_h.js";
import {
    R as I
} from "./routeId-Bcr4Hy4z.js";
import {
    r as ge,
    g as he,
    a as fe
} from "./client-auth-session-dSv1Q7Dl.js";
import {
    g as be
} from "./commonMessages-vi5xfu-u.js";
import {
    u as _e,
    c as Ie,
    e as h,
    i as M
} from "./schema-validation-zHt9rOTF.js";
import {
    g as xe,
    a as Se
} from "./sentinel.client-DEt-Ymep.js";
import {
    u as D
} from "./use-event-loggers-BYzAYOjx.js";
import {
    w as Ne
} from "./utils-BGG_ggsw.js";
import {
    i as ye
} from "./isValidPhoneNumber-Da9hnblp.js";
import {
    p as R
} from "./parse-Cb61DG-V.js";
import {
    u as Oe,
    g as ve,
    a as U
} from "./helpers-DNc4uupA.js";
import "./Button-CCHVtoRV.js";
import "./noop-DX6rZLP_.js";
import "./FieldGrouping-BFjljUyA.js";
import "./isNumber-CpuftVQ5.js";
import "./_baseGetTag-DBIYhhxi.js";
import "./isObjectLike-nLWjQ9zq.js";
import "./Logo-CFlQEucm.js";
import "./openai-logo-Cr44hqyW.js";
import "./Select-BGtg-GpU.js";
import "./FormField-DK50dxQ6.js";
import "./index-g2bMlRvq.js";
import "./UnstyledButton.module-B7YD8bFL.js";
import "./useCollator-CCnp0APA.js";
import "./context-CWgrrSUa.js";
import "./OverlayArrow-lS84iosS.js";
import "./TextInput-BR8pOaYj.js";
import "./useTypedDynamicConfig-CGyPrPvB.js";
import "./email-DQ6k0T5e.js";
import "./useTypedSearchParams-BhKJnsRl.js";
import "./index-VWaDGczM.js";
import "./_MapCache-TO9IM_u8.js";
import "./isArray-Dxzbedgu.js";
import "./_overArg-BLH_OBOE.js";
import "./datadog.client-CkkgoxcC.js";
import "./preload-helper-BPn92lI4.js";
const we = Ie(h(["email"], o => o.code === a.ZodIssueCode.invalid_string, g({
        id: "logIn.invalidEmailFormat",
        defaultMessage: "Email is not valid.",
        description: "Error message shown when the email format is invalid on the create account page"
    })), h(["email"], M, g({
        id: "login.emailRequired",
        defaultMessage: "Email is required.",
        description: "Error message shown when the email field is empty on the create account page"
    })), h(["phoneNumber"], o => o.code === a.ZodIssueCode.custom && o.message === "Invalid phone number", g({
        id: "logIn.invalidPhoneFormat",
        defaultMessage: "Phone number is not valid.",
        description: "Error message shown when the phone number format is invalid on the create account page"
    })), h(["phoneNumber"], M, g({
        id: "logIn.phoneRequired",
        defaultMessage: "Phone number is required.",
        description: "Error message shown when the phone number field is empty on the create account page"
    }))),
    Pe = a.object({
        intent: t.extract([t.enum.email]),
        email: a.string().email()
    }),
    je = a.object({
        intent: t.extract([t.enum.phone_number]),
        phoneNumber: a.string().refine(o => ye(o), {
            message: "Invalid phone number"
        })
    }),
    Ce = a.object({
        intent: t.exclude([t.enum.email, t.enum.phone_number])
    }),
    k = a.discriminatedUnion("intent", [Pe, je, Ce]),
    G = {
        [t.enum.google]: "google-oauth2",
        [t.enum.microsoft]: "windowslive",
        [t.enum.apple]: "apple"
    };

function Ee(o) {
    switch (o.intent) {
        case t.enum.google:
        case t.enum.microsoft:
        case t.enum.apple:
            return {
                connection: G[o.intent]
            };
        case t.enum.email:
            return {
                username: {
                    kind: "email",
                    value: o.email
                }, screen_hint: "login_or_signup"
            };
        case t.enum.phone_number:
            return {
                username: {
                    kind: "phone_number",
                    value: o.phoneNumber
                }, screen_hint: "login_or_signup"
            }
    }
}
async function jo({
    request: o
}) {
    const i = await o.formData(),
        l = R(i, {
            schema: k
        });
    if (l.status !== "success") throw $("Unknown error", {
        status: 400
    });
    const m = await Ne(xe("authorize_continue"), 5e3);
    return ge(o, "https://auth.openai.com/api/accounts/authorize/continue", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...Se(m)
        },
        body: JSON.stringify(Ee(l.value))
    })
}
async function Co({
    request: o
}) {
    const i = he(fe(o));
    return {
        thirdPartyAssociation: i.third_party_login_association ?? null,
        countryCodeHint: i.country_code_hint
    }
}
const Eo = Y(function() {
        const {
            thirdPartyAssociation: i,
            countryCodeHint: l
        } = Q(), m = oe(), {
            phoneNumberOption: d,
            emailOption: q,
            optionsForDisplay: z
        } = ce({
            loginStrategy: "existing_user"
        }), x = z.length > 1, {
            isSocialAuthPrioritized: S,
            isInAnySimplifiedAuthScreen: K,
            socialButtonAlignment: V,
            isFlattenedLoginOptionsAtTop: B
        } = se(), [s, N] = de({
            allowPhone: d.enabled
        }), y = q.tempDisabled, O = d.tempDisabled, H = s === "email" && y || s === "phone_number" && O, Z = X.useLayer("auth_unify_login_signup_layer", {
            disableExposureLog: !0
        }).get("show_subtitle_on_auth_page", !0), f = s === pe.enum.phone_number, {
            logInvalidInput: v,
            logRedirectToAuth0: J
        } = D(), w = u.useId(), c = u.useId(), [P, r] = Oe({
            shouldValidate: "onSubmit",
            shouldRevalidate: "onInput",
            onSubmit: () => {
                J({
                    isInputPhoneNumber: f,
                    fromRoute: I.UNIFIED_LOG_IN_OR_SIGN_UP_INPUT
                })
            },
            onValidate: ({
                formData: n
            }) => R(n, {
                schema: k,
                formatError: we
            })
        }), j = _e(P), p = j(r.email), C = !!(p != null && p.length), [E, W] = u.useState(!1);
        u.useEffect(() => {
            C && W(!0)
        }, [C]), u.useEffect(() => {
            E && v({
                isInputPhoneNumber: f,
                fromRoute: I.UNIFIED_LOG_IN_OR_SIGN_UP_INPUT
            })
        }, [E, v, f]);
        const F = e.jsx(re, {
            loginStrategy: "existing_user",
            omitIf: n => s === n.name,
            loginOptionAlignment: V,
            google: ({
                tempDisabled: n
            }) => e.jsx(_, {
                provider: t.enum.google,
                socialsFormId: c,
                formFieldName: r.intent.name,
                tempDisabled: n
            }),
            microsoft: ({
                tempDisabled: n
            }) => e.jsx(_, {
                provider: t.enum.microsoft,
                socialsFormId: c,
                formFieldName: r.intent.name,
                tempDisabled: n
            }),
            apple: ({
                tempDisabled: n
            }) => e.jsx(_, {
                provider: t.enum.apple,
                socialsFormId: c,
                formFieldName: r.intent.name,
                tempDisabled: n
            }),
            email: () => e.jsx(A, {
                usernameKind: s,
                setUsernameKind: N
            }),
            phone_number: () => e.jsx(A, {
                usernameKind: s,
                setUsernameKind: N
            })
        });
        return e.jsxs(e.Fragment, {
            children: [e.jsx(ie, {
                titleId: w,
                title: m.formatMessage({
                    id: "loginOrCreateAccount.title",
                    defaultMessage: "Log in or sign up",
                    description: "Title for the unified login or sign up to user get started. Note that we will help take user to the next login or signup page based on user's input."
                }),
                subTitle: i ? be(m, i) : Z ? m.formatMessage({
                    id: "loginOrCreateAccount.subTitle2",
                    defaultMessage: "You’ll get smarter responses and can upload files, images, and more.",
                    description: "Subtitle for the unified log in or sign up page, to inform user to login or sign up so that they can get better usage of ChatGPT."
                }) : void 0,
                children: e.jsx(ae, {
                    children: e.jsx(le, {
                        method: "POST",
                        ...ve(P),
                        "aria-labelledby": w,
                        autoComplete: "on",
                        topCtas: S && x ? e.jsxs(e.Fragment, {
                            children: [e.jsx("div", {
                                className: b.topCtas,
                                children: F
                            }), B && e.jsx("div", {
                                className: b.fadedText,
                                children: e.jsx(T, {
                                    children: e.jsx(L, {
                                        id: "logIn.orDivider",
                                        defaultMessage: "OR",
                                        description: "Divider text between sign in with email and other identity providers like Google or Microsoft"
                                    })
                                })
                            })]
                        }) : null,
                        fields: e.jsx(ue, {
                            usernameKind: s,
                            emailProps: {
                                ...U(r.email, {
                                    type: "email"
                                }),
                                errors: p,
                                disabled: y
                            },
                            phoneProps: {
                                ...U(r.phoneNumber, {
                                    type: "tel"
                                }),
                                defaultCountry: l,
                                errors: j(r.phoneNumber),
                                disabled: O
                            }
                        }),
                        ctas: e.jsxs(e.Fragment, {
                            children: [e.jsx(ne, {
                                name: r.intent.name,
                                value: s,
                                disabled: H
                            }), !S && x && e.jsxs(e.Fragment, {
                                children: [e.jsx("div", {
                                    className: te({
                                        [b.fadedText]: K
                                    }),
                                    children: e.jsx(T, {
                                        children: e.jsx(L, {
                                            id: "logIn.orDivider",
                                            defaultMessage: "OR",
                                            description: "Divider text between sign in with email and other identity providers like Google or Microsoft"
                                        })
                                    })
                                }), F]
                            })]
                        })
                    })
                })
            }), e.jsx(ee, {
                id: c,
                method: "POST",
                hidden: !0
            })]
        })
    }),
    _ = ({
        provider: o,
        socialsFormId: i,
        formFieldName: l,
        tempDisabled: m
    }) => {
        const {
            logSocialSso: d
        } = D();
        return e.jsx(me, {
            variant: "outline",
            form: i,
            name: l,
            value: o,
            provider: o,
            tempDisabled: m,
            onClick: () => {
                d({
                    connection: G[o],
                    fromRoute: I.UNIFIED_LOG_IN_OR_SIGN_UP_INPUT
                })
            }
        })
    };
export {
    jo as clientAction, Co as clientLoader, Eo as
    default
};
//# sourceMappingURL=route-CpzS3QEh.js.map