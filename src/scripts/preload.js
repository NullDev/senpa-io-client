"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const BANNER_IDS = [
    "#gameadsbanner",
    "#banner_ad_bottom"
];

/**
 * Disable all console functions.
 */
const disableConsole = function(){
    for (const el in console) window.console[el] = () => {};
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

    document.addEventListener("DOMContentLoaded", () => {
        BANNER_IDS.forEach(id => waitForElement(id)
            .then(el => (el.style.display = "none"))
        );
    });

    document.addEventListener("keydown", event => {
        if (event.code === "Escape") document.exitPointerLock();

        else if (event.code === "F11"){
            document.fullscreenElement
                ? document.exitFullscreen()
                : document.body.requestFullscreen();
        }
    });
})();
