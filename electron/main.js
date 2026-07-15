/**
 * LeifLike Design — Desktop-Wrapper.
 * Nutzt den Next-Dev-Server (startet ihn bei Bedarf selbst) und
 * öffnet den Lichttisch als eigenes Fenster.
 *
 *   npm run desktop
 */
const { app, BrowserWindow, shell } = require("electron");
const { spawn } = require("child_process");
const http = require("http");
const path = require("path");

const URL = "http://localhost:3000";
let devProcess = null;

function ping(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(res.statusCode < 500);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function ensureServer() {
  if (await ping(URL)) return;
  devProcess = spawn("npm", ["run", "dev"], {
    cwd: path.join(__dirname, ".."),
    stdio: "inherit",
    shell: true,
  });
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await ping(URL)) return;
  }
  throw new Error("Dev-Server nicht erreichbar (Port 3000)");
}

async function createWindow() {
  await ensureServer();
  const win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 900,
    minHeight: 600,
    title: "LeifLike Design",
    backgroundColor: "#fdf7fb",
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true },
  });
  win.loadURL(URL);
  // Externe Links (Instagram, Mail) im System-Browser öffnen
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (devProcess) devProcess.kill();
  app.quit();
});
