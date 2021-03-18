"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const aeroclient_1 = __importDefault(require("@aeroware/aeroclient"));
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
dotenv_1.config();
const prefix = ">>";
const client = new aeroclient_1.default({
    token: process.env.TOKEN,
    prefix,
    commandsPath: "commands",
    eventsPath: "events",
    logging: true,
    responses: {
        usage: `${prefix}$COMMAND $USAGE`,
    },
    staff: ["508442553754845184", "564930157371195437"],
}, {
    ws: {
        intents: [discord_js_1.Intents.NON_PRIVILEGED, "GUILD_MEMBERS"],
    },
});
exports.client = client;
client.use(({ message }, next) => {
    if (!message.guild || !message.member.hasPermission("ADMINISTRATOR"))
        return next(true);
});
process.on("unhandledRejection", async (err) => {
    (client.channels.cache.get("806540623850373180") ||
        (await client.channels.fetch("806540623850373180"))).send(
    //@ts-ignore
    (err && (err.stack || err.message)) || "An error occured.", {
        code: true,
    });
});
exports.default = prefix;
