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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_utils_1 = __importDefault(require("@aeroware/discord-utils"));
const discord_js_1 = require("discord.js");
const Embed_1 = __importDefault(require("../utils/Embed"));
exports.default = {
    name: "list",
    args: true,
    usage: "[section]",
    callback({ message, args, client }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const itemsPerPage = 10;
            const color = Math.floor(Math.random() * 16777215).toString(16);
            switch (args[0]) {
                case "roles": {
                    const array = ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.array().sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase()
                        ? -1
                        : a.name.toLowerCase() > b.name.toLowerCase()
                            ? 1
                            : 0).filter((r) => r.name !== "@everyone")) || [];
                    const fields = array
                        .map((_, i) => i % itemsPerPage
                        ? undefined
                        : array.slice(i, Math.floor(i / itemsPerPage) * itemsPerPage + itemsPerPage))
                        .filter(($) => !!$);
                    const pages = fields.map((roles, i) => new Embed_1.default()
                        .setTitle("Roles")
                        .setFooter(`page ${i + 1} out of ${fields.length}`)
                        .setDescription(roles.map((r) => `<@&${r.id}>`).join("\n"))
                        .setColor(color));
                    return discord_utils_1.default.paginate(message, pages, {
                        fastForwardAndRewind: {
                            time: 10000,
                        },
                        goTo: {
                            time: 10000,
                        },
                        time: 120000,
                    });
                }
                case "channels": {
                    const guild = message.guild;
                    const descPos = (a, b) => {
                        if (a.type !== b.type) {
                            if (a.type === "voice")
                                return 1;
                            else
                                return -1;
                        }
                        else
                            return a.position - b.position;
                    };
                    const channels = new discord_js_1.Collection();
                    channels.set("__none", guild.channels.cache
                        .filter((channel) => !channel.parent && channel.type !== "category")
                        .sort(descPos));
                    const categories = guild.channels.cache
                        .filter((channel) => channel.type === "category")
                        .sort(descPos);
                    categories.forEach((category) => channels.set(category.id, category.children.sort(descPos)));
                    const list = [];
                    for (let [categoryID, children] of channels) {
                        const category = guild.channels.cache.get(categoryID);
                        if (category)
                            list.push(`**${category.name}**`);
                        for (let [, child] of children)
                            list.push(child.type === "category"
                                ? `**${child.name}**`
                                : child.type === "voice"
                                    ? `🔊 ${child.name}`
                                    : `<#${child.id}>`);
                    }
                    const fields = list
                        .map((_, i) => i % itemsPerPage
                        ? undefined
                        : list.slice(i, Math.floor(i / itemsPerPage) * itemsPerPage + itemsPerPage))
                        .filter(($) => !!$);
                    const pages = fields.map((channels, i) => new Embed_1.default()
                        .setTitle("Channels")
                        .setFooter(`page ${i + 1} out of ${fields.length}`)
                        .setDescription(channels.join("\n"))
                        .setColor(color));
                    return discord_utils_1.default.paginate(message, pages, {
                        fastForwardAndRewind: {
                            time: 10000,
                        },
                        goTo: {
                            time: 10000,
                        },
                        time: 120000,
                    });
                }
                case "members": {
                    const roles = new Set();
                    const sort = ((_b = message.guild) === null || _b === void 0 ? void 0 : _b.members.cache.array().sort((a, b) => b.roles.highest.position - a.roles.highest.position)) ||
                        [];
                    const array = sort.flatMap((m, i) => roles.has(m.roles.highest.id)
                        ? `<@!${m.id}>`
                        : (() => {
                            var _a;
                            roles.add(m.roles.highest.id);
                            const role = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.get(m.roles.highest.id);
                            return [`<@&${role === null || role === void 0 ? void 0 : role.id}>`, `<@!${m.id}>`];
                        })());
                    const fields = array
                        .map((_, i) => i % itemsPerPage
                        ? undefined
                        : array.slice(i, Math.floor(i / itemsPerPage) * itemsPerPage + itemsPerPage))
                        .filter(($) => !!$);
                    const pages = fields.map((members, i) => new Embed_1.default()
                        .setTitle("Members")
                        .setFooter(`page ${i + 1} out of ${fields.length}`)
                        .setDescription(members.join("\n"))
                        .setColor(color));
                    return discord_utils_1.default.paginate(message, pages, {
                        fastForwardAndRewind: {
                            time: 10000,
                        },
                        goTo: {
                            time: 10000,
                        },
                        time: 120000,
                    });
                }
                default:
                    return message.channel.send(`The valid sections are \`roles\`, \`channels\` and \`members\`.`);
            }
            return;
        });
    },
};
