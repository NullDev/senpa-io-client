"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const { ipcRenderer } = require("electron");

(() => {
    document.addEventListener("DOMContentLoaded", () => {
        ipcRenderer.invoke("get-version").then(version => {
            const ver = document.getElementById("version");
            if (!!ver) ver.innerHTML = `v${version}`;
        }).catch();
    });
})();
