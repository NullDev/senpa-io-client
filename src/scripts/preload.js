"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const { ipcRenderer } = require("electron");

const BANNER_IDS = [
    "#gameadsbanner",
    "#banner_ad_bottom",
    "#ad-slot-center-panel",
];

const MAY_APPEAR = [
    "#onesignal-slidedown-container",
    ".adsbygoogle",
];

/**
 * Disable all console functions.
 */
const disableConsole = function(){
    for (const el in console) window.console[el] = () => {};
};

/**
 * Hook requestAnimationFrame to limit FPS.
 *//*
const hookRAF = function(){
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = callback => originalRAF(() => callback(new Date().getTime()));
}; */

/**
 * Generate CSS for disabling Ads.
 *
 * @returns {String}
 */
const buildAntiBannerCss = () => `${BANNER_IDS.join(",")},${MAY_APPEAR.join(",")}{display:none!important;}`;

/**
 * Inject CSS into the head.
 *
 * @param {String} css
 */
const injectCss = function(css){
    const style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
};

/**
 * Async task to wait for a DOM element to exist.
 *
 * @param {String} selector
 * @returns {Promise<HTMLElement>}
 */
const waitForElement = function(selector){
    return new Promise(resolve => {
        /** @type {HTMLImageElement | null} */
        const existing = document.querySelector(selector);
        if (existing) return resolve(existing);

        const observer = new MutationObserver(() => {
            /** @type {HTMLImageElement | null} */
            const newElement = document.querySelector(selector);
            if (newElement){
                observer.disconnect();
                resolve(newElement);
            }
        });

        return observer.observe(document.body, { childList: true, subtree: true });
    });
};

(() => {
    disableConsole();
    // hookRAF();

    document.addEventListener("DOMContentLoaded", () => {
        BANNER_IDS.forEach(id => waitForElement(id)
            .then(el => el.remove()),
        );

        injectCss(buildAntiBannerCss());

        const menuBanner = document.querySelector(".advertisement-informer");
        if (!!menuBanner) menuBanner.innerHTML = "Senpa.io :: Client";

        const endBanner = document.querySelector(".advertisement-informer-endgame");
        if (!!endBanner) endBanner.innerHTML = "Senpa.io :: Client";
    });

    document.addEventListener("keydown", event => {
        if (event.code === "F11") ipcRenderer.send("togglefullscreen");
    });
})();
