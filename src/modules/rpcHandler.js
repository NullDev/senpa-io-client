"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const DiscordRPC = require("discord-rpc");

/**
 * Handles RPC events for Discord.
 *
 * @class RPCHandler
 */
class RPCHandler {
    /**
     * Creates an instance of RPCHandler.
     *
     * @param {String} clientId
     * @memberof RPCHandler
     */
    constructor(clientId){
        this.clientId = clientId;

        DiscordRPC.register(this.clientId);
        this.rpc = new DiscordRPC.Client({ transport: "ipc" });
    }

    /**
     * Initialize the RPC.
     *
     * @public
     * @memberof RPCHandler
     */
    init(){
        this.rpc.on("ready", async() => {
            await this.#setActivity();
            setInterval(async() => await this.#setActivity(), 15e3);
        });
        this.rpc.login({ clientId: this.clientId }).catch(console.error);
    }

    /**
     * Gracefully shutdown the RPC.
     *
     * @public
     * @memberof RPCHandler
     */
    async destroy(){
        this.rpc.removeAllListeners();
        await this.rpc.destroy();
    }

    /**
     * Set the activity to our game.
     *
     * @returns {Promise<void>}
     * @ignore
     * @memberof RPCHandler
     */
    async #setActivity(){
        if (!this.rpc) return;

        await this.rpc.setActivity({
            details: "Official Client",
            state: "Playing Senpa.io",
            startTimestamp: new Date(),
            largeImageKey: "icon",
            largeImageText: "Senpa.io",
            // smallImageKey: "icon",
            // smallImageText: "Senpa.io",
            instance: false,
        });
    }
}

module.exports = RPCHandler;
