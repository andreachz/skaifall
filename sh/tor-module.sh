#!/usr/bin/env bash

# ===== CONFIGURATION =====
TOR_BIN="/usr/sbin/tor"
TOR_SOCKS_PORT=9050
TOR_CONTROL_PORT=9051
TOR_DATA_DIR="/tmp/tor_data"
INTERVAL=60

# ===== START TOR =====
echo "[*] Starting Tor..."
mkdir -p "$TOR_DATA_DIR"

"$TOR_BIN" \
    --RunAsDaemon 1 \
    --SocksPort $TOR_SOCKS_PORT \
    --ControlPort $TOR_CONTROL_PORT \
    --CookieAuthentication 1 \
    --DataDirectory "$TOR_DATA_DIR"

# Wait for Tor to bootstrap
echo "[*] Waiting for Tor to start..."
until nc -z 127.0.0.1 $TOR_SOCKS_PORT >/dev/null 2>&1; do
    sleep 1
done
echo "[+] Tor started (SOCKS on $TOR_SOCKS_PORT, Control on $TOR_CONTROL_PORT)"

# ===== FUNCTION TO CHANGE IP =====
change_tor_ip() {
    COOKIE_FILE="$TOR_DATA_DIR/control_auth_cookie"
    if [[ ! -f "$COOKIE_FILE" ]]; then
        echo "[!] Control cookie not found: $COOKIE_FILE"
        return 1
    fi
    COOKIE_HEX=$(xxd -p "$COOKIE_FILE" | tr -d '\n')
    echo -e "AUTHENTICATE \"$COOKIE_HEX\"\r\nSIGNAL NEWNYM\r\nQUIT\r\n" | nc 127.0.0.1 $TOR_CONTROL_PORT >/dev/null
    echo "[+] New Tor circuit requested at $(date)"
}

# ===== MAIN LOOP =====
while true; do
    # Test current IP
    CURRENT_IP=$(curl --socks5 127.0.0.1:$TOR_SOCKS_PORT -s https://check.torproject.org/api/ip | jq -r .IP 2>/dev/null)
    echo "Current IP: ${CURRENT_IP:-unknown}"

    # Change IP
    change_tor_ip

    # Wait for next interval
    sleep $INTERVAL
done
