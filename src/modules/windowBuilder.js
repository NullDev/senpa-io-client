"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const path = require("node:path");

const { app, BrowserWindow, shell, ipcMain } = require("electron");
const webBlocker = require("electron-web-blocker");

const env = process.env?.NODE_ENV || "development";

/**
 * Build browser window.
 *
 * @class WindowBuilder
 */
class WindowBuilder {
    /**
     * List of window options.
     *
     * @static
     * @getter
     * @ignore
     * @returns {import("electron").BrowserWindowConstructorOptions}
     * @memberof WindowBuilder
     */
    static get #mainWindowOptions(){
        return {
            width: 1600,
            height: 950,
            autoHideMenuBar: true,
            show: false,
            center: true,
            title: "Senpa.io :: Official Client",
            fullscreen: false,
            webPreferences: {
                preload: path.join(__dirname, "../scripts/preload.js"),
                contextIsolation: false,
                nodeIntegration: false,
                spellcheck: false,
                devTools: env === "development",
            },
        };
    }

    /**
     * List of window options.
     *
     * @static
     * @getter
     * @ignore
     * @returns {import("electron").BrowserWindowConstructorOptions}
     * @memberof WindowBuilder
     */
    static get #splashWindowOptions(){
        return {
            width: 600,
            height: 300,
            center: true,
            resizable: false,
            show: false,
            frame: false,
            fullscreenable: false,
            transparent: true,
            webPreferences: {
                contextIsolation: false,
                nodeIntegration: false,
                spellcheck: false,
                devTools: env === "development",
            },
        };
    }

    /**
     * Initialize the web blocker.
     *
     * @static
     * @ignore
     * @returns {Promise<any>}
     * @memberof WindowBuilder
     */
    static async #initBlocker(){
        return await webBlocker.init({
            updateNow: true,
            blacklist: [
                "doubleclick.net",
                "*.doubleclick.net",
                "doubleclick.com",
                "*.doubleclick.com",
                "googlesyndication.com",
                "*.googlesyndication.com",
                "gameads.io",
                "*.gameads.io",
                "googleadservices.com",
                "*.googleadservices.com",
                "adservice.google.*",
                "adsense.google.com",
                "doubleclickbygoogle.com",
                "*.doubleclickbygoogle.com",
            ],
        });
    }

    /**
     * Create the splash screen.
     *
     * @static
     * @ignore
     * @returns {BrowserWindow}
     * @memberof WindowBuilder
     */
    static #splashScreen(){
        const win = new BrowserWindow(WindowBuilder.#splashWindowOptions);
        win.loadFile(path.join(__dirname, "..", "layout", "splash.html"));
        return win;
    }

    /**
     * Create the main screen.
     *
     * @static
     * @ignore
     * @returns {BrowserWindow}
     * @memberof WindowBuilder
     */
    static #mainWindow(){
        const win = new BrowserWindow(WindowBuilder.#mainWindowOptions);

        if (env !== "development"){
            win.removeMenu();
            win.setMenuBarVisibility(false);
        }

        let fullscreen = false;
        ipcMain.on("togglefullscreen", () => {
            if (fullscreen){ // Toggle Off
                win.setFullScreen(false);
                win.setAlwaysOnTop(true, "floating");
            }
            else { // Toggle On
                win.setAlwaysOnTop(true, "screen-saver");
                win.setFullScreen(true);
            }
            fullscreen = !fullscreen;
        });

        win.loadURL("https://senpa.io/web", {
            extraHeaders: `x-senpa-io-client-version: ${app.getVersion()}\n`,
        });

        webBlocker.filter(win);

        win.once("close", () => win.destroy());

        win.webContents.on("will-navigate", (event, url) => {
            event.preventDefault();
            (url.startsWith("https://senpa.io") && !url.endsWith("privacy.txt") && !url.endsWith("terms.txt"))
                ? win.loadURL(url)
                : shell.openExternal(url);
        });

        return win;
    }

    /**
     * Wait for a given amount of milliseconds.
     *
     * @static
     * @ignore
     * @returns {Promise<any>}
     * @memberof WindowBuilder
     */
    static #sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Prepare and create the browser windows.
     *
     * @static
     * @public
     * @memberof WindowBuilder
     */
    static createWindow(){
        const splash = WindowBuilder.#splashScreen();
        const main = WindowBuilder.#mainWindow();

        splash.once("ready-to-show", () => {
            splash.show();
            splash.focus();

            // Wait for blocker to be initialized.
            // Or, if it initializes "too fast",
            // wait 3 seconds to show the splash screen.
            Promise.all([
                WindowBuilder.#sleep(3000),
                WindowBuilder.#initBlocker(),
            ]).then(() => {
                splash.close();
                main.show();
                main.focus();
            });
        });
    }
}

module.exports = WindowBuilder;
