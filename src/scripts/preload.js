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

const waitForElement = function(selector){
    return new Promise(resolve => {
        if (document.querySelector(selector)) return resolve(document.querySelector(selector));

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)){
                resolve(document.querySelector(selector));
                observer.disconnect();
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
