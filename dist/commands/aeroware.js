"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const emojis_1 = require("../utils/emojis");
exports.default = {
    name: "aeroware",
    description: "View AeroWare products.",
    details: "Spice up your server with AeroWare!",
    category: "utility",
    cooldown: 10,
    callback({ message }) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.fetch());
            return message.channel.send(new discord_js_1.MessageEmbed()
                .setColor("RANDOM")
                .setTitle("AeroWare Products")
                .setDescription("Discord bots by AeroWare; quality in every command.")
                .addField(`AeroBot ${emojis_1.AERO}`, `General purpose bot for your server.
Easily configurable and simple to use. 
Lots of features and utilities.


${((_b = message.guild) === null || _b === void 0 ? void 0 : _b.member("787460489427812363")) ? "Already installed :white_check_mark:"
                : "[Install](https://discord.com/oauth2/authorize?client_id=787460489427812363&permissions=8&scope=bot)"}`, true)
                .addField("\u200b", "\u200b", true)
                .addField(`Kali ${emojis_1.KALI}`, `Moderation at its finest. 
Zero config, zero problems. 
Linux style.


${((_c = message.guild) === null || _c === void 0 ? void 0 : _c.member("808056326881280041")) ? "Already installed :white_check_mark:"
                : "[Install](https://discord.com/oauth2/authorize?client_id=808056326881280041&scope=bot&permissions=8)"}`, true)
                .addField("\u200b", "\u200b")
                .addField(`Dungeons & Dragons [BETA] ${emojis_1.DND}`, `The new role-playing game bot.
Play Dungeons & Dragons on Discord, effortlessly.
Many items, skills, and details.

${((_d = message.guild) === null || _d === void 0 ? void 0 : _d.member("802978299289534485")) ? "Already installed :white_check_mark:"
                : "[Install](https://discord.com/oauth2/authorize?client_id=802978299289534485&scope=bot&permissions=8)"}`, true)
                .addField("\u200b", "\u200b", true)
                .addField(`Twitter [BETA] ${emojis_1.TWITTER}`, `Bring Twitter to Discord!
Tweet, follow, and like posts.
Simple and elegant, like the real thing.


${((_e = message.guild) === null || _e === void 0 ? void 0 : _e.member("808348133162745877")) ? "Already installed :white_check_mark:"
                : "[Install](https://discord.com/oauth2/authorize?client_id=808348133162745877&scope=bot&permissions=8)"}`, true)
                .setURL("https://aero-ware.github.io/"));
        });
    },
};
