#!/usr/bin/env node
// Frees the dev ports before `yarn dev`.
// 1. `docker compose down` releases ports held by our own containers.
// 2. Anything else still listening on a dev port gets killed — except Docker
//    itself, whose backend proxy must never be killed from here.

const { execSync } = require("child_process");

const PORTS = [80, 3000, 8000, 5432, 9000, 9001];
const NEVER_KILL = /docker|vpnkit|wslrelay|system idle|^system$/i;

function sh(cmd) {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString();
  } catch {
    return "";
  }
}

console.log("[free-ports] stopping existing compose stack (if any)...");
sh("docker compose down --remove-orphans");

// pid -> Set of dev ports it is listening on
function findListeners() {
  const map = new Map();
  if (process.platform === "win32") {
    for (const line of sh("netstat -ano -p TCP").split(/\r?\n/)) {
      const m = line.match(/^\s*TCP\s+\S+:(\d+)\s+\S+\s+LISTENING\s+(\d+)/);
      if (!m) continue;
      const port = Number(m[1]);
      const pid = Number(m[2]);
      if (!PORTS.includes(port) || pid <= 4) continue;
      if (!map.has(pid)) map.set(pid, new Set());
      map.get(pid).add(port);
    }
  } else {
    for (const port of PORTS) {
      for (const pid of sh(`lsof -ti tcp:${port} -sTCP:LISTEN`).split(/\s+/)) {
        if (!pid) continue;
        const n = Number(pid);
        if (!map.has(n)) map.set(n, new Set());
        map.get(n).add(port);
      }
    }
  }
  return map;
}

function processName(pid) {
  if (process.platform === "win32") {
    const m = sh(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`).match(/^"([^"]+)"/);
    return m ? m[1] : "";
  }
  return sh(`ps -p ${pid} -o comm=`).trim();
}

let killed = 0;
for (const [pid, ports] of findListeners()) {
  const name = processName(pid);
  const portList = [...ports].join(", ");
  if (NEVER_KILL.test(name)) {
    console.warn(
      `[free-ports] skipping ${name} (pid ${pid}) on port(s) ${portList} — Docker/system process`
    );
    continue;
  }
  console.log(`[free-ports] killing ${name || "pid " + pid} (pid ${pid}) on port(s) ${portList}`);
  if (process.platform === "win32") {
    sh(`taskkill /F /T /PID ${pid}`);
  } else {
    sh(`kill -9 ${pid}`);
  }
  killed++;
}

console.log(`[free-ports] done — ${killed} process(es) killed, ports clear`);
