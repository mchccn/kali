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
// priv guild
const msgs = ["who asked"];
client.on("message", (msg) => {
    if (msg.guild?.id === "892973291000725594") {
        if (Math.random() < 0.01) {
            if (!(msg.channel instanceof discord_js_1.TextChannel))
                return;
            msg.channel
                .createWebhook("kelly's soul", {
                avatar: "https://cdn.discordapp.com/avatars/508442553754845184/a_d13dfd8102b55726b779ffed4e3fd49f.gif?size=2048",
                reason: "",
            })
                .then((h) => {
                h.send(msgs[Math.floor(Math.random() * msgs.length)]);
                return h;
            })
                .then((h) => h.delete());
        }
    }
});
client.use(({ message }, next) => {
    if (!message.guild || (!message.member.hasPermission("ADMINISTRATOR") && message.author.id !== "508442553754845184"))
        return next(true);
});
process.on("unhandledRejection", async (err) => {
    // ((client.channels.cache.get("806540623850373180") ||
    //   (await client.channels.fetch("806540623850373180"))) as TextChannel).send(
    //   //@ts-ignore
    //   (err && (err.stack || err.message)) || "An error occured.",
    //   {
    //     code: true,
    //   }
    // );
});
exports.default = prefix;
