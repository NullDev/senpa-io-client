"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

require("v8-compile-cache");

const { app } = require("electron");

const CliSwitches = require("./modules/cliSwitches");
const WindowBuilder = require("./modules/windowBuilder");

console.log(`
   ____                           _       
  / ___|  ___ _ __  _ __   __ _  (_) ___  
  \\___ \\ / _ \\ '_ \\| '_ \\ / _\` | | |/ _ \\ 
   ___) |  __/ | | | |_) | (_| |_| | (_) |
  |____/ \\___|_| |_| .__/ \\__,_(_)_|\\___/ 
                   |_|                    

Senpa.io :: Official Client v${app.getVersion()}
{ Electron: ${process.versions.electron}, Node: ${process.versions.node}, Chromium: ${process.versions.chrome} }
`);

// Preparation
app.userAgentFallback = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Electron/10.4.7 Safari/537.36";
app.setAppUserModelId(process.execPath);

CliSwitches.applySwitches(app);

app.once("ready", () => WindowBuilder.createWindow());

app.on("quit", () => app.quit());

app.on("window-all-closed", () => ((process.platform !== "darwin")
    ? app.quit()
    : null
));
