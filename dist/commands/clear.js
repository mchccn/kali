"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const words_to_numbers_ordinal_1 = __importDefault(require("words-to-numbers-ordinal"));
const __1 = __importDefault(require(".."));
const getFlags_1 = __importDefault(require("../utils/getFlags"));
const options = {
    "--user": {
        alias: "-u",
        message: "Clear all of a user's messages",
    },
    "--regex": {
        alias: "-r",
        message: "Clear all messages that match the regex",
    },
    "--word": {
        alias: "-w",
        message: "Clear all messages with a specific word",
    },
    "--nuke": {
        alias: "-n",
        message: "Nuke the channel",
    },
    "--time": {
        alias: "-t",
        message: "Clear all messages sent within the time specified",
    },
    "--silent": {
        alias: "-s",
        message: "Clears messages silently; does not display output",
    },
    "--help": {
        alias: "-h",
        message: "Displays this nice little help message",
    },
    "--dev": {
        alias: "-d",
        message: "For testing purposes; does not actually clear",
    },
};
exports.default = {
    name: "clear",
    args: true,
    usage: "<arguments> [options]",
    async callback({ message, args, client }) {
        if (message.channel.type === "dm")
            return;
        const flags = getFlags_1.default(args);
        const flagNames = flags.map((f) => f.flag);
        const booleanFlags = new Set(flags.map(({ flag }) => options[`--${flag}`]?.alias || `-${flag}`));
        const parsed = words_to_numbers_ordinal_1.default(args.join(" "));
        const amount = Math.max(Math.min(parseInt(args[0]) ||
            (typeof parsed === "string" ? parseInt(parsed.toString()) : parsed) ||
            0, 100), 1);
        if (!amount)
            return message.channel.send(`The amount has to be a number.`);
        for (const { flag, index } of flags) {
            switch (flag) {
                case "help":
                case "h":
                    return message.channel.send(`
\`\`\`
${__1.default}${this.name}

    SYNTAX:
        ${__1.default}${this.name} ${this.usage}

    OPTIONS:${Object.keys(options)
                        .map((flag) => `\n        ${`${flag}, ${options[flag].alias}`.padEnd(16, " ")}${options[flag].message}`)
                        .join("")}
    
    DEFAULT:
        Clears the specified amount of messages
\`\`\`
`);
                case "nuke":
                case "n": {
                    const channel = await message.channel.clone();
                    await message.channel.delete();
                    const nuked = await channel.send(`Channel <#${channel.name}> has been nuked.`);
                    return nuked.delete({ timeout: 5000 });
                }
                case "user":
                case "u": {
                    if (!/\d{18}/.test(args[index + 1]))
                        return message.channel.send(`A user is required when using the \`user\` flag.`);
                    const user = client.users.cache.get(args[index + 1].match(/(\d{18})/)[0]) ||
                        (await client.users.fetch(args[index + 1]));
                    if (!user)
                        return message.channel.send(`Could not find that user.`);
                    const messages = new discord_js_1.Collection(Array.from((await message.channel.messages.fetch({
                        limit: 100,
                    })).filter((msg) => msg.author.id === user.id)).slice(0, amount));
                    const count = messages.size;
                    await message.channel.bulkDelete(messages);
                    if (booleanFlags.has("-s"))
                        return;
                    const done = await message.channel.send(`**${count}** message${count !== 1 ? "s" : ""} w${count !== 1 ? "ere" : "as"} deleted.`);
                    return done.delete({ timeout: 5000 });
                }
                case "word":
                case "w": {
                    const word = args[index + 1];
                    if (!word)
                        return message.channel.send(`A word is required when using the \`word\` flag.`);
                    const messages = new discord_js_1.Collection(Array.from((await message.channel.messages.fetch({
                        limit: 100,
                    })).filter((msg) => msg.content.toLowerCase().includes(word))).slice(0, amount));
                    const count = messages.size;
                    await message.channel.bulkDelete(messages);
                    if (booleanFlags.has("-s"))
                        return;
                    const done = await message.channel.send(`**${count}** message${count !== 1 ? "s" : ""} w${count !== 1 ? "ere" : "as"} deleted.`);
                    return done.delete({ timeout: 5000 });
                }
                case "regex":
                case "r": {
                    if (!args[index + 1])
                        return message.channel.send(`A regex is required when using the \`regex\` flag.`);
                    if (args[index + 1].length > 12 || args[index + 1].length < 3)
                        return message.channel.send(`Regex must be between 3 and 12 characters long.`);
                    const regex = new RegExp(args[index + 1] || "");
                    const messages = new discord_js_1.Collection(Array.from((await message.channel.messages.fetch({
                        limit: 100,
                    })).filter((msg) => regex.test(msg.content))).slice(0, amount));
                    const count = messages.size;
                    await message.channel.bulkDelete(messages);
                    if (booleanFlags.has("-s"))
                        return;
                    const done = await message.channel.send(`**${count}** message${count !== 1 ? "s" : ""} w${count !== 1 ? "ere" : "as"} deleted.`);
                    return done.delete({ timeout: 5000 });
                }
                case "time":
                case "t": {
                    if (!args[index + 1])
                        return message.channel.send(`A time is required when using the \`time\` flag.`);
                    const time = Date.now() - Math.max(Math.min(ms_1.default(args[index + 1]), 1209600000), 60000);
                    const messages = new discord_js_1.Collection(Array.from((await message.channel.messages.fetch({
                        limit: 100,
                    })).filter((msg) => msg.createdTimestamp > time)).slice(0, amount));
                    const count = messages.size;
                    await message.channel.bulkDelete(messages);
                    if (booleanFlags.has("-s"))
                        return;
                    const done = await message.channel.send(`**${count}** message${count !== 1 ? "s" : ""} w${count !== 1 ? "ere" : "as"} deleted.`);
                    return done.delete({ timeout: 5000 });
                }
            }
        }
        if (!booleanFlags.has("-d"))
            await message.channel.bulkDelete(amount);
        if (booleanFlags.has("-s"))
            return;
        const done = await message.channel.send(`**${amount}** message${amount !== 1 ? "s" : ""} w${amount !== 1 ? "ere" : "as"} deleted.`);
        return done.delete({ timeout: 5000 });
    },
};
