"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
async function muteOverrides(channel, role) {
    if (channel instanceof discord_js_1.VoiceChannel) {
        await channel.updateOverwrite(role, {
            CONNECT: false,
        });
    }
    else if (channel instanceof discord_js_1.TextChannel) {
        await channel.updateOverwrite(role, {
            SEND_MESSAGES: false,
        });
    }
    else if (channel instanceof discord_js_1.CategoryChannel) {
        await channel.updateOverwrite(role, {
            CONNECT: false,
            SEND_MESSAGES: false,
        });
    }
}
exports.default = muteOverrides;
