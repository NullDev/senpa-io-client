"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const path = require("node:path");

const { app, BrowserWindow, shell } = require("electron");
const webBlocker = require("electron-web-blocker");

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
     * @returns {Object}
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
            fullscreenable: true,
            webPreferences: {
                preload: path.join(__dirname, "../scripts/preload.js"),
                contextIsolation: false,
                nodeIntegration: false,
                spellcheck: false,
                devTools: false
            }
        };
    }

    /**
     * List of window options.
     *
     * @static
     * @getter
     * @returns {Object}
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
                devTools: false
            }
        };
    }

    /**
     * Initialize the web blocker.
     *
     * @static
     * @returns {Promise<any>}
     * @memberof WindowBuilder
     */
    static #initBlocker(){
        return webBlocker.init({
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
                "*.doubleclickbygoogle.com"
            ]
        });
    }

    /**
     * Create the splash screen.
     *
     * @static
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
     * @returns {BrowserWindow}
     * @memberof WindowBuilder
     */
    static #mainWindow(){
        const win = new BrowserWindow(WindowBuilder.#mainWindowOptions);

        win.removeMenu();
        win.setMenuBarVisibility(false);
        win.loadURL("https://senpa.io/web", {
            extraHeaders: `x-senpa-io-client-version: ${app.getVersion()}\n`
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
                WindowBuilder.#initBlocker()
            ]).then(() => {
                splash.close();
                main.show();
                main.focus();
            });
        });
    }
}

module.exports = WindowBuilder;
