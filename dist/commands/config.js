"use strict";
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
    async callback({ message, args, client }) {
        const flags = getFlags_1.default(args);
        const flagNames = flags.map((f) => f.flag);
        const booleanFlags = new Set(flags.map(({ flag }) => options[`--${flag}`]?.alias || `-${flag}`));
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
                                await message.channel.send(`Role name:`);
                            const name = (await aeroclient_1.utils.getReply(message, {
                                time: 30000,
                            }))?.content;
                            if (!name)
                                return;
                            if (!booleanFlags.has("-s"))
                                await message.channel.send(`Role color:`);
                            const color = (await aeroclient_1.utils.getReply(message, {
                                time: 30000,
                            }))?.content || "";
                            await message.guild?.roles.create({
                                data: {
                                    name,
                                    color,
                                },
                            });
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
                            const role = await message.guild?.roles.fetch(id);
                            if (!role) {
                                if (!booleanFlags.has("-s"))
                                    message.channel.send(`Role not found`);
                                return;
                            }
                            await role.delete();
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
                            const role = await message.guild?.roles.fetch(id);
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
                                    .map(([f1, f2]) => `${aeroclient_1.utils.formatMacroCase(f1).padEnd(24, " ")} ${f2 ? aeroclient_1.utils.formatMacroCase(f2) : ""}`)
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
                                await message.channel.send(`Channel name:`);
                            const name = (await aeroclient_1.utils.getReply(message, {
                                time: 30000,
                            }))?.content;
                            if (!name)
                                return;
                            if (!booleanFlags.has("-s"))
                                await message.channel.send(`Category (id):`);
                            const parent = (await aeroclient_1.utils.getReply(message, {
                                time: 30000,
                            }))?.content || "";
                            if (!booleanFlags.has("-s"))
                                await message.channel.send(`Topic:`);
                            const topic = (await aeroclient_1.utils.getReply(message, {
                                time: 30000,
                            }))?.content || "";
                            if (!booleanFlags.has("-s"))
                                await message.channel.send(`Type (voice/text/news/category):`);
                            const type = (await aeroclient_1.utils.getReply(message, {
                                time: 30000,
                            }))?.content || "text";
                            if (!type)
                                return;
                            await message.guild?.channels.create(name, {
                                parent: /^\d{18}$/.test(parent) ? parent : undefined,
                                topic,
                                //@ts-ignore
                                type: !["voice", "text", "news", "category"].includes(type)
                                    ? "text"
                                    : type,
                            });
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
                            const channel = message.guild?.channels.cache.get(id);
                            if (!channel) {
                                if (!booleanFlags.has("-s"))
                                    message.channel.send(`Channel not found`);
                                return;
                            }
                            await channel.delete();
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
                            const channel = message.guild?.channels.cache.get(id);
                            if (!channel) {
                                if (!booleanFlags.has("-s"))
                                    message.channel.send(`Channel not found`);
                                return;
                            }
                            if (channel.type === "category") {
                                if (!booleanFlags.has("-s"))
                                    message.channel.send(new Embed_1.default()
                                        .setTitle(channel?.name)
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
                                        .setTitle(channel?.name)
                                        .addField("User limit", channel.userLimit, true)
                                        .addField("Type", channel.type, true)
                                        .addField("Bitrate", channel.bitrate, true)
                                        .addField("Parent", channel.parent?.name || "None")
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
                                    .setTitle(channel?.name)
                                    .setDescription(channel.topic || "No topic")
                                    .addField("NSFW", channel.nsfw, true)
                                    .addField("Type", channel.type, true)
                                    .addField("Rate limit", channel.rateLimitPerUser + " seconds", true)
                                    .addField("Parent", channel.parent?.name || "None")
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
                                const emoji = await message.guild?.emojis.create(await (await node_fetch_1.default(args[3])).buffer(), args[2]);
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(`Emoji created: <${emoji?.animated ? "a" : ""}:${emoji?.name}:${emoji?.id}>`);
                            }
                            catch {
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
                                const emoji = message.guild?.emojis.cache.find((e) => e.name === args[2]);
                                await emoji?.delete();
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(`Emoji was deleted`);
                            }
                            catch {
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
                                await guild.setName(args.slice(2).join(" "));
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(`Server name set to \`${name}\``);
                            }
                            catch {
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
                                await guild.setIcon(icon);
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(`Icon was updated!`);
                            }
                            catch {
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
                                await guild.setWidget({
                                    channel: message.channel,
                                    enabled: args[2].toLowerCase() === "true",
                                });
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(`Widget has been ${args[2].toLowerCase() === "true" ? "enabled" : "disabled"}`);
                            }
                            catch {
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
                                await guild.setRegion(args[2]);
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(`Region has been set to \`${args[2]}\``);
                            }
                            catch {
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
                                await guild.setPreferredLocale(args[2]);
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(`Locale has been set to \`${args[2]}\``);
                            }
                            catch {
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
                                await message.guild?.setBanner(args[2]);
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(`Server banner updated!`);
                            }
                            catch {
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
                                await message.guild?.setSplash(args[2]);
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(`Server splash set!`);
                            }
                            catch {
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
                                await message.guild?.setDiscoverySplash(args[2]);
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(`Discovery splash set!`);
                            }
                            catch {
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
                                await message.guild?.createTemplate(args[2], args.slice(3).join(" ") || "");
                                if (!booleanFlags.has("-s"))
                                    return message.channel.send(`Template created!`);
                            }
                            catch {
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
    },
};
