"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

require("v8-compile-cache");

const { app } = require("electron");

const CliSwitches = require("./modules/cliSwitches");
const WindowBuilder = require("./modules/windowBuilder");
const RPCHandler = require("./modules/rpcHandler");

const env = process.env?.NODE_ENV || "development";
process.env.APP_VERSION = require("../package.json").version;

console.log(`
   ____                           _       
  / ___|  ___ _ __  _ __   __ _  (_) ___  
  \\___ \\ / _ \\ '_ \\| '_ \\ / _\` | | |/ _ \\ 
   ___) |  __/ | | | |_) | (_| |_| | (_) |
  |____/ \\___|_| |_| .__/ \\__,_(_)_|\\___/ 
                   |_|                    

Senpa.io :: Official Client v${app.getVersion()}
{ Environment: ${env}, Version: ${process.env.APP_VERSION}, Electron: ${process.versions.electron}, Node: ${process.versions.node}, Chromium: ${process.versions.chrome}, V8: ${process.versions.v8} }
`);

// Preparation
app.userAgentFallback = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Electron/10.4.7 Safari/537.36";
app.setAppUserModelId(process.execPath);

CliSwitches.applySwitches(app);

const rpcHandler = new RPCHandler("996574143623479387");
rpcHandler.init();

app.once("ready", () => WindowBuilder.createWindow());

app.on("quit", async() => {
    await rpcHandler.destroy();
    app.quit();
});

app.on("window-all-closed", () => ((process.platform !== "darwin")
    ? app.quit()
    : null
));
