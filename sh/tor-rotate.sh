#!/usr/bin/env bash
set -euo pipefail

# ===============================
# Config
# ===============================
TOR_SOCKS_PORT=9050
TOR_CONTROL_PORT=9051
TOR_TMP_DIR="/tmp/embedded_tor"
TOR_BIN="$TOR_TMP_DIR/tor"
TOR_DATA_DIR="$TOR_TMP_DIR/data"
ROTATION_LOG="$TOR_TMP_DIR/last_rotation"
ROTATION_INTERVAL=500  # seconds

# ===============================
# Embedded tor binary (base64)
# ===============================
TOR_BASE64="__TOR_BASE64_PLACEHOLDER__"

# ===============================
# Helper: start tor if not running
# ===============================
start_tor_if_needed() {
    if pgrep -x tor >/dev/null 2>&1; then
        echo "[*] Tor is already running."
        return 0
    fi

    echo "[*] No Tor process found. Starting embedded Tor..."
    mkdir -p "$TOR_DATA_DIR"

    if [[ "$TOR_BASE64" == "__TOR_BASE64_PLACEHOLDER__" ]]; then
        echo "[!] ERROR: Replace __TOR_BASE64_PLACEHOLDER__ with your Tor binary in base64 format."
        exit 1
    fi

    mkdir -p "$TOR_TMP_DIR"
    echo "[*] Writing Tor binary to $TOR_BIN"
    echo "$TOR_BASE64" | base64 -d > "$TOR_BIN"
    chmod +x "$TOR_BIN"

    "$TOR_BIN" \
        --RunAsDaemon 1 \
        --SocksPort $TOR_SOCKS_PORT \
        --ControlPort $TOR_CONTROL_PORT \
        --CookieAuthentication 1 \
        --DataDirectory "$TOR_DATA_DIR"

    echo "[+] Tor started in background. Waiting for it to become ready..."

    # Wait for SOCKS port
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

    if [[ -f "$ROTATION_LOG" ]]; then
        last_rotation=$(cat "$ROTATION_LOG")
    fi

    local elapsed=$((now - last_rotation))
    if (( elapsed < ROTATION_INTERVAL )); then
        echo "[*] Last rotation was $elapsed seconds ago (< $ROTATION_INTERVAL). Skipping."
        return 0
    fi

    echo "[*] Rotating Tor IP (elapsed: $elapsed seconds)..."
    local cookie_file="$TOR_DATA_DIR/control_auth_cookie"
    if [[ ! -f "$cookie_file" ]]; then
        echo "[!] control_auth_cookie not found: $cookie_file"
        return 1
    fi

    local cookie_hex
    cookie_hex=$(xxd -p "$cookie_file" | tr -d '\n')
    echo -e "AUTHENTICATE \"$cookie_hex\"\r\nSIGNAL NEWNYM\r\nQUIT\r\n" | nc 127.0.0.1 $TOR_CONTROL_PORT >/dev/null

    echo "$now" > "$ROTATION_LOG"
    echo "[+] Tor IP rotated at $(date)"
}

# ===============================
# Main
# ===============================
start_tor_if_needed
rotate_ip_if_due
