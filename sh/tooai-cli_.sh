#!/bin/bash
#!/usr/bin/env bash
# set -euo pipefail
# set -eu



# required to show emojis correctly
LANG=UTF-8

shopt -s expand_aliases

TMP_DIR=/tmp/tooai_/
mkdir -p $TMP_DIR
CONV_ID_FILE=${TMP_DIR}cid
PARENT_MSG_ID_FILE=${TMP_DIR}pmi


# type curl
# exit
# alias curl='/mnt/c/Users/Andrea11/Documents/uni/jslab/skaifall/ai-modules/openai/plainjs/bin/curl-impersonate-v0.6.1.x86_64-linux-gnu/curl-impersonate-chrome'
#

# ===============================
# Tor
# ===============================
tor_function(){
local force_rotate=$1
# ===============================
# Config
# ===============================
TOR_SOCKS_PORT=9050
TOR_CONTROL_PORT=9051
TOR_TMP_DIR="${TMP_DIR}tor_/"
TOR_BIN="$TOR_TMP_DIR/tor"
LIBEVENT="$TOR_TMP_DIR/libevent-2.1.so.7"
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$TOR_TMP_DIR
TOR_DATA_DIR="$TOR_TMP_DIR/data"
ROTATION_LOG="$TOR_TMP_DIR/last_rotation"
ROTATION_INTERVAL=500  # seconds

# ===============================
# Helper: start tor if not running
# ===============================
start_tor_if_needed() {
    if pgrep -x tor >/dev/null 2>&1; then
        echo "[*] Tor is already running."
        return 0
    fi

    echo "[*] No Tor process found. Starting Tor..."
    
    
    if [ ! -d "$TOR_TMP_DIR" ]; then
    mkdir -p "$TOR_DATA_DIR" "$TOR_TMP_DIR"
      # -------------------------------
      # Detect OS + Architecture
      # -------------------------------
      OS=$(uname -s)
      ARCH=$(uname -m)
      echo "[*] Detected OS: $OS, Arch: $ARCH"

      # Map architecture to Tor bundle naming convention
      case "$ARCH" in
          x86_64|amd64) ARCH_TAG="x86_64";;
          aarch64|arm64) ARCH_TAG="aarch64";;
          i386|i686) ARCH_TAG="i686";;
          *) echo "[!] Unsupported architecture: $ARCH"; exit 1;;
      esac

      # -------------------------------
      # Determine correct bundle URL
      # -------------------------------
      TOR_VERSION="14.5.8"
      BASE_URL="https://archive.torproject.org/tor-package-archive/torbrowser/${TOR_VERSION}"
      case "$OS" in
          Linux)
              TOR_URL="${BASE_URL}/tor-expert-bundle-linux-${ARCH_TAG}-${TOR_VERSION}.tar.gz"
              ;;
          Darwin)
              TOR_URL="${BASE_URL}/tor-expert-bundle-macos-${ARCH_TAG}-${TOR_VERSION}.tar.gz"
              ;;
          *)
              echo "[!] Unsupported OS: $OS"
              exit 1
              ;;
      esac

      echo "[*] Downloading Tor Expert Bundle from:"
      echo "    $TOR_URL"

      wget -q -O "$TOR_TMP_DIR/tor-bundle.tar.gz" "$TOR_URL" || {
          echo "[!] Failed to download Tor bundle."
          exit 1
      }

      echo "[*] Extracting Tor bundle..."
      tar -xzf "$TOR_TMP_DIR/tor-bundle.tar.gz" -C "$TOR_TMP_DIR"
    else
    echo Using cached Tor in: $TOR_TMP_DIR 
    fi
      
    # Find tor binary inside extracted bundle
    TOR_BIN_FOUND=$(find "${TOR_TMP_DIR}tor" -type f -name tor | head -n1)
    if [ -z "$TOR_BIN_FOUND" ]; then
        echo "[!] Could not locate tor binary in extracted archive."
        exit 1
    fi

    # mv "$TOR_BIN_FOUND" "$TOR_BIN"
    TOR_BIN=$TOR_BIN_FOUND
    chmod +x "$TOR_BIN"

    echo "[+] Tor binary installed at $TOR_BIN"
    
    
    

TORRC="$TOR_TMP_DIR/torrc"
# cat > "$TORRC" <<EOF
# ExitNodes {us},{ca},{gb}
# StrictNodes 1
# MaxCircuitDirtiness 20
# EOF
# TORRC=/dev/null

    export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:"${TOR_TMP_DIR}tor"
    # -------------------------------
    # Start Tor daemon
    # -------------------------------
    "$TOR_BIN" \
        --RunAsDaemon 1 \
        --SocksPort $TOR_SOCKS_PORT \
        --ControlPort $TOR_CONTROL_PORT \
        --CookieAuthentication 1 \
        --DataDirectory "$TOR_DATA_DIR" \
        --ignore-missing-torrc \
        -f "$TORRC"

        # -f /dev/null

    echo "[+] Tor started in background. Waiting for it to become ready..."

    until nc -z 127.0.0.1 $TOR_SOCKS_PORT >/dev/null 2>&1; do
        sleep 1
    done

    echo "[+] Tor SOCKS is up on port $TOR_SOCKS_PORT"
}

# ===============================
# Helper: rotate IP if due
# ===============================
rotate_ip_if_due() {
    local now=$(date +%s)
    local last_rotation=0
    local force_rotate=${1:-0}
    if [[ -f "$ROTATION_LOG" ]]; then
        last_rotation=$(cat "$ROTATION_LOG")
    fi

    local elapsed=$((now - last_rotation))
    if (( elapsed < ROTATION_INTERVAL )); then
        if [ "$force_rotate" -ne 1 ]; then
          echo "[*] Last rotation was $elapsed seconds ago (< $ROTATION_INTERVAL). Skipping."
          return 0
        else
          echo forcing rotation
        fi
    fi

    echo "[*] Rotating Tor IP (elapsed: $elapsed seconds)..."
    local cookie_file="$TOR_DATA_DIR/control_auth_cookie"
    if [[ ! -f "$cookie_file" ]]; then
        echo "[!] control_auth_cookie not found: $cookie_file"
        return 1
    fi

    local cookie_hex
    cookie_hex=$(xxd -p "$cookie_file" | tr -d '\n')
    printf 'AUTHENTICATE %s\r\nSIGNAL NEWNYM\r\nQUIT\r\n' "$cookie_hex" | nc 127.0.0.1 $TOR_CONTROL_PORT

    echo "$now" > "$ROTATION_LOG"
    echo "[+] Tor IP rotated at $(date)"
    # echo "[i] waiting 10 seconds before sending new requests"
    # sleep 10
}

# ===============================
# Main
# ===============================
start_tor_if_needed
rotate_ip_if_due $force_rotate

}



check_tor() {

# tor_function 1
tor_function 0 

curl -sS \
    --socks5-hostname 127.0.0.1:9050 \
    -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
    -A "$(random_user_agent)" \
    -H "accept: text/html,application/xhtml+xml" \
    -H "accept-language: ${LANG_HDR:-en-US}" \
    --tls13-ciphers 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256' \
    --curves 'X25519:P-256' \
    'https://api.ipify.org?format=json'

echo


while :; do
# sleep 1
exit
done

}

# check_tor

USER_AGENTS=(
  # Chrome (Windows/macOS/Linux)
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.69 Safari/537.36"
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.69 Safari/537.36"
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.69 Safari/537.36"

  # Firefox (Windows/macOS/Linux)
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0"
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.0; rv:131.0) Gecko/20100101 Firefox/131.0"
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0"

  # Safari (macOS/iOS)
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15"
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1"
  "Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1"

  # Edge (Windows/macOS)
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.69 Safari/537.36 Edg/130.0.2849.46"
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.69 Safari/537.36 Edg/130.0.2849.46"

  # Misc/other
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Brave/130.0.6723.69 Chrome/130.0.6723.69 Safari/537.36"
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Vivaldi/6.9.3211.48 Chrome/130.0.6723.69 Safari/537.36"
)

# Function to pick a random User-Agent
random_user_agent() {
  local idx=$((RANDOM % ${#USER_AGENTS[@]}))
#   echo "${USER_AGENTS[$idx]}"
  echo "${USER_AGENTS[0]}"
}

# ========= config (feel free to tweak) =========
USER_AGENT="${USER_AGENT:-Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36}$(date +%s)"

OAI_CLIENT_VERSION="${OAI_CLIENT_VERSION:-prod-020b38a5c1ebf6898b75c8f15a1972bba2ff83e2}"
LANG_HDR="${LANG_HDR:-en-US,en;q=0.9}"
TZ_NAME="${TZ_NAME:-Europe/Rome}"
TZ_OFFSET_MIN="${TZ_OFFSET_MIN:--120}" # Europe/Rome example
# ==============================================

# ---- tiny utils ----

rand_int() {
  # 0..2^31-1
  od -An -N4 -tu4 < /dev/urandom | tr -d ' ' | head -n1
}

uuid_v4() {
  if [ -r /proc/sys/kernel/random/uuid ]; then
    cat /proc/sys/kernel/random/uuid
    return
  fi
  # fallback: craft v4 UUID from /dev/urandom
  # (not cryptographically perfect, but fine here)
  bytes=$(od -An -N16 -tx1 < /dev/urandom | tr -d ' \n')
  # set version 4 and variant bits
  v=${bytes:0:8}-${bytes:8:4}-$(( (0x${bytes:12:2} & 0x0f) | 0x40 ))
  v=$(printf "%02x" "$v") # normalize (safe no-op)
  # easier: just use the raw bytes with string surgery
  a=${bytes:0:8}
  b=${bytes:8:4}
  c=$(printf "%02x" $(( (0x${bytes:12:2} & 0x0f) | 0x40 )) )${bytes:14:2}
  d=$(printf "%02x" $(( (0x${bytes:16:2} & 0x3f) | 0x80 )) )${bytes:18:2}
  e=${bytes:20:12}
  printf '%s-%s-%s-%s-%s\n' "$a" "$b" "$c" "$d" "$e"
}

to_hex8() { printf "%08x" "$1"; }

# ---- requirements token (SS.getRequirementsTokenBlocking) ----
make_requirements_token() {
  local device_id="$1"
  local t0_ms; t0_ms=$(now_ms)

  # Build a minimal "config" array. The JS version includes lots of fields,
  # but the server only needs a plausible blob. Keep it stable for a run.
  local screen_sum="1920"
  local date_str; date_str="$(date -u +"%a %b %d %Y %H:%M:%S GMT%z")"
  local rnd1; rnd1=$(rand_int)
  local rnd2; rnd2=$(rand_int)
  local lang="en-US"
  local langs="en-US,en"
  local did="$device_id"

  # array (order matters; we keep indexes 3 and 9 for PoW updates later)
  # Indexes:
  # 0 screen_sum, 1 date, 2 jsHeap(null), 3 attempt, 4 UA, 5 script(null),
  # 6 build(null), 7 lang, 8 langs, 9 elapsed_ms, 10 dwe(..., simplified),
  # 11.. etc simplified constants, 14 sid, etc. We only need a consistent shape.
  local json
  json=$(cat <<EOF
[$screen_sum,"$date_str",null,0,"$(random_user_agent)",null,null,"$lang","$langs",0,"nav-prop","doc-prop","win-prop",${t0_ms},"$did","","",0,$t0_ms]
EOF
)

  # Base64(JSON) like TextEncoder->base64 (UTF-8). Our system base64 is fine.
  local b64
  b64=$(printf '%s' "$json" | b64_nolf)
  printf 'gAAAAAC%s' "$b64"
}

# ---- proof-of-work token (SS.getEnforcementToken) ----
#   *_runCheck(seed,diff,arr,attempt): arr[3]=attempt; arr[9]=elapsed_ms;
#   i = base64(JSON(arr)); ok if fnv1a(seed+i).substr(0,len(diff)) <= diff; return i+"~S"
# We'll do up to 500k attempts (like JS). Often succeeds very fast.
make_proof_token_old_slow() {
  local seed="$1" diff="$2" started_ms="$3" device_id="$4"
  # local max_attempts=500000
  local max_attempts=50000
  local attempt=0
  local arr_prefix arr_suffix

  # Build constant portions of the "config" array; we only patch 3 and 9.
  local date_str; date_str="$(date -u +"%a %b %d %Y %H:%M:%S GMT%z")"
  local screen_sum="1920"
  local lang="en-US" langs="en-US,en"

  arr_prefix=$(cat <<'JSON'
[
JSON
)
  arr_suffix=$(cat <<JSON
"$screen_sum","$date_str",null,0,"$(random_user_agent)",null,null,"$lang","$langs",0,"nav-prop","doc-prop","win-prop",
JSON
)
  # easier: assemble on each try (it's cheap) keeping indexes consistent:
  while [ "$attempt" -lt "$max_attempts" ]; do
    local now; now=$(now_ms)
    local elapsed=$(( now - started_ms ))
    # construct array JSON with attempt at index 3 and elapsed at index 9
    local arr_json
    arr_json=$(cat <<EOF
[$screen_sum,"$date_str",null,$attempt,"$(random_user_agent)",null,null,"$lang","$langs",$elapsed,"nav-prop","doc-prop","win-prop",$now,"$device_id","","",0,$started_ms]
EOF
)
    local b64; b64=$(printf '%s' "$arr_json" | b64_nolf)
    local candidate="$b64~S"
    local h; h=$(fnv1a_mix_hex8 "${seed}${b64}")

    # Compare hex prefix lexicographically with diff (like JS <=)
    local pref=${h:0:${#diff}}
    if [[ "$pref" < "$diff" || "$pref" == "$diff" ]]; then
      printf 'gAAAAAB%s' "$candidate"
      return 0
    fi
    attempt=$(( attempt + 1 ))
  done

  # fallback: still output a marker, though server may reject
  printf 'gAAAAAB%s' "$b64~S"
  return 1
}



# 32-bit signed integer multiply (pure Bash, optimized)
imul32() {
  local a=$1 b=$2
  local res=$(( (a * b) & 0xFFFFFFFF ))
  echo $res
}

# Fast FNV-1a + mix (no printf per char)
fnv1a_mix_hex8() {
  local s="$1" t=2166136261 b
  # Read bytes once; 'od' is faster than per-char Bash slicing
  while IFS= read -r -n1 ch; do
    [[ -z "$ch" ]] && break
    printf -v b "%d" "'$ch"
    (( t ^= b ))
    (( t = (t * 16777619) & 0xFFFFFFFF ))
  done <<<"$s"

  (( t ^= (t >> 16) & 0xFFFF ))
  (( t = (t * 2246822507) & 0xFFFFFFFF ))
  (( t ^= (t >> 13) & 0x7FFFF ))
  (( t = (t * 3266489909) & 0xFFFFFFFF ))
  (( t ^= (t >> 16) & 0xFFFF ))
  printf '%08x' "$t"
}

# Base64 encode without newline (pure Bash + base64)
b64_nolf() {
  base64 | tr -d '\n'
}

# Milliseconds timestamp
now_ms() {
  printf '%s%03d' "$(date +%s)" $((10#$(date +%N) / 1000000))
}

make_proof_token() {
  local seed="$1" diff="$2" started_ms="$3" device_id="$4"
  local max_attempts=50000 attempt=0

  local date_str screen_sum lang langs now elapsed arr_json b64 candidate h pref
  date_str="$(date -u +"%a %b %d %Y %H:%M:%S GMT%z")"
  screen_sum="1920"
  lang="en-US"
  langs="en-US,en"

  while (( attempt < max_attempts )); do
    now=$(now_ms)
    elapsed=$(( now - started_ms ))

    # inline JSON (avoid cat/heredocs)
    arr_json="[$screen_sum,\"$date_str\",null,$attempt,\"$(random_user_agent)\",null,null,\"$lang\",\"$langs\",$elapsed,\"nav-prop\",\"doc-prop\",\"win-prop\",$now,\"$device_id\",\"\",\"\",0,$started_ms]"

    b64=$(printf '%s' "$arr_json" | base64 | tr -d '\n')
    candidate="$b64~S"

    h=$(fnv1a_mix_hex8 "${seed}${b64}")
    pref=${h:0:${#diff}}

    if [[ "$pref" < "$diff" || "$pref" == "$diff" ]]; then
      printf 'gAAAAAB%s' "$candidate"
      return 0
    fi
    ((attempt++))
  done

  # fallback
  printf 'gAAAAAB%s' "$b64~S"
  return 1
}


# ---- globals for a session ----
# OAI_DID="$(uuid_v4)"
OAI_DID_FILE=${TMP_DIR}oaidid
OAI_DID="$(cat $OAI_DID_FILE 2>/dev/null || uuid_v4)"
echo $OAI_DID > $OAI_DID_FILE



# COOKIE_JAR="$(mktemp -p $TMP_DIR cookie.XXXXXX)"
COOKIE_JAR=${TMP_DIR}cookie.XXXXXX
# touch -a $COOKIE_JAR

# trap 'rm -f "$COOKIE_JAR"; echo -e "\n** cookies cleared and exit" 1>&2 ' EXIT

# rm -f "$COOKIE_JAR"

# ---- fetch initial cookies / page (optional but helps) ----
bootstrap_session() {
  
  local max_age=$((30 * 60))  # 30 minutes in seconds

  # If file doesn't exist or is older than max_age
  if [ ! -f "$COOKIE_JAR" ] || [ $(( $(date +%s) - $(stat -c %Y "$COOKIE_JAR" 2>/dev/null || echo 0) )) -gt $max_age ]; then
    echo "🔄 Bootstrapping new session (cookies older than 30 minutes or missing)..."
    curl -sS -D /dev/stderr \
      ${ANON:+--socks5-hostname 127.0.0.1:9050} \
      -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
      -A "$(random_user_agent)" \
      -H "accept: text/html,application/xhtml+xml" \
      -H "accept-language: ${LANG_HDR:-en-US}" \
      --tls13-ciphers 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256' \
      --curves 'X25519:P-256' \
      "https://chatgpt.com/" >/dev/null || true
  else
    echo "✅ Cookie jar is fresh (less than 30 minutes old), skipping bootstrap."
  fi
}

# ---- get chat-requirements ----
get_chat_requirements() {
  local req_token
  req_token="$(make_requirements_token "$OAI_DID")"
  # echo 
  # echo $req_token  $OAI_CLIENT_VERSION  $(random_user_agent)  $OAI_DID  $COOKIE_JAR
  
  curl \
  -sS -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
  ${ANON:+--socks5-hostname 127.0.0.1:9050} \
  -X POST \
  -A "$(random_user_agent)" \
  -H "accept: */*" \
  -H "accept-language: it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7" \
  -H "accept-encoding: identity" \
  -H "content-type: application/json" \
  -H "cache-control: no-cache" \
  -H "oai-client-version: prod-9d358314d30a26d59ec2f2390d079c86e2c0018f" \
  -H "oai-device-id: ${OAI_DID:-b83b32ec-805f-44f9-b36e-1007cbcb734e}" \
  -H "oai-language: it-IT" \
  -H "pragma: no-cache" \
  -H "priority: u=1, i" \
  -H "sec-ch-ua: \"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"" \
  -H "sec-ch-ua-mobile: ?0" \
  -H "sec-ch-ua-platform: \"Windows\"" \
  -H "sec-fetch-dest: empty" \
  -H "sec-fetch-mode: cors" \
  -H "sec-fetch-site: same-origin" \
  -H "referer: https://chatgpt.com/" \
  -H "origin: https://chatgpt.com" \
  --tls13-ciphers 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256' \
  --curves 'X25519:P-256' \
  --data "{\"p\":\"$req_token\"}" \
  "https://chatgpt.com/backend-anon/sentinel/chat-requirements"
}

# ---- get chat-requirements ----
get_chat_requirements_prepare() {
  local req_token
  req_token="$(make_requirements_token "$OAI_DID")"
  # echo 
  # echo $req_token  $OAI_CLIENT_VERSION  $(random_user_agent)  $OAI_DID  $COOKIE_JAR
  
  curl \
  -sS -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
  ${ANON:+--socks5-hostname 127.0.0.1:9050} \
  -X POST \
  -A "$(random_user_agent)" \
  -H "accept: */*" \
  -H "accept-language: it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7" \
  -H "accept-encoding: identity" \
  -H "content-type: application/json" \
  -H "cache-control: no-cache" \
  -H "oai-client-version: prod-9d358314d30a26d59ec2f2390d079c86e2c0018f" \
  -H "oai-device-id: ${OAI_DID:-b83b32ec-805f-44f9-b36e-1007cbcb734e}" \
  -H "oai-language: it-IT" \
  -H "pragma: no-cache" \
  -H "priority: u=1, i" \
  -H "sec-ch-ua: \"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"" \
  -H "sec-ch-ua-mobile: ?0" \
  -H "sec-ch-ua-platform: \"Windows\"" \
  -H "sec-fetch-dest: empty" \
  -H "sec-fetch-mode: cors" \
  -H "sec-fetch-site: same-origin" \
  -H "referer: https://chatgpt.com/" \
  -H "origin: https://chatgpt.com" \
  --tls13-ciphers 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256' \
  --curves 'X25519:P-256' \
  --data "{\"p\":\"$req_token\"}" \
  "https://chatgpt.com/backend-anon/sentinel/chat-requirements/prepare"
}
get_finalize() {
  local prepare_token=$1
  local proof_token=$2
  local turnstile_token=$3

  local b="{\"prepare_token\":\"$prepare_token\",\"proofofwork\":\"$proof_token\",\"turnstile\":\"$turnstile_token\"}"
  # echo $b
  # echo $req_token  $OAI_CLIENT_VERSION  $(random_user_agent)  $OAI_DID  $COOKIE_JAR
  
  curl \
  -sS -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
  ${ANON:+--socks5-hostname 127.0.0.1:9050} \
  -X POST \
  -A "$(random_user_agent)" \
  -H "accept: */*" \
  -H "accept-language: it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7" \
  -H "accept-encoding: identity" \
  -H "content-type: application/json" \
  -H "cache-control: no-cache" \
  -H "oai-client-version: prod-9d358314d30a26d59ec2f2390d079c86e2c0018f" \
  -H "oai-device-id: ${OAI_DID:-b83b32ec-805f-44f9-b36e-1007cbcb734e}" \
  -H "oai-language: it-IT" \
  -H "pragma: no-cache" \
  -H "priority: u=1, i" \
  -H "sec-ch-ua: \"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"" \
  -H "sec-ch-ua-mobile: ?0" \
  -H "sec-ch-ua-platform: \"Windows\"" \
  -H "sec-fetch-dest: empty" \
  -H "sec-fetch-mode: cors" \
  -H "sec-fetch-site: same-origin" \
  -H "referer: https://chatgpt.com/" \
  -H "origin: https://chatgpt.com" \
  --tls13-ciphers 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256' \
  --curves 'X25519:P-256' \
  --data $b \
  "https://chatgpt.com/backend-anon/sentinel/chat-requirements/finalize"
}

# ---- extract JSON fields without jq (very light/fragile but works) ----
json_get() { # $1=key  (first-level only, string value or simple)
  # reads from stdin
  awk -v key="\"$1\"" '
    BEGIN{ RS=","; FS=":" }
    { for(i=1;i<=NF;i++){
        if($i~key){
          # value may be after :
          val=$(i+1)
          # strip leading spaces
          sub(/^[[:space:]]*/,"",val)
          gsub(/\r|\n/,"",val)
          print val
          exit
        }
      }
    }'
}

# pull nested: proofofwork":{"required":true,"seed":"...","difficulty":"..."}
json_extract_seed()   { sed -n 's/.*"proofofwork"\s*:\s*{[^}]*"seed"\s*:\s*"\([^"]*\)".*/\1/p'; }
json_extract_diff()   { sed -n 's/.*"proofofwork"\s*:\s*{[^}]*"difficulty"\s*:\s*"\([^"]*\)".*/\1/p'; }
json_extract_required(){ sed -n 's/.*"proofofwork"\s*:\s*{[^}]*"required"\s*:\s*\(true\|false\).*/\1/p'; }

# ---- build conversation POST body ----
build_conv_body__() {
  local prompt="$1" conv_id="$2" parent_id="$3"
  local msg_id; msg_id="$(uuid_v4)"
  local now_s; now_s="$(date +%s)"
  if [ "$conv_id" != "" ]; then
    conv_id="\"${conv_id}\""
  fi
  cat <<EOF
{"action":"next","messages":[{"id":"$msg_id","author":{"role":"user"},"create_time":$now_s,"content":{"content_type":"text","parts":["$(printf '%s' "$prompt" | sed 's/\\/\\\\/g; s/"/\\"/g')"]},"metadata":{"selected_github_repos":[],"selected_all_github_repos":false,"serialization_metadata":{"custom_symbol_offsets":[]}}}],"conversation_id":${conv_id:-null},"parent_message_id":"${parent_id:-client-created-root}","model":"auto","timezone_offset_min":$TZ_OFFSET_MIN,"timezone":"$TZ_NAME","history_and_training_disabled":true,"conversation_mode":{"kind":"primary_assistant"},"enable_message_followups":true,"system_hints":[],"supports_buffering":true,"supported_encodings":["v1"],"client_contextual_info":{"is_dark_mode":true,"time_since_loaded":200,"page_height":800,"page_width":1200,"pixel_ratio":1,"screen_height":1080,"screen_width":1920},"paragen_cot_summary_display_override":"allow","force_parallel_switch":"auto"}
EOF
}

# ---- build conversation POST body (supports paths:: and b64::) ----
build_conv_body() {
  local prompt="$1" conv_id="$2" parent_id="$3"
  local msg_id now_s
  msg_id="$(uuid_v4)"
  now_s="$(date +%s).871"

  local content_type parts_json attachments_json filenames=()

  # Detect prefix
  if [[ "$prompt" =~ ^paths:: || "$prompt" =~ ^b64:: ]]; then
    local prefix files_part text_part
    prefix="${prompt%%::*}"
    files_part="${prompt#*::}"
    files_part="${files_part%%::*}"
    text_part="${prompt#*::*::*}"

    IFS="|" read -ra files <<<"$files_part"

    local parts attachments
    parts=""
    attachments=""
    local idx=0

    echo uploading ${#files[@]} files... 1>&2
    for f in "${files[@]}"; do
      f="${f//\"/}"
      f="${f//\'/}"
      f="$(echo "$f" | xargs)"  # trim

      local pathfile="$f"
      if [[ "$prefix" == "b64" ]]; then
        pathfile="${TMP_DIR}media_$RANDOM.bin"
        echo "$f" | base64 -d >"$pathfile" 2>/dev/null || continue
      fi

      # upload_file returns: id|mime|size|basename|width|height
      local upres id mime size base w h
      upres="$(upload_file "$pathfile")" || continue

      IFS="|" read -r id mime size base w h <<<"$upres"
      # echo $upres UPRES 2>/dev/null
      [[ -z "$id" ]] && continue

      # Add part (for image/video)
      if [[ "$mime" =~ image|video ]]; then
        parts="${parts:+$parts,}{\"content_type\":\"image_asset_pointer\",\"asset_pointer\":\"file-service://$id\",\"size_bytes\":$size$( [[ -n "$w" ]] && printf ',\"width\":%s' "$w" )$( [[ -n "$h" ]] && printf ',\"height\":%s' "$h" )}"
      fi

      # Add attachment
      attachments="${attachments:+$attachments,}{\"id\":\"$id\",\"size\":$size,\"name\":\"$base\",\"mime_type\":\"$mime\",\"source\":\"local\"$( [[ -n "$w" ]] && printf ',\"width\":%s' "$w" )$( [[ -n "$h" ]] && printf ',\"height\":%s' "$h" )}"
    done

    # add the textual part last
    local esc_prompt
    esc_prompt="$(printf '%s' "$text_part" | sed 's/\\/\\\\/g; s/"/\\"/g')"
    parts_json="[$parts${parts:+,}\"$esc_prompt\"]"
    attachments_json="[${attachments}]"
    content_type="multimodal_text"

  else
    # plain text
    local esc_prompt
    esc_prompt="$(printf '%s' "$prompt" | sed 's/\\/\\\\/g; s/"/\\"/g')"
    parts_json="[\"$esc_prompt\"]"
    attachments_json=""
    content_type="text"
  fi

  attachments_obj=""
  # echo $attachments_json III
  
  [[ -n "$attachments_json" ]] && attachments_obj="\"attachments\":"${attachments_json}","

  # echo $attachments_json IV
  # exit

  [[ -n "$conv_id" ]] && conv_id="\"${conv_id}\""
  cat <<EOF
{"action":"next",
 "messages":[
   {"id":"$msg_id",
    "author":{"role":"user"},
    "create_time":$now_s,
    "content":{"content_type":"$content_type","parts":$parts_json},
    "metadata":{${attachments_obj}
      "selected_github_repos":[],
      "selected_all_github_repos":false,
      "serialization_metadata":{"custom_symbol_offsets":[]}}
   }
 ],
 "conversation_id":${conv_id:-null},
 "parent_message_id":"${parent_id:-client-created-root}",
 "model":"auto",
 "timezone_offset_min":$TZ_OFFSET_MIN,
 "timezone":"$TZ_NAME",
 "history_and_training_disabled":true,
 "conversation_mode":{"kind":"primary_assistant"},
 "enable_message_followups":true,
 "system_hints":[],
 "supports_buffering":true,
 "supported_encodings":["v1"],
 "client_contextual_info":{
   "is_dark_mode":true,
   "time_since_loaded":200,
   "page_height":800,
   "page_width":1200,
   "pixel_ratio":1,
   "screen_height":1080,
   "screen_width":1920},
 "paragen_cot_summary_display_override":"allow",
 "force_parallel_switch":"auto"}
EOF

}

# --- small JSON extractor ---
json_extract() { # key json
  local key="$1" json="$2"
  echo "$json" | sed -n "s/.*\"$key\"[[:space:]]*:[[:space:]]*\"\([^\"]*\)\".*/\1/p" | head -n1
}

# --- MIME type ---
get_mime_type() {
  local file="$1"
  file --mime-type -b "$file" 2>/dev/null || echo "application/octet-stream"
}

# ---- upload_file(file_path) ----
# returns: id|mime|size|basename|width|height
upload_file() {
  local abspath="$1"
  [[ ! -f "$abspath" ]] && { echo "ERR|nofile|0|$abspath"; return 1; }

  local file_name size mime
  file_name="$(basename "$abspath")"
  size=$(stat -c%s "$abspath")
  mime="$(get_mime_type "$abspath")"

  # ---- 1. Request upload slot ----
  local req_json
  req_json=$(printf '{"file_name":"%s","file_size":%s,"use_case":"multimodal","timezone_offset_min":-120}' "$file_name" "$size")

  local upload_json
  upload_json="$(curl -sS -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
    ${ANON:+--socks5-hostname 127.0.0.1:9050} \
    -X POST \
    -A "$(random_user_agent)" \
    -H "accept: */*" \
    -H "accept-language: it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7" \
    -H "accept-encoding: identity" \
    -H "content-type: application/json" \
    -H "cache-control: no-cache" \
    -H "oai-client-version: prod-9d358314d30a26d59ec2f2390d079c86e2c0018f" \
    -H "oai-device-id: ${OAI_DID:-b83b32ec-805f-44f9-b36e-1007cbcb734e}" \
    -H "oai-language: it-IT" \
    -H "pragma: no-cache" \
    -H "priority: u=1, i" \
    -H "sec-ch-ua: \"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"" \
    -H "sec-ch-ua-mobile: ?0" \
    -H "sec-ch-ua-platform: \"Windows\"" \
    -H "sec-fetch-dest: empty" \
    -H "sec-fetch-mode: cors" \
    -H "sec-fetch-site: same-origin" \
    -H "referer: https://chatgpt.com/" \
    -H "origin: https://chatgpt.com" \
    ${ACCESS_TOKEN:+-H "authorization: Bearer $ACCESS_TOKEN"} \
    --tls13-ciphers 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256' \
    --curves 'X25519:P-256' \
    --data "$req_json" \
    "https://chatgpt.com/backend-anon/files")"

  local upload_url file_id
  upload_url="$(json_extract upload_url "$upload_json")"
  file_id="$(json_extract file_id "$upload_json")"
  [[ -z "$file_id" || -z "$upload_url" ]] && { echo "ERR|uploadmeta"; return 1; }

  # ---- 2. Upload binary to Azure blob ----
  curl -sS -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
    ${ANON:+--socks5-hostname 127.0.0.1:9050} \
    -X PUT \
    -A "$(random_user_agent)" \
    -H "accept: application/json, text/plain, */*" \
    -H "accept-encoding: identity" \
    -H "content-type: $mime" \
    -H "x-ms-blob-type: BlockBlob" \
    -H "x-ms-version: 2020-04-08" \
    --data-binary @"$abspath" \
    "$upload_url" >/dev/null || return 1

  # ---- 3. Finalize upload ----
  local finalize_json
  finalize_json=$(printf '{"file_id":"%s","use_case":"multimodal","index_for_retrieval":false,"file_name":"%s"}' "$file_id" "$file_name")

  curl -sS -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
    ${ANON:+--socks5-hostname 127.0.0.1:9050} \
    -X POST \
    -A "$(random_user_agent)" \
    -H "accept: */*" \
    -H "accept-language: it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7" \
    -H "accept-encoding: identity" \
    -H "content-type: application/json" \
    -H "cache-control: no-cache" \
    -H "oai-client-version: prod-9d358314d30a26d59ec2f2390d079c86e2c0018f" \
    -H "oai-device-id: ${OAI_DID:-b83b32ec-805f-44f9-b36e-1007cbcb734e}" \
    -H "oai-language: it-IT" \
    -H "pragma: no-cache" \
    -H "priority: u=1, i" \
    -H "sec-ch-ua: \"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"" \
    -H "sec-ch-ua-mobile: ?0" \
    -H "sec-ch-ua-platform: \"Windows\"" \
    -H "sec-fetch-dest: empty" \
    -H "sec-fetch-mode: cors" \
    -H "sec-fetch-site: same-origin" \
    -H "referer: https://chatgpt.com/" \
    -H "origin: https://chatgpt.com" \
    ${ACCESS_TOKEN:+-H "authorization: Bearer $ACCESS_TOKEN"} \
    --tls13-ciphers 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256' \
    --curves 'X25519:P-256' \
    --data "$finalize_json" \
    "https://chatgpt.com/backend-anon/files/process_upload_stream" >/dev/null

  # ---- 4. Compute width/height if image ----
  local w= h=
  if [[ "$mime" =~ ^image ]]; then
    if command -v identify >/dev/null 2>&1; then
      read w h < <(identify -format "%w %h" "$abspath" 2>/dev/null)
    else
      # fallback using file command
      read w h < <(file "$abspath" | sed -n 's/.*, \([0-9]\+\) x \([0-9]\+\).*/\1 \2/p' | head -n1)
    fi
  fi

  echo "$file_id|$mime|$size|$file_name|${w:-219}|${h:-212}"
}





# ---- parse assistant text from SSE dump (heuristic) ----
extract_final_text() {
  # Grab the last assistant "message" parts[0]
  # 1) keep only lines with "data:"
  # 2) find the last JSON blob that contains `"message":{"id":...,"author":{"role":"assistant"...`
  # 3) extract parts[0]
  awk '/^data: /{sub(/^data: /,""); print}' \
  | sed -n '/"author":{"role":"assistant"/,$p' \
  | tail -n +1 \
  | sed -n 's/.*"parts"\s*:\s*\[\s*"\(.*\)"]\s*.*/\1/p' \
  | sed 's/\\"/"/g; s/\\n/\n/g; s/\\t/\t/g; s/\\\\/\\/g' \
  | tail -n 1
}

decode_json_escapes() {
  awk '
    function to_utf8(c, out) {
      if (c < 0x80) out = sprintf("%c", c)
      else if (c < 0x800)
        out = sprintf("%c%c", 0xC0 + int(c / 64), 0x80 + (c % 64))
      else if (c < 0x10000)
        out = sprintf("%c%c%c",
                      0xE0 + int(c / 4096),
                      0x80 + (int(c / 64) % 64),
                      0x80 + (c % 64))
      else
        out = sprintf("%c%c%c%c",
                      0xF0 + int(c / 262144),
                      0x80 + (int(c / 4096) % 64),
                      0x80 + (int(c / 64) % 64),
                      0x80 + (c % 64))
      return out
    }

    function decode_unicode(line, lead, trail, cp, hex) {
      while (match(line, /\\u[dD][89aAbB][0-9a-fA-F]{2}\\u[dD][c-fC-F][0-9a-fA-F]{2}/)) {
        lead = strtonum("0x" substr(line, RSTART+2, 4))
        trail = strtonum("0x" substr(line, RSTART+8, 4))
        cp = 0x10000 + (and(lead, 0x3FF) * 0x400) + and(trail, 0x3FF)
        line = substr(line, 1, RSTART-1) to_utf8(cp) substr(line, RSTART + RLENGTH)
      }
      while (match(line, /\\u[0-9a-fA-F]{4}/)) {
        hex = substr(line, RSTART+2, 4)
        line = substr(line, 1, RSTART-1) to_utf8(strtonum("0x" hex)) substr(line, RSTART + RLENGTH)
      }
      return line
    }

    {
      out = decode_unicode($0)
      gsub(/\\\\/, "\\", out)
      gsub(/\\"/, "\"", out)
      gsub(/\\n/, "\n", out)
      # gsub(/\\r/, "\r", out)
      gsub(/\\t/, "\t", out)
      printf "%s", out
    }
  '
}



stream_tokens() {

  local temp=$parent_message_id
  parent_message_id=""
  echo $parent_message_id > $PARENT_MSG_ID_FILE
  local red=0
    
  

  while IFS= read -r line; do
    [ $red -eq 0 ] && [ $CMDLINE_ -eq 0 ] && echo -e -n "\b\b\b\b   \n";
    ((red++))
    
    # echo "$line"
    # echo ============
    new_id=$(echo "$line" | sed -En 's/.*"conversation_id": "([^"]+)".*/\1/p')
    if [[ -n "$new_id" && "$conversation_id" == "" ]]; then
      conversation_id="$new_id"
      echo $conversation_id > $CONV_ID_FILE
    fi
    new_id=$(echo "$line" | sed -En 's/.*"message_id": "([^"]+)".*/\1/p')
    if [[ -n "$new_id" && "$parent_message_id" == "" ]]; then
      parent_message_id="$new_id"
      echo $parent_message_id > $PARENT_MSG_ID_FILE
      
    fi
    # echo "$conversation_id" cid
    # echo "$parent_message_id" pmi


  printf '%s\n' "$line" | awk '
  /^data:/ {
    payload = substr($0, 6)
    gsub(/^[[:space:]]+|[[:space:]]+$/, "", payload)

    # Skip empty, [DONE], or metadata lines
    if (payload == "" || payload == "[DONE]" || payload == "v1") next
    if (payload !~ /^\{.*\}$/) next

    # Skip prompt chunks
    if (payload ~ /"parts"[[:space:]]*:[[:space:]]*\[/) next

    # Case 1: simple {"o":"append","v":"..."}
    if (match(payload, /"o"[[:space:]]*:[[:space:]]*"append"[[:space:]]*,[[:space:]]*"v"[[:space:]]*:[[:space:]]*"(([^"\\]|\\.)*)"/, m)) {
      printf "%s", m[1]
      fflush()
      next
    }

    # Case 2: patch list [{"o":"append","v":"..."}...]
    while (match(payload, /"o"[[:space:]]*:[[:space:]]*"append"[[:space:]]*,[[:space:]]*"v"[[:space:]]*:[[:space:]]*"(([^"\\]|\\.)*)"/, m)) {
      printf "%s", m[1]
      fflush()
      payload = substr(payload, RSTART + RLENGTH)
    }

    # Case 3: message object with parts array
    if (match(payload, /"parts"[[:space:]]*:[[:space:]]*\[([^\]]*)\]/, parts)) {
      p = parts[1]
      gsub(/["\\,]/, "", p)
      printf "%s", p
      fflush()
      next
    }

    # Case 4: {"v":{"v":"text"}} or {"v":"text"}
    while (match(payload, /"v"[[:space:]]*:[[:space:]]*"(([^"\\]|\\.)+)"/, mv)) {
      v = mv[1]
      if (v != "append" && v != "patch") {
        printf "%s", v
        fflush()
      }
      payload = substr(payload, RSTART + RLENGTH)
    }
  }
' | {
      # Here you can pipe chunk output to other commands live
      if [[ "$1" == "decode" ]]; then
        decode_json_escapes | sed s/finished_successfully//
        # tee
      else
        tee
      fi
    }
  done
  


  if [ $red -lt 3 ]; then
    parent_message_id=$temp
    echo $parent_message_id > $PARENT_MSG_ID_FILE
  fi
}


# ---- send request (core) ----
send_request() {
  local prompt="$1" stream="$2"
  local started_ms; started_ms=$(now_ms)

  echo -e "\n[i] getting session cookies" 1>&2
  bootstrap_session &> /dev/null

  echo [i] getting chatReq 1>&2

  # 1) initial requirements
  local req_json; req_json="$(get_chat_requirements)"
  local is_force_login; is_force_login=$(echo "$req_json" | grep -o "force_login")
  
  [ -n "$is_force_login" ] && echo "$is_force_login"

  local req_token;
  local pw_required;
  local pw_seed;
  local pw_diff;

  # 2) extract values helper
  extract_values() {
    req_token=$(printf '%s' "$req_json" | sed -n 's/.*"token"\s*:\s*"\([^"]*\)".*/\1/p')
    pw_required=$(printf '%s' "$req_json" | json_extract_required)
    pw_seed=$(printf '%s' "$req_json" | json_extract_seed)
    pw_diff=$(printf '%s' "$req_json" | json_extract_diff)
  }

  extract_values

  # 3) Turnstile token
  local turnstile_token="$(base64 </dev/urandom | tr -d '\n' | head -c 64)"

  # 4) Handle forced login flow once
  if false; then
    echo "[i] chat-requirements/prepare /finalize flow" 1>&2
    
    req_json="$(get_chat_requirements_prepare)"
    local prepare_token=$(printf '%s' "$req_json" | sed -n 's/.*"prepare_token"\s*:\s*"\([^"]*\)".*/\1/p')

    extract_values  # refresh pw seed/diff for prepare call
    proof_token="$(make_proof_token "$pw_seed" "$pw_diff" "$started_ms" "$OAI_DID")"

    # finalize → tokens updated
    req_json="$(get_finalize "$prepare_token" "$proof_token" "$turnstile_token")"
    
    is_force_login=$(echo "$req_json" | grep -o "force_login")
    [ -n "$is_force_login" ] && echo "$is_force_login"

    extract_values  # final update
  else
    echo "[i] /chat-requirements flow" 1>&2
  fi

  # 5) Compute proof token after all requirement fetching
  local proof_token=""
  if [ "$pw_required" = "true" ] && [ -n "${pw_seed:-}" ] && [ -n "${pw_diff:-}" ]; then
    proof_token="$(make_proof_token "$pw_seed" "$pw_diff" "$started_ms" "$OAI_DID")"
  fi



  # 5) Build message body
  # local body; body="$(build_conv_body "$prompt" "" "")"
  # echo "$conversation_id" "$parent_message_id" cid pmi
  
  local body; body="$(build_conv_body "$prompt" "$conversation_id" "$parent_message_id")"

  # echo $body
  # exit

  echo [i] chat... 1>&2
  

  # 5) hit conversation endpoint
  local url="https://chatgpt.com/backend-anon/f/conversation"

  if [ "$stream" = "1" ]; then
    # STREAMING
    # curl -sS -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
    #   ${ANON:+--socks5-hostname 127.0.0.1:9050} \
    #   -A "$(random_user_agent)" \
    #   -H "accept: text/event-stream" \
    #   -H "content-type: application/json" \
    #   -H "oai-client-version: $OAI_CLIENT_VERSION" \
    #   -H "oai-device-id: $OAI_DID" \
    #   -H "oai-language: en-US" \
    #   -H "openai-sentinel-chat-requirements-token: $req_token" \
    #   ${proof_token:+-H "openai-sentinel-proof-token: $proof_token"} \
    #   --data "$body" \
    #   "$url" | stream_tokens "decode"
    
    # stream_tokens "decode" < <(
    #   curl -sS -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
    #     ${ANON:+--socks5-hostname 127.0.0.1:9050} \
    #     -A "$(random_user_agent)" \
    #     -H "accept: text/event-stream" \
    #     -H "content-type: application/json" \
    #     -H "oai-client-version: $OAI_CLIENT_VERSION" \
    #     -H "oai-device-id: $OAI_DID" \
    #     -H "oai-language: en-US" \
    #     -H "openai-sentinel-chat-requirements-token: $req_token" \
    #     --tls13-ciphers 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256' \
    #     --curves 'X25519:P-256' \
    #     ${proof_token:+-H "openai-sentinel-proof-token: $proof_token"} \
    #     --data "$body" \
    #     "$url" 2>&1
    #   )


      fifo=$(mktemp ${TMP_DIR}fifo.XXXXXX)
      rm "$fifo"
      mkfifo "$fifo"

      # trap 'rm -f "$fifo"; kill $(jobs -p) 2>/dev/null' EXIT

      cat "$fifo" &

      stream_tokens "decode" < <(
        curl -sS -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
          ${ANON:+--socks5-hostname 127.0.0.1:9050} \
          -A "$(random_user_agent)" \
          -H "accept: text/event-stream" \
          -H "content-type: application/json" \
          -H "oai-client-version: $OAI_CLIENT_VERSION" \
          -H "oai-device-id: $OAI_DID" \
          -H "oai-language: en-US" \
          -H "openai-sentinel-chat-requirements-token: $req_token" \
          ${proof_token:+-H "openai-sentinel-proof-token: $proof_token"} \
          --tls13-ciphers 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256' \
          --curves 'X25519:P-256' \
          --data "$body" \
          "$url" 2>&1 | tee >(
            grep -E '^(\{|[^a-zA-Z])' > "$fifo"
          )
      )

    


        #   curl -sS -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
        # ${ANON:+--socks5-hostname 127.0.0.1:9050} \
        # -A "$(random_user_agent)" \
        # -H "accept: text/event-stream" \
        # -H "content-type: application/json" \
        # -H "oai-client-version: $OAI_CLIENT_VERSION" \
        # -H "oai-device-id: $OAI_DID" \
        # -H "oai-language: en-US" \
        # -H "openai-sentinel-chat-requirements-token: $req_token" \
        # --tls13-ciphers 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256' \
        # --curves 'X25519:P-256' \
        # ${proof_token:+-H "openai-sentinel-proof-token: $proof_token"} \
        # --data "$body" \
        # "$url"

    printf '\n'
    
  else
    # NON-STREAMING: still SSE, but we collect and extract the final text
    # sse="$(curl -sS -N --location --compressed -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
    #   ${ANON:+--socks5-hostname 127.0.0.1:9050} \
    #   -A "$(random_user_agent)" \
    #   -H "accept: text/event-stream" \
    #   -H "content-type: application/json" \
    #   -H "oai-client-version: $OAI_CLIENT_VERSION" \
    #   -H "oai-device-id: $OAI_DID" \
    #   -H "oai-language: en-US" \
    #   -H "openai-sentinel-chat-requirements-token: $req_token" \
    #   ${proof_token:+-H "openai-sentinel-proof-token: $proof_token"} \
    #   --data "$body" \
    #   "$url" | stream_tokens "x" | decode_json_escapes)"
      sse="$(
    stream_tokens "x" < <(
      curl -sS -N --location --compressed \
        -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
        ${ANON:+--socks5-hostname 127.0.0.1:9050} \
        -A "$(random_user_agent)" \
        -H "accept: text/event-stream" \
        -H "content-type: application/json" \
        -H "oai-client-version: $OAI_CLIENT_VERSION" \
        -H "oai-device-id: $OAI_DID" \
        -H "oai-language: en-US" \
        -H "openai-sentinel-chat-requirements-token: $req_token" \
        --tls13-ciphers 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256' \
        --curves 'X25519:P-256' \
        ${proof_token:+-H "openai-sentinel-proof-token: $proof_token"} \
        --data "$body" \
        "$url"
    ) | decode_json_escapes
  )"

      # exit
      # echo $url
      printf '%s\n' "$sse" 
      # printf '%s\n' "$sse" | extract_final_text
  fi

}

# ---- CLI ----
usage() {
  cat <<EOF
Usage: $0 [-s] [-p "prompt"]

  -p "text" | "text"  One-shot mode: send this prompt and print the answer.
  -s                  Streaming mode (default is non-streaming).
  -r                  Session reset
  -f                  Force Tor IP rotation
  -t                  Rotate Tor IP and test tor connection
  -q                  Hide detailed logs
  -h                  Help.

In interactive mode:
  /exit       Quit
  /reset      Start a new conversation (local only; new parent)
EOF
}

session_reset() {
  rm -f "$CONV_ID_FILE" "$PARENT_MSG_ID_FILE" "$COOKIE_JAR" "$OAI_DID_FILE"; 
  conversation_id=''; parent_message_id=''; 
  OAI_DID="$(uuid_v4)"
  echo $OAI_DID > $OAI_DID_FILE
  echo session reset 1>&2;
}

STREAM=1
FORCE_TOR_ROTATION=0
PROMPT=""
ANON=
TEST_MODE=0
QUIET=0
CMDLINE_=0
SESSION_RESET=0

export conversation_id="$(cat $CONV_ID_FILE 2>/dev/null || echo -n '')"
export parent_message_id="$(cat $PARENT_MSG_ID_FILE 2>/dev/null || echo -n '')"

while getopts ":fasp:htqr" opt; do
  case "$opt" in
    f) FORCE_TOR_ROTATION=1 ;;
    a) ANON=1 ;;
    s) STREAM=1 ;;
    q) QUIET=1 ;;
    p) PROMPT="$OPTARG" ;;
    t) TEST_MODE=1; echo "tor test" ;;
    r) SESSION_RESET=1 ;;
    h) usage; exit 0 ;;
    \?) echo "Unknown option: -$OPTARG" >&2; usage; exit 1 ;;
    :) echo "Option -$OPTARG requires an argument." >&2; exit 1 ;;
  esac
done



if [[ $QUIET -eq 1 ]]; then
  exec 2>/dev/null
fi
if [[ $SESSION_RESET -eq 1 ]]; then
  session_reset
fi

if [[ $TEST_MODE -eq 1 ]]; then
  check_tor
fi

# Now enforce order manually:
if [[ $FORCE_TOR_ROTATION -eq 1 ]]; then
  echo "forcing tor rotation"
  tor_function "$FORCE_TOR_ROTATION" 1>&2
elif [[ $ANON -eq 1 ]]; then
  tor_function "$FORCE_TOR_ROTATION" 1>&2
fi

shift $((OPTIND-1))

if [ -n "$PROMPT" ] || [ -n "$1" ]; then
  CMDLINE_=1
  send_request "${PROMPT:-$*}" "$STREAM"
  exit $?
fi

# chatgpt-cli.sh
# Interactive
# printf '\n==========================\n[SkaiFall]\nOpenAI ChatGPT Free LLM\n==========================\n'
printf '\n===========================================\n'
printf '                 [ tooai ]\n'
printf '      OpenAI ChatGPT API-Free CLI Tool\n'
printf '===========================================\n\n'

printf 'Chat ready. Type your prompt.\nType "/exit" to quit or /reset to start a new conversation\n'
printf 'paths::/path/to/file[|/path/to/another/file...]::your prompt\n'
printf 'b64::base64-data-string,[filename][|base64-data-string2,[filename2]...]::your prompt\n'
echo
echo cid $conversation_id - pmi $parent_message_id - oaidid $OAI_DID 1>&2


while :; do
  # printf '\nYou:\n> '
  echo -e -n "\n▐\e[7m You\e[0m▌ "
  IFS= read -r line || break
  case "${line,,}" in
    "/exit") echo "Bye"; exit 0 ;;
    "/reset") echo "** New conversation started **" ; conversation_id=""; parent_message_id=""; continue ;; # stateless anon; just cosmetic
    "") continue ;;
  esac
  # printf '\nAI:\n...'
  # echo -e -n "\n▐\e[7m  AI\e[0m▌\n..."
  echo -e -n "\n\e[36m▐\e[7m  AI\e[0m\e[36m▌\e[0m\n..."

  send_request "$line" "$STREAM"
  # echo cid $conversation_id - pmi $parent_message_id - oaidid $OAI_DID 1>&2
done




