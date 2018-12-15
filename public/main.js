const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const jetpack = require("fs-jetpack");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1600, height: 900 });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Set up ipcMain to interact with the renderer process
// Stored files are here by default
console.log(app.getPath("userData")); // C:\Users\hanchang\AppData\Roaming\collector-on-electron

console.log(process.cwd()); // E:\webdev\collector-on-electron

const d = new Date();

const dateStamp = `${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}`;

ipcMain.on("load-context", (event, arg) => {
  const items =
    jetpack
      .dir("context-persist")
      .read("collector-context-items.json", "json") || [];

  const todItemID =
    jetpack.dir("context-persist").read("collector-context-tod.json", "json") ||
    "";

  event.sender.send("send-context", { items, todItemID });
});

ipcMain.on("persist-items", (event, arg) => {
  jetpack
    .dir("context-persist")
    .file(`${dateStamp}-collector-context-items.json`, { content: arg });
  jetpack
    .dir("context-persist")
    .file("collector-context-items.json", { content: arg });

  event.sender.send("report", "Saved items in the context-persist folder");
});

ipcMain.on("persist-tod-item-ID", (event, arg) => {
  jetpack
    .dir("context-persist")
    .file(`${dateStamp}-collector-context-tod.json`, { content: arg });
  jetpack
    .dir("context-persist")
    .file("collector-context-tod.json", { content: arg });

  event.sender.send(
    "report",
    "Saved TOD item ID in the context-persist folder"
  );
});

ipcMain.on("drop-native-image", (event, arg) => {
  const findImage = jetpack
    .dir("public")
    .dir("images")
    .exists(arg.name);

  if (!findImage) {
    jetpack
      .dir("public")
      .dir("images")
      .copy(arg.path, arg.name);
  }

  event.sender.send("has-image", arg.name);
});
