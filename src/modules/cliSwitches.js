"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Apply CLI switches for Chromium.
 * Some for performance, some for security and some for development.
 *
 * @class CliSwitches
 */
class CliSwitches {
    /**
     * List of switches to apply.
     *
     * @static
     * @getter
     * @returns {Array<Array<string>>}
     * @memberof CliSwitches
     */
    static get #switches(){
        return [
            ["autoplay-policy", "no-user-gesture-required"],
            ["force_high_performance_gpu"],
            ["disable-frame-rate-limit"],
            ["limit-fps", "800"],
            ["max-gum-fps", "800"],
            ["disable-gpu-vsync"],
            // ["disable-accelerated-2d-canvas", "false"], // Game is fully 2D so this is not needed.
            ["ignore-gpu-blacklist"],
            ["disable-breakpad"], // Disable crash reporting
            ["disable-print-preview"],
            ["max-active-webgl-contexts", "100"],
            ["enable-quic"],
            ["high-dpi-support", "1"],
            ["disable-2d-canvas-clip-aa"],
            ["enable-highres-timer"], // high resolution timer -> less input delay (mostly)
            ["disable-metrics"],
            ["disable-metrics-repo"],
            ["disable-bundled-ppapi-flash"],
            ["disable-logging"],
            ["enable-javascript-harmony"],
            ["enable-future-v8-vm-features"],
            ["disable-low-end-device-mode"],
            ["enable-webgl2-compute-context"],
            ["disable-hang-monitor"],
            ["renderer-process-limit", "100"],
            ["disable-web-security"],
            ["webrtc-max-cpu-consumption-percentage=100"],
            ["enable-zero-copy"],
            ["no-pings"],
            ["no-proxy-server"],
            // ["disable-gpu-vsync"], // not needed for now
        ];
    }

    /**
     * Apply CLI switches.
     *
     * @static
     * @public
     * @param {import("electron").App} app
     * @memberof CliSwitches
     */
    static applySwitches(app){
        for (const [ option, value ] of CliSwitches.#switches){
            app.commandLine.appendSwitch(option, value || undefined);
        }
    }
}

module.exports = CliSwitches;
