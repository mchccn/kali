"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Embed extends discord_js_1.MessageEmbed {
    constructor(data) {
        super(data);
        this.setFooter(Embed.footers[Math.floor(Math.random() * Embed.footers.length)]);
        this.setColor("RANDOM");
    }
}
exports.default = Embed;
Embed.footers = [
    "Each command has options for more specific situations",
    "The silent option makes the command execute silently",
    "Lock or unlock an entire category with the category flag",
    "Use the time command to see what time it is",
    "The help flag will display a helpful message for a command",
    "Configure your server easily with the config command",
    "View all roles, channels and members with the list command",
];
