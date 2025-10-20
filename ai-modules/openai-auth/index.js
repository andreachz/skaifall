fetch("https://auth.openai.com/api/accounts/authorize/continue", {
  "headers": {
    "accept": "application/json",
    "accept-language": "it-IT,it;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "openai-sentinel-token": "{\"p\":\"gAAAAABWzMwMDAsIk1vbiBTZXAgMDggMjAyNSAxODo0NjozNSBHTVQrMDIwMCAoT3JhIGxlZ2FsZSBkZWxs4oCZRXVyb3BhIGNlbnRyYWxlKSIsNDI5NDcwNTE1MiwzOSwiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEzOS4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiaHR0cHM6Ly9zZW50aW5lbC5vcGVuYWkuY29tL3NlbnRpbmVsL2U5NzcwZGNkL3Nkay5qcyIsbnVsbCwiaXQtSVQiLCJpdC1JVCIsMTIsImdldEJhdHRlcnniiJJmdW5jdGlvbiBnZXRCYXR0ZXJ5KCkgeyBbbmF0aXZlIGNvZGVdIH0iLCJsb2NhdGlvbiIsIm1vdmVUbyIsMTczNzYuMjk5OTk5OTk3MDIsIjE0ODY2NDI2LTJlMjItNGQ3MC1hYTg4LWZkMmY0MWI5MzFhYiIsIiIsMTIsMTc1NzM0OTk3ODQ5My4yXQ==~S\",\"t\":\"QxEZGQQMERQVcXoDdnVFcXpvTwZwcklQdnBUTXRxeX5IFR4aAhYZAQARFBVzfnF+YmNXf2xiVXdmWU9kbGJ7dHZqCkpmA3Z+f3JWaXtoQ2FsZRdvanoCYmZkdmZ8XAt8ZB9TVmBhRXZ2T1x5c1V1eG9lBn57RUN6bANgdWduYm9gA3Z/fAR0WWt4T1NrdRtvan9LT29eAVdmYkZ6Zh9ldWwDYFVkCQJKcEV9em8HQmpxWVxxf1RvfHF5cWd2RXVmeAcDbXJ/QHRrRHhjc3l9YGFzXFd4QHh9YUJbemBlG2F0U3FiZXd+YXZycFdkH0BWf1RjcHZpQE91c3F6ZgYDfGYeT3NqAm9UYQhXfmFkDVdMclZse29Aen9UZ3x2eXJLdUoNf3wHC3xieHFneXV8Y2UJR2JiSkBXfGILWmEfW3pqAkZUYUADd3VFW3lvTwp+cUlEDxofDAIcDAYMDRBtdkpWYAh2bX9zfmR8B0pacmhfcWBlH2dqUEtMb3d1anZbVm1yHwJRfmVWVHVUdWVhWQF3eE9ka2d4ZVZsZR9WEBQRGQ4cAAEMDRB7RBMKEBQRGwccCQoMDRB3Z2tCfE8OExUeGgAcGQMPERQVZglhQFNnCQV3TQIFEQIVCwgdGQMQAhFpWlZgYR9TC2llVm5jeXp6VWRiUHhbSll1HnVWbVhBb2NTQ01vXnJyenFCdGFsfWpuYht0an5LeWR0DVB2YVF3ex51Vm1YXlJqfgt6dGRqVnthaHliHXVqYHVecmBTQ31vWnlRemEDc2ZCZWBgZlpjYAlpdmQDflF4W2hzYkJPUW5YRlJqfgJ2YANUZHZhZHBkeFNRalhsY2QJBk9mdHJkaVAPBRECFQcPHR8BEAIRf090b3V/UHtwRFZ4d3l6YnBFYVBqUFFdcn92fHBEVnZlCUtmZVptem1Qc3lySXJ4eWFdVXd+cXllA3pSenV3bXFJWGd9ZV5uY1BcZHFVcXdoUGdZcVlmeXpUZ2FjfnV7ZVl1Ym9Qd1x0f1R+eVtZdHpQQ3xmZ3Z0eAYGdXd/WH17VG91cF9UaH9zcVZpWwt0ZntuU3thG3wQFBEYABwMBgwNEHlyb3ZzeXJvdnN5cm92c3lyb3ZzeXJvdhAUER8DHA4GDA0CFgEfDgMLAhcBAAgCFwQEDgYWGxAMAQAAAxoJDG5KfkN5cQNeax5Eal0CdGZzemZLcF9qe3lmd3N2f35icFRGQhBF\",\"c\":\"gAAAAABovwhcxGxWK0gxtxmXMc-o9YkytAlnBzkjW65LOAFA58E0BNk8iYdUV7pvWmb4bs8p95IR-pnvDmdg9daaAZn1KlCA2Wn0DQaGGeSHolaM2NUdehglyYqKujyaeaNM1_So__QN842ERll1sfFcjMivfS8hWHzgs7SCnX3TZeWbmtWzK35clqk7RMJMevseJO5FvlU-_Iuby1mCX15vRB7TMSVzALfoR55oyHsPaM_FO2t9vtuG_OMmkwGTMJMXbWe0CFNFrHL8NIZU3S4NWrT5GXoGxggGZFuiWXOAgl1uF9eWtE0Ob3_-O8dSKBaNn5yuqHAaAPEsgjAlz6yX9bAzlV6klFtu8aw0M7zDnKaDYfYbxYqVIRmQ9nqeAzYAvLeH1e2JB9Dsq_W2punPdQ2TO2AFAep6SwtBQmMXxTtIvAJhGR_yv9wTXvHHdnWOTmQYpsn-Vaqmj3RkGmFUz1Ib7q9cxGA2tHhNNcEQRAun54CEdY4kN7X82bLP1mlc341O1wsw9s8uDz13MroMIioFPYi7TWfJkrxfZXP9_mZuXUBNSYosbf-h8nqeKxIN_c0K8n9mUbYuKdNKGwjR_bGKeFMcSKvLKzEj5Nn_NkkOCrNBMmMd02EE-XmY-6wtUBivz1SpbSoxdl873i2r-l25TAyd1HNgmRCFIqOx-8VvMK35oc5J-80Lpv4_wc6uUUwtlaVhWw54asepkkEFen8AVsz9x2cVN3H2-IxiqH7HjQIuKgv4U8kN_BT0pj336ousYgwU3q1l9zLdEJ-VDXzuTmaFucsaZErvpKatFtsJE1aH0nYlqGH3oeZM_FQxn7n4rm-rqkQdsSCDW62aPuMYrsPNYX1J3MoAyfToWcHTRBOzoDbviB_SFo5PDio95-J_wSsfHTCaSwtW24l8Li35k5BlZaNpOVgRoACJNzlfYeKqYS7jYKn-0ZgfRroYmFl6sxacIUQ3-MNgElBWhWgnqzcD_Fb6ci_FaerzVwCMrW3_Z2qZOqm_fhfSk-Q98ec0QISLuB-WDnZ1-x_FvED4s0Dpgl1nE3cAiGDi3wT2WDY7wymFA593FejIIFN1WOfBLUFzaFp1ChFqqUbUDNU2Ovik14XoVGmeJEKNri0-8qMrH6gdujdKY0ACbolv6Cu-YNhSFhEexwQlpo6IMpQG6wYXyjFp1abBT70r4CsbkecPrGYt2R4aWsA8XyVbxn3ZqnbnKhhZIbbkaWB6srYZD82XMJhGO0XqMubsPZRlBNaAYAIEjiStNGP4oWfR7yObm3QMJDxz2L5mD3rRMu-b7qdY21EsKKX_GBLJpIH3IbBLHffDpq38ntq0zUx_kDiTDnpADSh9-NRnWRurx8-Db4uzNw==\",\"id\":\"84c7f369-b14d-4a93-b77b-52eaefd22397\",\"flow\":\"authorize_continue\"}",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "traceparent": "00-0000000000000000a8ea55e9b451410f-5cbca86eccac8452-01",
    "tracestate": "dd=s:1;o:rum",
    "x-datadog-origin": "rum",
    "x-datadog-parent-id": "6682401140944700498",
    "x-datadog-sampling-priority": "1",
    "x-datadog-trace-id": "12171635405163151631"
  },
  "referrer": "https://auth.openai.com/log-in-or-create-account",
  "body": "{\"username\":{\"kind\":\"email\",\"value\":\"aaaaa@a.com\"},\"screen_hint\":\"login_or_signup\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});