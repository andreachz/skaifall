// GETTING COOKIES
fetch("https://auth.openai.com/log-in-or-create-account", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "it-IT,it;q=0.9",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "priority": "u=0, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1"
  },
  "referrer": "https://chatgpt.com/",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
});

// REGISTER
fetch("https://auth.openai.com/api/accounts/user/register", {
  "headers": {
    "accept": "application/json",
    "accept-language": "it-IT,it;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "openai-sentinel-token": "{\"p\":\"gAAAAABWzMwMDAsIlNhdCBTZXAgMTMgMjAyNSAwMTowOTozMyBHTVQrMDIwMCAoT3JhIGxlZ2FsZSBkZWxs4oCZRXVyb3BhIGNlbnRyYWxlKSIsNDI5NDcwNTE1MiwxLCJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTQwLjAuMC4wIFNhZmFyaS81MzcuMzYiLCJodHRwczovL3NlbnRpbmVsLm9wZW5haS5jb20vc2VudGluZWwvOTc3OTBmMzcvc2RrLmpzIixudWxsLCJpdC1JVCIsIml0LUlUIiwxNCwidXNlckFjdGl2YXRpb27iiJJbb2JqZWN0IFVzZXJBY3RpdmF0aW9uXSIsIl9yZWFjdExpc3RlbmluZzdicGRnY3h3Y2EzIiwib25hcHBpbnN0YWxsZWQiLDM1NTQ2LjMwMDAwMDAwNDQ3LCJmMWQzZWFiOC05YTc0LTQzYzAtYjYyMS1kZDJlMWIzMmYyMGYiLCIiLDEyLDE3NTc3MTg1Mzc4NjMuMl0=~S\",\"t\":\"QhMfAB0OBgwIEXpjFmURFRMaHAsLExQQfUNgW3x3YAwMHhEBBAAFBhsLDGdmb1B/WXJ9eUl0Z2taH2hyfwBqanUAYXlKAlhpRX9XbHRaZ2cJa3l0dXt/e2RLdGkfXVdoAEZxa2xnTWECbAwMHhEAAgAHBRsLDHZiBAwMHhEJHxwEEQMTb3NyeHBvc3J4cG9zcnhwb3NyeHBvc3J4EwIQAA4fHwURAwEACwsBBB4ECgoIFgIDDQMZBx8bBRccBQwTFBB0C2d2Y19jCX8DS11gf39hW2dgVmUIBE93WH9Se3dcamAeRlZhXUpwZ29ZYmNhd2Z4RQZxaXgDZmp3WlZrf2RhdVh/Unt3Q1tpeAZhemdoVGZ/Y29gXX9mdl5De2MeRmJhWXtTZ38IZWQCb2B2AkduY0JWZWoAfFNlCGNlYAIIVXh3W1tpeEplbgBWamt/VWZqdWNVfHdxbmdCC2pod0pqdE4MExAfGwkaHAABExQQalF/XmplQVR2Z0BqVEJWYHhzb1R0C2tmanJ4fWtFenJ5WV5AGx0MAwoXCBYQCRtiRWRja1psY2Vec3xnX0lrfQNqXWlrVmNhWnRrYWxVSmpmVldmRWp/cm9jaXtGd3B7bwBpZ1gIcnwDZl1neHBXa1xWZ2tSQUxkZXtkfV8CcWRoSn9xd3RiZnx7ZmdYCGh/ZEt4d3t4UmwBSnlkfFpNZ3VRYnxeV2F3H2BqbAAXf2Z/QUxqdV1yb3N2f3JZWWR4Vmd8cHtoS3NyUnN9XmJ+cm9zUntgXXhyUlZpc1tse3p0UH9yf2NVe114U2V8QXZkYlVgb1l1cWZrZFduAH9qYlJFbGN1e1R/dQJYaXwKUntWTX9wa15sc0RSVXZnaWple3h7b2MfU2Z8AE9kXwlXfQJhamd7YGNrXV5lawgBTXNyUnJpY3ZxdVlRUnpZF3lhbAhpY3V7Zm90dWpmQl5/b1kfUWEJCEtgX1F3fAMCXWJGClJ7cF18clFeYnBiCVV2Z2lqZXt4e29jH3lhbAh/agJBRHwDal11f2dSe0ZdfHJRBW16A0l3egJpeGRoa3JsZ2RTZGxFeXplQXl6AwZ+Zmtke2FnH3l7QQltc2J4eGZzQH9yf1EOGx0MBwUXBB0QCRtmenRZd2QfRmZTf39kd3gIDB4RDggABAsbCwxjW3dma3NYc3l/Sn98YGN1e2h4SnZEbFRsc3Z0eX9KdW5dH3RhUXBkcUR4cG9zQHBwVkFWfGdoZ2EIZ0xmYXRkb0Vqb3QfQldoSV1+dGh0anREWlBvVWZ1c297YmhnbGVhUmh8c0R0V2ZzdntwbEV7cUlaZmJsa2ZkX058bXNid3Nvc3Z7RkV6e3hSSHUCCH14d1BbclYHYxtM\",\"c\":\"gAAAAABoxKgTJf89gw5uMJJOsezBN1WuqEwAqximnQiQYKNkk0AWVqOId5COnaVWX1Rp6ImUr2EiI7tDFvLvI0D23Pd1krDqPV1iNFzxt3teWCSci_Zl-gzEeaKz6uhNtOqXb9Deod-2YZ2CxSJ-OLYr3Z0Nmm5mgSSSL9EEtQoxkJGbeC3qBo3aQMYi5phiPUS-6ldE3unJUjslnAttfjZGpYTfCOBildKe1zPMxkGkTlOVcuRK_kG3btfPcjOGfR036buY62Y8mSiCjPjY2f6zyHoj09oUlIG2ltD0kWgDLnslroEWgRbn68p-v6DN32sgFFx1CjbkLUN5vHeZ9LxJ7ZEf_N82JaeXxkj4DLit-Y1LUh_QywX4qFwkSPH7iD59OWCenyWCI3TkSTPDvVZ6n0TVHANnkmGY2B6Ues0pv4bdfWBIID_bgDKaz_l1BiMJqHjX10s1C_qxOQHS9QNhnvpw9xP99YHSBqOrn_O_Szr1ljsRhp1bk0P2x76pm1kv1V3llqOwgDjhHlYbHYVwR7ZKqaJfhlVsKyBzxNRDF99x20JGf_TZlo2vUw1Mn9ar7dsq0-r7HrC1Ur9xWhzHxBJT8KUOnxoz1JXInt0XOghKHnBsq98qcwvpgDBa8WJGkPfo7sEuT58LqaHd3sfVJ59xpakRXaqQW8NtNlxM6EUjdVuWCPV35Q4nnfD46WqZQu9tGPc3_zwgVlyvdZwnG4UtkL4_WLYoFzZ2hBZFRbTdu-hAIigtUFLkc_LjDgp-q5mS7eMeMj-REf528qdOAm-hn6d1V8uOhwu1oBdYc8GFlkoD_gP-SoEJ3MJ3hRfUJB-Ma5_C5mDhCuefCY-WDp9bbduVl_5coF52iiw71XPAOIGDFXrkaHvDrYFxx3vl-rNz0-pJRTsZT7LsCaQi1bBJZDVoCD1uGuHXUJZ8V5H0rf2nLjG-YoehOygmRlOwtXb0PKKwXTKAi6tser0T8AyA7XRod2cM_6JDEV2Snzd7BtEdI20oAwHsfHiEAbelX5w1D8Yk01z1zw0JBgYfQXcV-S8yzheaxJYB3yr-hj98UL2AfoUc3DIzeuihig9BR_k6i6QwhId_9Iz7u_N2yXyaYCYy9o5twFYcFqEPnvXegdxUF6guy5y-MSHBJDsC9eFm_rq1FZqFs9Ux-W98zJab4qBTEG0jYSCV4uVwoijdhJ7n058lRAybK41YkGYb_yq0959lg359FFU5ElrFKF6w2ex1s_zq2sOXU8UV-7J_2cb9Di-qtXyVKl_W_CV-dC4f3dMbdnba0GDpOvd7zOvmf6cwG9GdDu3pE8k6tOrv-TwHWcc=\",\"id\":\"6b54ff9e-f195-4f19-873b-cdcdc1aae965\",\"flow\":\"username_password_create\"}",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "traceparent": "00-000000000000000025b633f80bdb6691-1538df8c49ff1ace-01",
    "tracestate": "dd=s:1;o:rum",
    "x-datadog-origin": "rum",
    "x-datadog-parent-id": "1529217867122154190",
    "x-datadog-sampling-priority": "1",
    "x-datadog-trace-id": "2717416565608507025"
  },
  "referrer": "https://auth.openai.com/create-account/password",
  "body": "{\"password\":\"bageh92692@fanwn.com\",\"username\":\"bageh92692@fanwn.com\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});


fetch("https://auth.openai.com/api/accounts/email-otp/validate", {
  "headers": {
    "accept": "application/json",
    "accept-language": "it-IT,it;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "traceparent": "00-0000000000000000d929315f137ac178-7b2146c77b17f047-01",
    "tracestate": "dd=s:1;o:rum",
    "x-datadog-origin": "rum",
    "x-datadog-parent-id": "8872450563474190407",
    "x-datadog-sampling-priority": "1",
    "x-datadog-trace-id": "15648092664693965176"
  },
  "referrer": "https://auth.openai.com/email-verification",
  "body": "{\"code\":\"533899\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});


fetch("https://auth.openai.com/api/accounts/create_account", {
  "headers": {
    "accept": "application/json",
    "accept-language": "it-IT,it;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "openai-sentinel-token": "{\"p\":\"gAAAAABWzMwMDAsIlNhdCBTZXAgMTMgMjAyNSAwMToxMjoxOSBHTVQrMDIwMCAoT3JhIGxlZ2FsZSBkZWxs4oCZRXVyb3BhIGNlbnRyYWxlKSIsNDI5NDcwNTE1MiwxLCJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTQwLjAuMC4wIFNhZmFyaS81MzcuMzYiLCJodHRwczovL3NlbnRpbmVsLm9wZW5haS5jb20vc2VudGluZWwvOTc3OTBmMzcvc2RrLmpzIixudWxsLCJpdC1JVCIsIml0LUlUIiw2LCJoaWTiiJJbb2JqZWN0IEhJRF0iLCJsb2NhdGlvbiIsIm5hdmlnYXRvciIsMTIwMTY0LjM5OTk5OTk5ODUxLCI5MDEzNWQ4ZS0yNDE4LTQ3MTktOTEyZC1kNmRlYjM1OWFjMTgiLCIiLDEyLDE3NTc3MTg2MTk2NzEuNF0=~S\",\"t\":\"ThsfDhsJGhsPG2xrVlsMFRcOAA4EGxQbYVFabnJOFnN0UVp0ckF/aXdoa3hxTmtzcnhdeHNoVnZtfx9YYGtNfX1OFlt2UUV0cmtafm1/VlxnUh5hdEEWdXJrWlhjUntbc3gWf3Rob2l0aEVgdk5vb3F8WlptUnR3c05jX3FBXXJyaFljcglWbmRsH3tje019cnhdf3NBSXd3aBZacXtFW2RVVm1haFl9d2x/BBcVDAwBFxsAFwMMdnFeW3ZxYBMbGRsbDhsBGRsPG294dHhveHR4b3h0eG94dHhveHR4b3h0eAwVFwEcFwQADAMFFxwBBAsdAQYAHgAEDx8NDQsCGwwPAAgEGxQbdE4TBBcVDA0BFxsPFwMMdGFsW3RxbBMbGRsdDhsBGBsPG2gLBGF9b3cBdnxBWH1BZGNKVV14eAhFd2pSQWh5fFpjfGxBe31vd3V5VXdofV4AbntBWVt4CHNafX93W3Z8WmNmbEF1eX9zaH9/AW9mUgRvdn9NeHphUW5/bAR+em9NYHxrAXF6f0FdfQgMWngJQV1/f1Fydn97aH9/TWt6fHdde38McXgId115CFFrdnxdaHkITXJ6f0FdfQgMWngJQV1oTggEDBUXARoXBAAMAxdhewhUantgcXh8Y2BtaElnfh9jUGFoTWxrVl1ib0V0Ym9oTXdta3xgbx9jdBsCGwANAAoCGxQbZ1IfaWFsdGhma0puYnwfa2B/HnhtfGBgZFJWbGFsSm5iCUF4dnhraX1OWXpxe117cmxeWGJ8aHJnCBpbY2wXcmRudH1jVWhoZn9saG1haHdtf3x1cwhsaWEIeHhif15oYlVKXXNsdHdhCR9+YHxFYWNVRndgb2xddH9WfWJ8ZHRjfB9xY1VacnR4QX12QXd7d2hJWHR4Hm99aEV/bWxJdHd4SVhxXh5zfW8We3Z4Z3tjCFlgdmhvcHJVF25tfF5aYE5CaXNsdHdhCR9+YHxFYWdVVl1mVVZuZH50Wm1ob3d0aB5bdGhrcn1eRWNmVV5gZGxecW1RWlhhCF5dbXxBYWB8F2ljbGxgYlVsWGMIHmF3XkVdcV53d3J4Fnt0aGRyZG9GWGZVVlx0f15sYlJ0WmBrSnVhCHxvYghGe2B8aGFnUU1YcU4ed31oHnRxQUFvZ1IfaWFsdGhma0p+YWwXW2JvVkFgf2thcl4ee3F7d3d3XkVcc2x0d2EJH35gfEVhY1VGd2BvbF10f1Z9YnxkdGN8H3FjVVpydHhJf3ZBTXh3Tm9gdmhjBBcVDA0EFx4AFwMMW11NXm9ZSUtoWU54WnB7T35NSm1+B3N/aHRWZn5CcGx+ZFVUG0g=\",\"c\":\"gAAAAABoxKjBBeHkz8HWt6zjpNIKifZAk2wo6nntuNsIh9Bop6lucu_yXpzIPNeWXl3K-xS1VrCS5OQV7ScndlW_6R06wpp41wCx9L_LYg_8x0jp6huStZdjj44gvRYDXJL7XvkM66WicAVs7d1ApmReFC_eYNDpMkgsFbNIVK4bs31CgyZMCJh8PwrQe4pXMClIwkAvnnAuRVWQIsaPZ1DlUBHiuYh9uFk4vdd21KZEFXP5Ch8KYvONFuYx02GjVZ4NwFRnikhA0hP4i4bwiSni5I-v_By1Kc1l7dU9HV3I7BGWLO7aM5GvrRAdPgcos-a9Dy_eq5L0A4AKf7jGq6ig1mGE2q1gFo_7Mr4jNVAfr7CxbzTi2PqlhECBXEx37GzaTv5PgxQrJhsqLe-hH_weq2IGdQICmWqOuTa-hTtFhISgpLr5kTVCSEtj0CziwPQ998FzLxz-g73bbdjZ5LlW98L22WsXJr7GTbYJdrHRgjqTpYZE2a_2B9OumaFoKxUK8j1q08Bt4vkx3AB_QFSU2KO55TzRkR4nlEV6uVuKugUJ3pjgZ0rJRHQbDvAcbKOnArQV6YoIqKHfNwVH_5SYUUCeBCsHWbRmCToypBLtkNFUQQKBjIElHNeVa83utthx876sI7GydK_a6Eww95BcN-YFxRcZN3h-scvwiWOmrS7dsUExGN8GglSkpcygIvfdpH1Gz9pdbYojnGd9cv9Z58PzEkHsiw-yxn__S8rFQrT8Lknszn_2RCv6-XyB31uIJKNIHpcjjyDa9z-wCzEyaYxFq5sidkaPnJtApoxugupx8PouBrrA5VWjGnRX9mAV0YyJChcl6nhtjbSMEVtutTzg7KPVxGw2hv0aBGqrsTHDJiVEHwuRgSMz_yxKT0wFO3OGspScZLxDbuUDVsU9eIj9Q8RNmDzYPQTowcJkrKlSL4a9jCqnWaOn3-pjlLb3ls8zRkWwKaIdjanAJfkrnxDrkFmNiAN_zhTL450_ghxKhtUSHhLxAuOZDh5JAddv87uTPZVAcCREeO_y4Za-rXgp7M7NISm5Ur6JSqPswhRQiD1zYQxIqJkaxGDF4vpVsEhzRJxOZNOYwE7G3yI-dMI0WOOpEYTWoDMIJuMBtNvgA516RfTqguLVJ1bKWAaD5MJF_VzzjnsydDUewOst-eNjZHw-UTT7ENs8V7Z9igj2Xe36KNGmOlg0ukyDaKQi4S5xsCILH_jGUzR46RvlHu22W5XB7SFl2s34NqdfYAZtDmueC9SLSJFdkW80cJY0IOzfiHPESUSofBBHauoeP-5eLk7UQg==\",\"id\":\"6b54ff9e-f195-4f19-873b-cdcdc1aae965\",\"flow\":\"oauth_create_account\"}",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "traceparent": "00-0000000000000000ae879b96ea8181ab-6c0f64b41416a110-01",
    "tracestate": "dd=s:1;o:rum",
    "x-datadog-origin": "rum",
    "x-datadog-parent-id": "7786553005340795152",
    "x-datadog-sampling-priority": "1",
    "x-datadog-trace-id": "12576191556937154987"
  },
  "referrer": "https://auth.openai.com/about-you",
  "body": "{\"name\":\"asafa powell\",\"birthdate\":\"2017-01-31\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});


fetch("https://auth.openai.com/api/accounts/password/verify", {
  "headers": {
    "accept": "application/json",
    "accept-language": "it-IT,it;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "openai-sentinel-token": "{\"p\":\"gAAAAABWzMwMDAsIlNhdCBTZXAgMTMgMjAyNSAwMToyMjo1MyBHTVQrMDIwMCAoT3JhIGxlZ2FsZSBkZWxs4oCZRXVyb3BhIGNlbnRyYWxlKSIsNDI5NDcwNTE1Miw4NCwiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzE0MC4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiaHR0cHM6Ly9zZW50aW5lbC5vcGVuYWkuY29tL2JhY2tlbmQtYXBpL3NlbnRpbmVsL3Nkay5qcyIsbnVsbCwiaXQtSVQiLCJpdC1JVCIsMTMsImNvbm5lY3Rpb27iiJJbb2JqZWN0IE5ldHdvcmtJbmZvcm1hdGlvbl0iLCJfcmVhY3RMaXN0ZW5pbmdlbWh4eWNrNWtodiIsIm9ucGxheSIsMjY1MzMuMTAwMDAwMDAxNDksImE1NWFlMTM4LTZlYzctNGFhZS1hYWJiLWEyNDQzZDdkNTJiNiIsIiIsMTIsMTc1NzcxOTM0NjU3Ni4zXQ==~S\",\"t\":\"SRQWABsKAAwCF39MSU14dlETGhkQBBcWAgMUFBp0WlFMGhkQBBoWBQYUFBp2RVV3eWRoYmoIQWhjWUxkegddenRaRkpsc2BxfG1RVHEfDW1qY1ZJbQNaZW1jfFR7CEVcZ3hMV2FOdGlndFJtbGNgcXYIc2VkRgxzelFGamNze0h7ZHdwalABfmNZYX1zXVp6YAJ8Sm1je1V4bQxQbnhcZnNwH3xgA0ZMb2B0VHltd35xWX1wendrfndFe018QmtTfG5FaGd7flNhZHRvYANgaWBjd1V7CV1oYXtcbWVaaFltd2Nve0JrdW9qQnt3f1d2emR/dmB0e3d7dHNyb1NdUGNoYmFhd0ZtfVlgT29gdHR2CF5lZEJcc2pgaFltdVpmYHdBcW9QWnxyf2FzelFJYmRnfH5scGhUe2l3UGBoflBhB1laYwJ0fm5wcGJ/U1FqYR59bHVRGnZ3VWNPeWR/cWlUBH9ga2JzYAcWWmBkUmBtc3BhaX1BfWBoDXFmBlZbbWReSn5SRX1vUGx/dG91cHVkf3tgZHxgYFlgY2x6UVB3QmptYUFrfH1ZYE9vYHR0dgheZWBCdmNgWh9qfXR4d29jXn54CUVgYUJAc3N3RXl3c2dLfEJ3d2x6bGdkRWJtZV1aW2NgXmBvY2hXewhaZWNram1jXR9tZ14PbG5ea1VsQFp9dG9bd3VBHnZ9VW9NeXNwZHtQRnt3WUtlYQceeXZFe21rBXRif1QEYGNGQGNmB1pcYwN/b2BgfGJ5VEFoZ3hMb2NzXVp0Y395e2RrdGpAAX10Rg1zZVpCemRkD2R+WWhieG1vVmN8QGFlcEJiZwNST21jQlV8aXR/dH99dHVRSXx0VW93fnBocXgJRX5uaG1sZmBCb2JeeGV+WXBzeAh/fGBrYlNjYHR/fXNjS3tCe3RvUFJ9d39XVGpjVm1nWWBmYE1GdH9TDFNheFxFYAdZWndVf098ZAJxbGoBe3F/W3J1QR5/Y157THtSSm5qUEFRYB99VGpjVm1nWWBmYE1GZHgIBGNjaGFsYQYbbW1ZeH5sc0pSeX4FZXRveXF1Z119d2NjeXt0DwsMFBcFDwAMARAMDHVfWUNgQlIPFAIaDQAYFwAXCBR5U39TZWthfHVnaGJkd2xLeXNWcHgJXWJjfExnZWNjYGJkB3x5BHRUZm1vYmUeYnNlYFZbFx4UHxYNCxQUGnB1fHZrc3AFfH5NamRZX2JQYEJabXRaT39wVm54CFprZHt6b2paH3BnXg9ia01kUnt5AHxhH2JhYXBoWmMDf2F9cFZueAhFYGEfbWJxYFpiYgN4b2x9VlJ5bkV+Z3t6bWpeFltnA15lYGN8VHl9QVFnaEBmYQcbW210eGVsY0ZhewhdYGEfXGZlB3RqYwN0Zm5ZcGF/CHdRY2hqU2NwH2pwcwsTGhkQBBoWBwYUFBp0c3dveXRzd295dHN3b3l0c3dveXRzCxMaGRADFhYGChQUCBsBARsPAQoFFwsDAgUbAAYAAwIaAwcYHQwXCBRjQmRHe2phCBAaDA4HHAUbGg8QV3xqRWQHXm5iWUV3XnNKYG96WmhzaX59ZFF3eXNzf29/ZHhEDBQXCwAADwEQDAxrZ2BhaV8NcXFJQHd0QUl6cnNFTHp0e1NqX1Z6cUlAZWpwdHtnWll+eXRRd2pffHZyRlN7dWRsXWYDcH1vXnt7b19kc3FJQHhlXWdtc3MOanlnVW9qeWB3dGxLYHQGbF5mZHRsfXRFVW1qRnd3fAB0c1FNWXF0Rk9qXnh0eGpWe3d8U3t1QX97fVUCZnpNXXt4fndnZ0lPdnBjFgUXHhQZDBsLDwwCF3N3ewUXTw==\",\"c\":\"gAAAAABoxKtEEAwUWGe7MoaaTRvsKjllfQJHkn9tawTJltvtAtipT45lb3dRuZd3A03LLB7IQZRAqvLek4G9nhIP0xfmivpHIcwSRk4xTptN9YZblxjxUvEjiO2oi4T5hQ1FDZI5jDDFWrvDNfvNXZKk4M46fsIVUlq008hIBT3pNKnwqaJVyjSOG5ryUzvOA5w5QrWQYb5e6g_th6AJkjTkSTMVISP6A-1TR9594hJb_ntwc4-A7y6pPksJmAsHn5P4r2Z7YOODEEKU55HCbAiyB4CsxjCluJMVjiDl_rf3KfutOQzHQ3hvMKFlDyRsiYSYw_Bf05MDob7h_3IDQuqyu5lKu6vPYjMX7TUYJckBEy44pOM9EavO67YPXX8xAQyTW6CPR8Xl4x4ilKh7PZrTasou0VFm0ATnHTiH1__zL8o4BQICcfb1mw-R_NssNp7kKoEne_pCrKam4UI-raa5GsOIhOZtE9v3LckkZoYu3pPyY4GgGN5xOLtQp9goZLg31qG49LXSNiF81sodiNqhBPef0P5lXN3OVrnQmBcyTqiZ27_Rg5tVydZ7BbktiM0opu_H5F5iPnxGMo6SIK8XPR08qP8O-MIjMaZx5Uof4MDxA8qQuL4MPQDNMA4AW7TPwkq-9jZJ60O9OXT4NK5EHrq6mCyatZpageI86y6xCky2SD5xreFAP8ap8Ya-COU1loprPpxbtaBKGBJcPye6MKXTgoB0TuLHGBD41rUpm_N2GYxdfuu--ohLD9u4-0A_D3eyJUuymvAnieLu-DcPugw7SoOiEVahHcavtB0NX6k64nnPrpktoIJ6t2TTB7fEbQNyoN04q1lUGroSnwRUDUU0WeDubG5NybF5PT5XfAsC6Eouw3thKG6fFMhR0MPGeDRJP5jMf-k2uNobBvt_XVvJ0wcRzk2_JabfomICeDpfpC6BNb5M_qSO5qvsC6OLg_nrMIfJt0SBHwnzJKnLGKrafRUVO63j_aB0dYOsiFnOEWzFnTuegMD4gu58J2g-F6Nmk7HcjSdhrOT4QdwsiT2_aSY-UBPTnOvHrjXg4QXDZKwXndddG8L9zUCYg2INFwQmgP9bWhX-XfMfMYErlKU4NrPR-C_Bc56HSkbHE865qXCqizz4VtD_O9U5RO-MK7NBqqfzPmAAjPBj38chyrOJSh-yA_KhL3T7DrrXCNpWzoevTnaZWlYGB02gprzuq8-LHeCcWpvJQHShH6t74LiKSHSVfy_x5wQg3mwpicUhPhXWFve_pcEQInKMNJI_0d4w2slVhdBpgF8Y494ocu-EiykaEvTkrAgfAp7uFnOncsdEAPLSR5vv7s_c7lHZRpDwZ56tV3CrflQz_nzgGdzlhQuDEg==\",\"id\":\"4722b679-e271-4034-a73f-e617534f6063\",\"flow\":\"password_verify\"}",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "traceparent": "00-000000000000000042e8831f92ba21d6-08f69757e704e244-01",
    "tracestate": "dd=s:1;o:rum",
    "x-datadog-origin": "rum",
    "x-datadog-parent-id": "645870000368050756",
    "x-datadog-sampling-priority": "1",
    "x-datadog-trace-id": "4821247572729012694"
  },
  "referrer": "https://auth.openai.com/log-in/password",
  "body": "{\"password\":\"ai-modules\\\\openai\\\\barejsq\",\"username\":\"biyome1300@fanwn.com\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
{"continue_url":"https://auth.openai.com/api/oauth/oauth2/auth?audience=https%3A%2F%2Fapi.openai.com%2Fv1&auth_session_logging_id=bba88eb3-5f16-448e-8c51-c25693e7fad1&client_id=app_X8zY6vW2pQ9tR3dE7nK1jL5gH&device_id=4ec9b165-16b1-4924-98ec-90df6423523b&ext-oai-did=4ec9b165-16b1-4924-98ec-90df6423523b&login_verifier=DW9D3qaBb8xDtnSQVj6cdluLWU8wF3_pxChcdlv0ciGtPegPYSA_O4UGBoLbAmyApfQvwlCeJLO_fBI-w840S0kRAuCtr4QVK5S13DrIWmINHUoQTNI6mqRM8nVJQXsadUGzBu_srQ-9E6QqpSBUZTy2DPeV_mg7zMJz3J-_1-r35S_SNiA2G0zFCO_0-60lrtGVnrSPUWHjPNLOlKOnU-gNZ-gFBuvV7WslPpM9Ob5Dpm610gYk6PBEOPIz2hN8CJCJGKcI5wcGzYj18qW3lvg0LwFqioeMXoekN7Z8GVlFTs7_ZoS6YzN6jamDtuJiWSBX1YyqUuw75Iw2HDMBrr3NJzaoQsnLpdUfEGay6GSuvFVaqdxhQXMbVm1t88kTO73a8AAjeV74y13jNPxMCpSpT5GHTMw-TKVx5tCYvPj2uSkolCUbNMZGwEWYh8jxCJSwA3_R8j13jMYeouCwK1r5D8_32Quo6wZBGYMmf9MCd-vAXeaLULXP8yytnNBogpljJsp6Hd2ELvmow-RcbSYqkO1dOUmhaYzCrCwfjXwKpq42RAAN1gSyUAPekWMH12fjKNenHPyZSoXa_6Bd3LddQyDduBxgnJd1wJzDqTzzHGGLB866MJ9kV_LMN-WXp9AwDYBcYWBH3SMyxQqp42UCtpuFOrXoUfgCbDBdNBTYJpWf0Emk8BZwGv33qUp9zjvYy-LcrArGGq4L6dNt3GzhJU4aRJIBEcmXRN7fTpjzK7RKHNOymjw14SPF75elVKwRPoa1l8RY5or5KmYi2tK_AOSWRps7IaAJ47pjAJOTA4-0SpBPXZfayZObLMuxBwugXrUJGFrs7GKqu01IVpEQzf97EzljbzEjVuleQO9IGKMesBNf4HirAN3OYcng7eLywUxEuaKLcGjj_60nlYSIyyIyWiUDzF4ma2AVGtWgklT8JqEz6iLi1WbMeu0FxjYc46scumR2eAYXXWEdhGv1Q8ihBzTjVIDOInDbsk4jcxkdqgIh18smMVxFPKAnmIscPQq_GRT-DZTToCQwNBSrA-j4WZZEUYsetb2sT_Rb27C3iiNcHTKrHdSBMFHb-cv9w1SCkiiAun1JGpy60KdjS3LB9fhiyJCNA0vgwn0gm5Zf_7UBEtgaycKBRVvjVPyDcXAZTAJjLXsM9WNQv4ZCr1fo4tSUWBJ2cijrtE_hvzhJ-bsnylw0xF7BcHJuWm9vgky8lKi-KxoYxDC0KOtYqo1GxId0fmCsxNmrQzmJQfxSb70NWi3v0tkroR1q6Gnq-G-pXNc5Z1zpV4vp2TA6B6lHXcL40wxrTHzssI-HEo5nN-JH79EoCcXjc4OFZAyC31Q1UEX4qDAmZzgVMqlGGxaTjsF04yLgZZlE7jjesaEtFRxGJo4FnZXmqXO0cFdPq4Na4O77WOi73RdKPMMIBDzhrXb-HvP4PQY-e3wlS9ssOB7DCFkIDA3SwyuQPNLBXFdwvUaTe9XPO5tMJATqe2HP0bG2Q9OtKSUNy9bNEgvh5ExDWNw3Ux5F4YHw6-rpmyR1rmLATJZgm0ebvehLraMN4eOxE8hMaLT2JB1dUG18IxJ0Yonzaip6TelUNdgF5zzZIXgXzLcJ933KQ-CpV6DFBLsJlfqiFCUUPAeGM0qqmAx_zp4jztpcLRt-PioJKyCq4M4M4HmMGSV-5_CqrfaRotDEDMbcgkTmeLJLtN_nDUMhBidemgJuklPc-QuAdr1O3FrdwTjg8nDpI8eQZFkuQuO_nXMOh3yV30HJwr79mEPeolH796DA4iR32F50ApDIm_SjDtmtqJ6WUiAyn6pA54JoLlBF4Sw9-8JDjaWI56liTlYeFTvDSyFnC4iSLYjsTkvx6wRgiB5vKlm9-lHqCwe64TjaN-9A1cDJJ042-kBqyh2ftHCtaUkxcAO_MAbDOxSoWq1w1vGrUm0dbI_n3fMMnXBgsMdFXE2J2-foFMvUF2S4UrIPZPXwVK_HHKydki6udkiULHhWzZ9GWcc0JmmuulbhZkOXowSosatq93MbghawqdLnLNogy3Zy_2v6u33NrA6st2vX02d8IpsSdIUHc5Q6gQH6OaAgmpbf8E0anVdBDynegZuxoHava2rxcUpiuI7ZB0mzi2TaUCGKDUHLhNfBIfMlHPTiaEoK342cyHaoM6nI6l9v2ftkq2qNFixzTgYAwsrqQc6K86n6gxEgoy_gDIxWUDkDLDt5p7eyoWONzrxuPEIFAomKVXbhKiOwsP-dFoSXx4FSs7Cx1L8B_Z0FMS2ZpYRsZvy8HfYuNgkbuH_CemOq_WsTEY4fdx2yej9tlWfuVvGonJg91ttfbPLSqyiP9MoKli7cK59APwpEBeoi20cSKlYI5QIV6MJNFiZhQFaVlOe0lcs1YjDKKTq19G1s1eKaLr7VxanEpJGzb1JDr_a2kRk3oDo8v2AjQEkdtMi5W9J0z2BUU1QBfOAoGjxF3FOQfxAgzLQSiID0A3HI576DdUVt3lYpWOkU9g2FgCjpwkVdHxjGb8hf1sPFohPf44KWKeMnFrqoNIJgpLpk9y8y8kxuUGI_st4MgNQJdkhZGhY0phk2vpA1o8WlHZciIxrHMkcs4M_78is0aWgqnuT80KMDEJtMZZhvWvDl3T8oXutBwR94Mfp4VTkg&prompt=login&redirect_uri=https%3A%2F%2Fchatgpt.com%2Fapi%2Fauth%2Fcallback%2Fopenai&response_type=code&scope=openid+email+profile+offline_access+model.request+model.read+organization.read+organization.write&screen_hint=login_or_signup&state=eAzc8i1msoh3hOIpXRGoUSCo49sYQp8ucXALfd6S7pU","method":"GET","page":{"type":"external_url","backstack_behavior":"default","payload":{"url":"https://auth.openai.com/api/oauth/oauth2/auth?audience=https%3A%2F%2Fapi.openai.com%2Fv1&auth_session_logging_id=bba88eb3-5f16-448e-8c51-c25693e7fad1&client_id=app_X8zY6vW2pQ9tR3dE7nK1jL5gH&device_id=4ec9b165-16b1-4924-98ec-90df6423523b&ext-oai-did=4ec9b165-16b1-4924-98ec-90df6423523b&login_verifier=DW9D3qaBb8xDtnSQVj6cdluLWU8wF3_pxChcdlv0ciGtPegPYSA_O4UGBoLbAmyApfQvwlCeJLO_fBI-w840S0kRAuCtr4QVK5S13DrIWmINHUoQTNI6mqRM8nVJQXsadUGzBu_srQ-9E6QqpSBUZTy2DPeV_mg7zMJz3J-_1-r35S_SNiA2G0zFCO_0-60lrtGVnrSPUWHjPNLOlKOnU-gNZ-gFBuvV7WslPpM9Ob5Dpm610gYk6PBEOPIz2hN8CJCJGKcI5wcGzYj18qW3lvg0LwFqioeMXoekN7Z8GVlFTs7_ZoS6YzN6jamDtuJiWSBX1YyqUuw75Iw2HDMBrr3NJzaoQsnLpdUfEGay6GSuvFVaqdxhQXMbVm1t88kTO73a8AAjeV74y13jNPxMCpSpT5GHTMw-TKVx5tCYvPj2uSkolCUbNMZGwEWYh8jxCJSwA3_R8j13jMYeouCwK1r5D8_32Quo6wZBGYMmf9MCd-vAXeaLULXP8yytnNBogpljJsp6Hd2ELvmow-RcbSYqkO1dOUmhaYzCrCwfjXwKpq42RAAN1gSyUAPekWMH12fjKNenHPyZSoXa_6Bd3LddQyDduBxgnJd1wJzDqTzzHGGLB866MJ9kV_LMN-WXp9AwDYBcYWBH3SMyxQqp42UCtpuFOrXoUfgCbDBdNBTYJpWf0Emk8BZwGv33qUp9zjvYy-LcrArGGq4L6dNt3GzhJU4aRJIBEcmXRN7fTpjzK7RKHNOymjw14SPF75elVKwRPoa1l8RY5or5KmYi2tK_AOSWRps7IaAJ47pjAJOTA4-0SpBPXZfayZObLMuxBwugXrUJGFrs7GKqu01IVpEQzf97EzljbzEjVuleQO9IGKMesBNf4HirAN3OYcng7eLywUxEuaKLcGjj_60nlYSIyyIyWiUDzF4ma2AVGtWgklT8JqEz6iLi1WbMeu0FxjYc46scumR2eAYXXWEdhGv1Q8ihBzTjVIDOInDbsk4jcxkdqgIh18smMVxFPKAnmIscPQq_GRT-DZTToCQwNBSrA-j4WZZEUYsetb2sT_Rb27C3iiNcHTKrHdSBMFHb-cv9w1SCkiiAun1JGpy60KdjS3LB9fhiyJCNA0vgwn0gm5Zf_7UBEtgaycKBRVvjVPyDcXAZTAJjLXsM9WNQv4ZCr1fo4tSUWBJ2cijrtE_hvzhJ-bsnylw0xF7BcHJuWm9vgky8lKi-KxoYxDC0KOtYqo1GxId0fmCsxNmrQzmJQfxSb70NWi3v0tkroR1q6Gnq-G-pXNc5Z1zpV4vp2TA6B6lHXcL40wxrTHzssI-HEo5nN-JH79EoCcXjc4OFZAyC31Q1UEX4qDAmZzgVMqlGGxaTjsF04yLgZZlE7jjesaEtFRxGJo4FnZXmqXO0cFdPq4Na4O77WOi73RdKPMMIBDzhrXb-HvP4PQY-e3wlS9ssOB7DCFkIDA3SwyuQPNLBXFdwvUaTe9XPO5tMJATqe2HP0bG2Q9OtKSUNy9bNEgvh5ExDWNw3Ux5F4YHw6-rpmyR1rmLATJZgm0ebvehLraMN4eOxE8hMaLT2JB1dUG18IxJ0Yonzaip6TelUNdgF5zzZIXgXzLcJ933KQ-CpV6DFBLsJlfqiFCUUPAeGM0qqmAx_zp4jztpcLRt-PioJKyCq4M4M4HmMGSV-5_CqrfaRotDEDMbcgkTmeLJLtN_nDUMhBidemgJuklPc-QuAdr1O3FrdwTjg8nDpI8eQZFkuQuO_nXMOh3yV30HJwr79mEPeolH796DA4iR32F50ApDIm_SjDtmtqJ6WUiAyn6pA54JoLlBF4Sw9-8JDjaWI56liTlYeFTvDSyFnC4iSLYjsTkvx6wRgiB5vKlm9-lHqCwe64TjaN-9A1cDJJ042-kBqyh2ftHCtaUkxcAO_MAbDOxSoWq1w1vGrUm0dbI_n3fMMnXBgsMdFXE2J2-foFMvUF2S4UrIPZPXwVK_HHKydki6udkiULHhWzZ9GWcc0JmmuulbhZkOXowSosatq93MbghawqdLnLNogy3Zy_2v6u33NrA6st2vX02d8IpsSdIUHc5Q6gQH6OaAgmpbf8E0anVdBDynegZuxoHava2rxcUpiuI7ZB0mzi2TaUCGKDUHLhNfBIfMlHPTiaEoK342cyHaoM6nI6l9v2ftkq2qNFixzTgYAwsrqQc6K86n6gxEgoy_gDIxWUDkDLDt5p7eyoWONzrxuPEIFAomKVXbhKiOwsP-dFoSXx4FSs7Cx1L8B_Z0FMS2ZpYRsZvy8HfYuNgkbuH_CemOq_WsTEY4fdx2yej9tlWfuVvGonJg91ttfbPLSqyiP9MoKli7cK59APwpEBeoi20cSKlYI5QIV6MJNFiZhQFaVlOe0lcs1YjDKKTq19G1s1eKaLr7VxanEpJGzb1JDr_a2kRk3oDo8v2AjQEkdtMi5W9J0z2BUU1QBfOAoGjxF3FOQfxAgzLQSiID0A3HI576DdUVt3lYpWOkU9g2FgCjpwkVdHxjGb8hf1sPFohPf44KWKeMnFrqoNIJgpLpk9y8y8kxuUGI_st4MgNQJdkhZGhY0phk2vpA1o8WlHZciIxrHMkcs4M_78is0aWgqnuT80KMDEJtMZZhvWvDl3T8oXutBwR94Mfp4VTkg&prompt=login&redirect_uri=https%3A%2F%2Fchatgpt.com%2Fapi%2Fauth%2Fcallback%2Fopenai&response_type=code&scope=openid+email+profile+offline_access+model.request+model.read+organization.read+organization.write&screen_hint=login_or_signup&state=eAzc8i1msoh3hOIpXRGoUSCo49sYQp8ucXALfd6S7pU"}}}




fetch("https://auth.openai.com/api/accounts/authorize/continue", {
  "headers": {
    "accept": "application/json",
    "accept-language": "it-IT,it;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "openai-sentinel-token": "{\"p\":\"gAAAAABWzMwMDAsIlNhdCBTZXAgMTMgMjAyNSAwMTozNjoxMiBHTVQrMDIwMCAoT3JhIGxlZ2FsZSBkZWxs4oCZRXVyb3BhIGNlbnRyYWxlKSIsNDI5NDcwNTE1MiwxNywiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzE0MC4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiaHR0cHM6Ly9zZW50aW5lbC5vcGVuYWkuY29tL2JhY2tlbmQtYXBpL3NlbnRpbmVsL3Nkay5qcyIsbnVsbCwiaXQtSVQiLCJpdC1JVCIsNiwiY2xpcGJvYXJk4oiSW29iamVjdCBDbGlwYm9hcmRdIiwiX19yZWFjdENvbnRhaW5lciRreG80d3JicXRhIiwib25sYW5ndWFnZWNoYW5nZSIsMTA2OTgzLjYwMDAwMDAwMTQ5LCI4OWViMGVmNy1lNmQzLTRhMjgtYWQwNi01YzljMjdiZjAwMDgiLCIiLDEyLDE3NTc3MjAwNjUwMzcuNF0=~S\",\"t\":\"SgwEAB8cEAITY0sMSWBVBQwMHhoEHBwNCAwIGnB/c38TAhALCQAGDhMUEG52WmFZXHxkdWR4Z251bwsaHQwLCB8bBxoLDGFfSWV1X0JLelBBZ3Z5VmxzeglLdVNrZmRTSXR2eVZkcE9wb3FpWnRwQGB6YFRVfGRTa2l1X0JIcHpgemVUAGd3QGBicWlwbXd9QXdhbkFjd0BganZQCU1zT3BpdUAFT2cId2lmfgRqd3l4Z3p5ZHt3CHt2alNkY3F5WWMQFBMaAxYHFxACE2sBSH19dGpDf3dIVHZzX2hNWQFSeF4NUGtZSGR6A2Fof2RAVX10alJ8Xn5kdmByaXhFDXl4Xm59eHR+V30DYWhpZEBpeWRueXZ0AGNtZH5keXdMUnp6dnN2Z0ByeVl6a39jU1N6ZAF6eAMNaH90XFJ8d3pmdmRceXZ0CWd5A0BSeHdQU3heanp8A2JnfQNqY3YCTGZ6ZAF6eAMNaH90XFJrRQUMDB4aAxccDBMUEG9nXnVrdGdncGNKY28BdGNwAWhxYGcXYm9JdGFpZxZqYGRoZH5nRnNwAEp2eQBoeW50F3VgY1ZibWdaV28AVn8aHQwFDB8WBRoLDFNfSR9kCQRkalQBfGgJSUx6T0ZLdVVrZmp5Qmp2egVvemoEWBAUExoAFgIdEAITbHAMDAweGgQbHAEEDAgaYEJCbGVreHBnfGhrZR90aWdrXVtpe1ZoaUUDaWZCRmBpHwJbcn9nb3NJd3t5f390c0l7dHJ/UWBweFlxYh98XXJrVXxmWWddeUVGfmUeaHRma1lbZ2hwXGNDVltgeGhqZx5WYGlpB1lmH2RtcGhWd2RreHBme2RwaXhoe3BJd3Fwe0JtdX9zXnNJCnJ5SXRdc3wKXXJ4f2Fzf3N6dnh3aHBGWmlyWWBxZGxjcHlJeFxwa115cm90cXNoQmBiWWhaeXsCc3JJa1pnQgJ9dkl0XWRsRXBySWd7YHtKaWZFdGpnSXBqZnh4f2cfRV5iHmBiaXhGbGVoWnppa0Fedn97cnNGVXx1SXdceUlwbGJZY3FzbAp/aUJ4dGdCA2B5Qn9tYEJCbGVreHBnfGhrZR90aWdrXVtpe1ZoaUUDaWZCRmBpHwJbdUlzW3Nvd3l2f1F6eXgDf2Z7ZFxmHwpeaXhWdGBFVlxnQwdwZ0ZrfnZJa3ZyfF16cm93e3N4Rm5leGBiZ1ZFdGZZaHFkHwJxdmwHdGN7C39iH1pyeWhobWZFZGBgHmRMaUJwe2lCQmlleFlvcFZZf3JJc2BwfwZweVYHdGN7C39iH1pyeWhGaWV4Qlxnf3BgZUJwe2MfXn5jHwNvYElzenJJY2Bwf0F/dkljdXl8BnlwaGB2Z0kCenZvQXpna0FwcH9je2B7SmlmRXRqZ0lwamZ4eH9nH0VeYh5gYml4RmxlaFp6aWtBXnl/c3pwfGt7dVlRWXBWYHtmQnx1YEVWbndCeGhkeHBtYkZKXGMeC11leHBZZh9WXml8RXRyfApwdVl7YXN/RXFwRXR1ZGhCemR4a3lkeF5rY0JWW3keRn1meANaZB5KYWB4SnR5VkF0dW9zXnNZWXJ2RgZxZEZoaXBvd2BkbwZ9eXhzdWd8A2x3a3hZZB5Ke2MfZ29kRQtqZGhgc3loA3BlHwd2ZGhCWmcfC1x5b0FwdllzdHNsUXx1b2t7YHtKaWZFdGpnSXBqZnh4f2cfRV5iHmBiaXhGbGVoWnppa0FeeX9jenN8XXl1SX9icGxge2ZCfHVgRVZud0V4WWQfQlxiHANqZ39zf3VvZ1pySUV7eUl7bXB8a3Bpb3h2cx8GcHkfa3JzfF5pZkYCWnBJAn15eGhcc2xFdGl/WVpnQkJrcEV0dWRoQnpkeGt5ZHhea2NCVlt5HkZ9ZngDWmQeSmFgeEp0eVZFdHBvUV1yWXNwdn8PBRMCEA0JAAcJExQQeXBvc3lwb3N5cG9zeXBvc3lwb3N5cG9zGh0MChYEHBACAQAKAAYcBQABHAEOCBwBCwEYTw==\",\"c\":\"gAAAAABoxK4C6O2y-ZB9kGzKpXgxxzaXLDzfiH_rMqGZTeEL89tCeOMSgS6k479-6dHHXX-64MfZAgkMGzSVGDHiwEDgTtvdzCOlb63WEglS2TTqI9Ad_BSzTFAIi6wYcZxIRKOFtboG-ckeNSiAryT5nTTk69-YgcQhfYcgbV2Uim_cn28ZbA6MYhuNwZ5wDDfqG4hU6FikSxT8vosHPTJUd9-_oUuSKS7jN-0uUq4d9uieH1WB2GF7Jig4VVnpWD5TK50J3KLHlkr-UcxlNIKOrM8sj9d6eJ6HOID1BJNxXqZRsYIgg7U8XUZjIBnJZ0cxiI6cw-G9TkVvaFGtAp9DlZVB5AJLWpVTu-MfLRab_8SLWSjw-bnoZrqOVo-BqxBXm_L4L1899FHDopPBTq4CaXNMdMgLrLuxQxvYGaA821Dg4x9_IsKSfIQIkpsUajj8gJo86MnO4nggdmOlA_m06fWvGr9N4EOkVv6R0ak7phBLQguHXAzIXxkg5SbsTn_G7hyXY1_vU8uJItdRLIJ0X_kChizb2pjSn3AJ6TDuX9UD4aWc4gRZmY-7sZNkOh8K_Le6rcw7fSE1S-iDTfz6ldNDJWBhlNm2uottYhL2Xdcb0JqFFOm6s6TkG5e87GbsXW91BvU83_9ZoTpPWeQQNjWMBbLsD-9xQJxWa7qgxH9u9soT-GUaupWut03Mf5O6oV4u-EhoDqLN2LiUXl2YN9Qxs7UvWypp1OEqlGSAGVTwln7sMau-ziu8STcEtwRa4tPvUAZzt0xbiuQjTL6KSFwoXHuIkFsDoYr_lc8BZC8diJ9VGfJJaqF2h3-KxiTsOrh4RJPbv3qIxQVkhah4Z7NMeAI9Gau5TXQkOaZXKK-TzA_Y3HVqsS-KM5Udt7eCSeTJFtdni4LrYNUMrKZrVZf82GjPR2IxNct8Pi1b19rjnMKZVmXS3C8LgsNBAYwSE73mVNlG8Mm8-JIwfC21VieUJpfr5aqTQtdSSBEsLR6aZgGAZpd9UvENrx1wh3EWSxz089cRSXEszv-CMl9ydOM-F5FlXoLN4-7syHD3aj5-31zAKmIKg-PFpfJi4D3Ez5Q4s3dkUOkFz7l1OZVGgd-pRwqZfSONHhz4j7-pmOJ7cd_jY9cG3j72EX5A2Zql2VjC_TfQY0PKvrW6IaPMP64J7dN0XqxMipdPtJpgy6OC5T8TGciunz8O74klzEKBgT7V8CvzLiNvubU3zqt8QdWtnuh6HTqOP_0NLRBHWGGuT7JlfxThil1Vk6DxFG9bbsubUZjtDKR_sneRzZboRRbIy3RGUSKAzaY8HA3Z5EOz2pJF5ceg9mDro44OcqWexwq6E2sFA9PfEWpN7uMuFaHDf2pvTw==\",\"id\":\"b4fe611a-e48e-429a-aa47-c74aa52f9b86\",\"flow\":\"authorize_continue\"}",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "traceparent": "00-0000000000000000ada8c5227eb84327-556e6b34718c8374-01",
    "tracestate": "dd=s:1;o:rum",
    "x-datadog-origin": "rum",
    "x-datadog-parent-id": "6155975613649552244",
    "x-datadog-sampling-priority": "1",
    "x-datadog-trace-id": "12513468316594488103"
  },
  "referrer": "https://auth.openai.com/log-in-or-create-account",
  "body": "{\"username\":{\"kind\":\"email\",\"value\":\"biyome1300@fanwn.com\"},\"screen_hint\":\"login_or_signup\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});