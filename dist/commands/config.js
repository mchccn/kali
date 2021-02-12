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
const aeroclient_1 = require("@aeroware/aeroclient");
const node_fetch_1 = __importDefault(require("node-fetch"));
const __1 = __importDefault(require(".."));
const Embed_1 = __importDefault(require("../utils/Embed"));
const getFlags_1 = __importDefault(require("../utils/getFlags"));
const options = {
    "--silent": {
        alias: "-s",
        message: "Executes silently; does not display output",
    },
    "--help": {
        alias: "-h",
        message: "Displays this nice little help message",
    },
    "--dev": {
        alias: "-d",
        message: "For testing purposes; does not do anything",
    },
};
exports.default = {
    name: "config",
    args: true,
    usage: "<section> <subsection> <arguments>",
    callback({ message, args, client }) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        return __awaiter(this, void 0, void 0, function* () {
            const flags = getFlags_1.default(args);
            const flagNames = flags.map((f) => f.flag);
            const booleanFlags = new Set(flags.map(({ flag }) => { var _a; return ((_a = options[`--${flag}`]) === null || _a === void 0 ? void 0 : _a.alias) || `-${flag}`; }));
            const guild = message.guild;
            for (const { flag, index } of flags) {
                switch (flag) {
                    case "help":
                    case "h": {
                        if (!booleanFlags.has("-s"))
                            return message.channel.send(`
\`\`\`
${__1.default}${this.name}

    SYNTAX:
        ${__1.default}${this.name} ${this.usage}

    OPTIONS:${Object.keys(options)
                                .map((flag) => `\n        ${`${flag}, ${options[flag].alias}`.padEnd(16, " ")}${options[flag].message}`)
                                .join("")}
    
    DEFAULT:
        No default action
\`\`\`
`);
                    }
                }
            }
            if (!booleanFlags.has("-d"))
                switch (args[0]) {
                    case "roles": {
                        switch (args[1]) {
                            case "create": {
                                if (!booleanFlags.has("-s"))
                                    yield message.channel.send(`Role name:`);
                                const name = (_a = (yield aeroclient_1.utils.getReply(message, {
                                    time: 30000,
                                }))) === null || _a === void 0 ? void 0 : _a.content;
                                if (!name)
                                    return;
                                if (!booleanFlags.has("-s"))
                                    yield message.channel.send(`Role color:`);
                                const color = ((_b = (yield aeroclient_1.utils.getReply(message, {
                                    time: 30000,
                                }))) === null || _b === void 0 ? void 0 : _b.content) || "";
                                yield ((_c = message.guild) === null || _c === void 0 ? void 0 : _c.roles.create({
                                    data: {
                                        name,
                                        color,
                                    },
                                }));
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(`Created the role`);
                            }
                            case "delete": {
                                if (!args[2]) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide the role`);
                                    return;
                                }
                                if (!/\d{18}/.test(args[2])) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide a valid role`);
                                    return;
                                }
                                const id = args[2].match(/(\d{18})/)[0];
                                const role = yield ((_d = message.guild) === null || _d === void 0 ? void 0 : _d.roles.fetch(id));
                                if (!role) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Role not found`);
                                    return;
                                }
                                yield role.delete();
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(`Deleted role successfully`);
                            }
                            case "info": {
                                if (!args[2]) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide the role`);
                                    return;
                                }
                                if (!/\d{18}/.test(args[2])) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide a valid role`);
                                    return;
                                }
                                const id = args[2].match(/(\d{18})/)[0];
                                const role = yield ((_e = message.guild) === null || _e === void 0 ? void 0 : _e.roles.fetch(id));
                                if (!role) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Role not found`);
                                    return;
                                }
                                const array = role.permissions.toArray();
                                const itemsPerPage = 2;
                                const fields = array
                                    .map((_, i) => i % itemsPerPage
                                    ? undefined
                                    : array.slice(i, Math.floor(i / itemsPerPage) * itemsPerPage +
                                        itemsPerPage))
                                    .filter(($) => !!$);
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(new Embed_1.default()
                                        .setTitle(role.name)
                                        .setColor(role.hexColor || role.color || "RANDOM")
                                        .addField("Hoisted", role.hoist, true)
                                        .addField("Mentionable", role.mentionable, true)
                                        .addField("Permissions", `\`\`\`${fields
                                        .map(([f1, f2]) => `${aeroclient_1.utils
                                        .formatMacroCase(f1)
                                        .padEnd(24, " ")} ${f2 ? aeroclient_1.utils.formatMacroCase(f2) : ""}`)
                                        .join("")}\`\`\``)
                                        .addField("ID", role.id, true)
                                        .addField("Created at", role.createdAt.toDateString(), true));
                            }
                            default:
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(`The valid subsections are ${aeroclient_1.utils.formatList([
                                        "`create`",
                                        "`delete`",
                                        "`info`",
                                    ])}`);
                        }
                    }
                    case "channels": {
                        switch (args[1]) {
                            case "create": {
                                if (!booleanFlags.has("-s"))
                                    yield message.channel.send(`Channel name:`);
                                const name = (_f = (yield aeroclient_1.utils.getReply(message, {
                                    time: 30000,
                                }))) === null || _f === void 0 ? void 0 : _f.content;
                                if (!name)
                                    return;
                                if (!booleanFlags.has("-s"))
                                    yield message.channel.send(`Category (id):`);
                                const parent = ((_g = (yield aeroclient_1.utils.getReply(message, {
                                    time: 30000,
                                }))) === null || _g === void 0 ? void 0 : _g.content) || "";
                                if (!booleanFlags.has("-s"))
                                    yield message.channel.send(`Topic:`);
                                const topic = ((_h = (yield aeroclient_1.utils.getReply(message, {
                                    time: 30000,
                                }))) === null || _h === void 0 ? void 0 : _h.content) || "";
                                if (!booleanFlags.has("-s"))
                                    yield message.channel.send(`Type (voice/text/news/category):`);
                                const type = ((_j = (yield aeroclient_1.utils.getReply(message, {
                                    time: 30000,
                                }))) === null || _j === void 0 ? void 0 : _j.content) || "text";
                                if (!type)
                                    return;
                                yield ((_k = message.guild) === null || _k === void 0 ? void 0 : _k.channels.create(name, {
                                    parent: /^\d{18}$/.test(parent) ? parent : undefined,
                                    topic,
                                    //@ts-ignore
                                    type: !["voice", "text", "news", "category"].includes(type)
                                        ? "text"
                                        : type,
                                }));
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(`Created the channel`);
                            }
                            case "delete": {
                                if (!args[2]) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide the channel`);
                                    return;
                                }
                                if (!/\d{18}/.test(args[2])) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide a valid channel`);
                                    return;
                                }
                                const id = args[2].match(/(\d{18})/)[0];
                                const channel = (_l = message.guild) === null || _l === void 0 ? void 0 : _l.channels.cache.get(id);
                                if (!channel) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Channel not found`);
                                    return;
                                }
                                yield channel.delete();
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(`Deleted channel successfully`);
                            }
                            case "info": {
                                if (!args[2]) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide the channel`);
                                    return;
                                }
                                if (!/\d{18}/.test(args[2])) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide a valid channel`);
                                    return;
                                }
                                const id = args[2].match(/(\d{18})/)[0];
                                const channel = (_m = message.guild) === null || _m === void 0 ? void 0 : _m.channels.cache.get(id);
                                if (!channel) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Channel not found`);
                                    return;
                                }
                                if (channel.type === "category") {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(new Embed_1.default()
                                            .setTitle(channel === null || channel === void 0 ? void 0 : channel.name)
                                            .setDescription(`**Channels**\n${channel.children
                                            .map((child) => child.type === "voice"
                                            ? `🔊 ${child.name}`
                                            : `<#${child.id}>`)
                                            .join("")}`)
                                            .addField("Type", channel.type, true)
                                            .addField("ID", channel.id, true)
                                            .addField("Created at", channel.createdAt.toDateString(), true));
                                    return;
                                }
                                if (channel.type === "voice") {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(new Embed_1.default()
                                            .setTitle(channel === null || channel === void 0 ? void 0 : channel.name)
                                            .addField("User limit", channel.userLimit, true)
                                            .addField("Type", channel.type, true)
                                            .addField("Bitrate", channel.bitrate, true)
                                            .addField("Parent", ((_o = channel.parent) === null || _o === void 0 ? void 0 : _o.name) || "None")
                                            .addField("ID", channel.id, true)
                                            .addField("Created at", channel.createdAt.toDateString(), true));
                                    return;
                                }
                                if (channel.type === "store") {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Store channels are not supported`);
                                    return;
                                }
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(new Embed_1.default()
                                        .setTitle(channel === null || channel === void 0 ? void 0 : channel.name)
                                        .setDescription(channel.topic || "No topic")
                                        .addField("NSFW", channel.nsfw, true)
                                        .addField("Type", channel.type, true)
                                        .addField("Rate limit", channel.rateLimitPerUser +
                                        " seconds", true)
                                        .addField("Parent", ((_p = channel.parent) === null || _p === void 0 ? void 0 : _p.name) || "None")
                                        .addField("ID", channel.id, true)
                                        .addField("Created at", channel.createdAt.toDateString(), true));
                            }
                            default:
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(`The valid subsections are ${aeroclient_1.utils.formatList([
                                        "`create`",
                                        "`delete`",
                                        "`info`",
                                    ])}`);
                        }
                    }
                    case "emoji": {
                        switch (args[1]) {
                            case "create": {
                                if (!args[2] || !args[3]) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide the name and URL`);
                                    return;
                                }
                                try {
                                    const emoji = yield ((_q = message.guild) === null || _q === void 0 ? void 0 : _q.emojis.create(yield (yield node_fetch_1.default(args[3])).buffer(), args[2]));
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Emoji created: <${(emoji === null || emoji === void 0 ? void 0 : emoji.animated) ? "a" : ""}:${emoji === null || emoji === void 0 ? void 0 : emoji.name}:${emoji === null || emoji === void 0 ? void 0 : emoji.id}>`);
                                }
                                catch (_w) {
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Emoji creation failed`);
                                }
                            }
                            case "delete":
                                if (!args[2]) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide the name`);
                                    return;
                                }
                                try {
                                    const emoji = (_r = message.guild) === null || _r === void 0 ? void 0 : _r.emojis.cache.find((e) => e.name === args[2]);
                                    yield (emoji === null || emoji === void 0 ? void 0 : emoji.delete());
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Emoji was deleted`);
                                }
                                catch (_x) {
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Emoji deletion failed`);
                                }
                            case "info":
                                if (!args[2]) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide the emoji`);
                                    return;
                                }
                                if (!/\d{18}/.test(args[2])) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide a valid emoji`);
                                    return;
                                }
                                const emoji = client.emojis.cache.get(args[2].match(/(\d{18})/)[0]);
                                if (!emoji) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Emoji not found`);
                                    return;
                                }
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(new Embed_1.default()
                                        .setTitle(emoji.name)
                                        .setThumbnail(emoji.url)
                                        .addField("ID", emoji.id)
                                        .addField("Author", emoji.author ? emoji.author.tag : "N/A"));
                            default:
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(`The valid subsections are ${aeroclient_1.utils.formatList([
                                        "`create`",
                                        "`delete`",
                                        "`info`",
                                    ])}`);
                        }
                    }
                    case "settings": {
                        switch (args[1]) {
                            case "name": {
                                if (!args[2]) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide the name`);
                                    return;
                                }
                                const name = args.slice(2).join(" ");
                                try {
                                    yield guild.setName(args.slice(2).join(" "));
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Server name set to \`${name}\``);
                                }
                                catch (_y) {
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Settings update failed`);
                                }
                            }
                            case "icon": {
                                if (!args[2]) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide the setting`);
                                    return;
                                }
                                const icon = args[2];
                                try {
                                    yield guild.setIcon(icon);
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Icon was updated!`);
                                }
                                catch (_z) {
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`The icon must be a URL`);
                                }
                            }
                            case "widget": {
                                if (message.channel.type === "dm")
                                    return;
                                if (!args[2]) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide the URL`);
                                    return;
                                }
                                if (!["true", "false"].includes(args[2].toLowerCase())) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Setting must be true or false`);
                                    return;
                                }
                                try {
                                    yield guild.setWidget({
                                        channel: message.channel,
                                        enabled: args[2].toLowerCase() === "true",
                                    });
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Widget has been ${args[2].toLowerCase() === "true"
                                            ? "enabled"
                                            : "disabled"}`);
                                }
                                catch (_0) {
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Settings update failed`);
                                }
                            }
                            case "region": {
                                if (message.channel.type === "dm")
                                    return;
                                if (!args[2]) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide the region`);
                                    return;
                                }
                                try {
                                    yield guild.setRegion(args[2]);
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Region has been set to \`${args[2]}\``);
                                }
                                catch (_1) {
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Settings update failed`);
                                }
                            }
                            case "locale": {
                                if (message.channel.type === "dm")
                                    return;
                                if (!args[2]) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide the locale`);
                                    return;
                                }
                                try {
                                    yield guild.setPreferredLocale(args[2]);
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Locale has been set to \`${args[2]}\``);
                                }
                                catch (_2) {
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Settings update failed`);
                                }
                            }
                            case "banner":
                                if (!args[2]) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide the URL`);
                                    return;
                                }
                                try {
                                    yield ((_s = message.guild) === null || _s === void 0 ? void 0 : _s.setBanner(args[2]));
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Server banner updated!`);
                                }
                                catch (_3) {
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Settings update failed`);
                                }
                            case "splash":
                                if (!args[2]) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide the URL`);
                                    return;
                                }
                                try {
                                    yield ((_t = message.guild) === null || _t === void 0 ? void 0 : _t.setSplash(args[2]));
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Server splash set!`);
                                }
                                catch (_4) {
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Settings update failed`);
                                }
                            case "discovery":
                                if (!args[2]) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide the URL`);
                                    return;
                                }
                                try {
                                    yield ((_u = message.guild) === null || _u === void 0 ? void 0 : _u.setDiscoverySplash(args[2]));
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Discovery splash set!`);
                                }
                                catch (_5) {
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Settings update failed`);
                                }
                            case "template":
                                if (!args[2]) {
                                    if (!booleanFlags.has("-s"))
                                        message.channel.send(`Please provide a name`);
                                    return;
                                }
                                try {
                                    yield ((_v = message.guild) === null || _v === void 0 ? void 0 : _v.createTemplate(args[2], args.slice(3).join(" ") || ""));
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Template created!`);
                                }
                                catch (_6) {
                                    if (!booleanFlags.has("-s"))
                                        return message.channel.send(`Failed to create a template`);
                                }
                            default:
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(`The valid subsections are ${aeroclient_1.utils.formatList([
                                        "`name`",
                                        "`icon`",
                                        "`widget`",
                                        "`region`",
                                        "`locale`",
                                        "`banner`",
                                        "`splash`",
                                        "`discovery`",
                                        "`template`",
                                    ])}`);
                        }
                    }
                    default:
                        if (!booleanFlags.has("-s"))
                            return message.channel.send(`The valid sections are \`settings\`, \`emoji\`, \`channels\` and \`roles\`.`);
                }
            return;
        });
    },
};
