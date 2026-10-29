const fs = require("node:fs");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");
const { randomBytes } = require("node:crypto");
const root = path.resolve(__dirname, "..");
const web = path.join(root, "apps", "web");
const next = path.join(root, "node_modules", "next", "dist", "bin", "next");
const logs = path.join(root, ".local");
const url = "http://127.0.0.1:3100";

async function ready() {
  try {
    const health = await fetch(`${url}/api/health`, { signal: AbortSignal.timeout(1500) });
    if (!health.ok || (await health.text()) !== "OK") return false;
    const page = await fetch(`${url}/projects`, { signal: AbortSignal.timeout(1500) });
    return page.ok && (await page.text()).includes("OpenCut");
  } catch { return false; }
}

async function main() {
  if (!fs.existsSync(next)) throw new Error("Dependencies missing. Run: bun install --frozen-lockfile");
  fs.mkdirSync(logs, { recursive: true });
  const envFile = path.join(web, ".env.local");
  if (!fs.existsSync(envFile)) {
    const template = fs.readFileSync(path.join(web, ".env.example"), "utf8");
    fs.writeFileSync(envFile, template.replace("your_better_auth_secret", randomBytes(48).toString("base64")));
  }
  if (!(await ready())) {
    const env = { ...process.env, NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1" };
    if (!fs.existsSync(path.join(web, ".next", "BUILD_ID"))) {
      const build = spawnSync(process.execPath, [next, "build"], { cwd: web, env, stdio: "inherit", windowsHide: true });
      if (build.error || build.status !== 0) throw build.error || new Error("OpenCut build failed.");
    }
    const stdout = fs.openSync(path.join(logs, "stdout.log"), "a");
    const stderr = fs.openSync(path.join(logs, "stderr.log"), "a");
    const server = spawn(process.execPath, [next, "start", "--hostname", "127.0.0.1", "--port", "3100"], {
      cwd: web, env, detached: true, windowsHide: true, stdio: ["ignore", stdout, stderr],
    });
    server.on("error", error => console.error(error.message));
    fs.closeSync(stdout);
    fs.closeSync(stderr);
    server.unref();
    for (let attempt = 0; attempt < 30; attempt++) {
      if (await ready()) break;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    if (!(await ready())) throw new Error(`OpenCut did not start. See ${logs}\\stderr.log (port 3100 may be occupied).`);
  }
  console.log(`OpenCut is ready: ${url}/projects`);
  if (!process.argv.includes("--no-browser")) {
    // Open only the fixed local URL; no user input is passed to the shell.
    const browser = spawn("cmd.exe", ["/d", "/c", "start", "", `${url}/projects`], { detached: true, windowsHide: true, stdio: "ignore" });
    browser.unref();
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
