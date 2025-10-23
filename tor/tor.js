import fs from "fs";
import net from "net";
import axios from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";

const TOR_CONTROL_PORT = 9051;
const TOR_PROXY_PORT = 9050;
const COOKIE_PATH = "/run/tor/control.authcookie";

// Convert the binary cookie to hex
function getTorAuthCookie() {
  const cookie = fs.readFileSync(COOKIE_PATH);
  return cookie.toString("hex").toUpperCase();
}

// Send NEWNYM to Tor
function renewTorIdentity() {
  return new Promise((resolve, reject) => {
    const socket = net.connect(TOR_CONTROL_PORT, "127.0.0.1", () => {
      const cookieHex = getTorAuthCookie();
      socket.write(`AUTHENTICATE ${cookieHex}\r\n`);
      socket.once("data", (data) => {
        if (!data.toString().includes("250 OK")) {
          return reject(new Error("Authentication failed"));
        }
        socket.write("SIGNAL NEWNYM\r\n");
        socket.once("data", (res) => {
          socket.end();
          if (res.toString().includes("250 OK")) resolve();
          else reject(new Error("Tor did not accept NEWNYM"));
        });
      });
    });
    socket.on("error", reject);
  });
}

async function getIP() {
  const agent = new SocksProxyAgent(`socks5h://127.0.0.1:${TOR_PROXY_PORT}`);
  const res = await axios.get("https://api.ipify.org?format=json", {
    httpAgent: agent,
    httpsAgent: agent,
  });
  return res.data.ip;
}

async function main() {
  for (let i = 0; i < 3; i++) {
    await renewTorIdentity();
    console.log("Rotated Tor circuit...");
    await new Promise((r) => setTimeout(r, 4000)); // wait for Tor to establish a new circuit
    const ip = await getIP();
    console.log(`IP #${i + 1}: ${ip}`);
  }
}

main().catch(console.error);
