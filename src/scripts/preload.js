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

(() => {
    disableConsole();

    document.addEventListener("DOMContentLoaded", () => [
        ...document.querySelectorAll(BANNER_IDS.join(", "))
    ].forEach(el => (/** @type {HTMLElement} */ (el).style.display = "none")));

    document.addEventListener("keydown", event => {
        if (event.code === "Escape") document.exitPointerLock();

        else if (event.code === "F11"){
            document.fullscreenElement
                ? document.exitFullscreen()
                : document.body.requestFullscreen();
        }
    });
})();
