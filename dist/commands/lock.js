"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ms_1 = __importDefault(require("ms"));
const __1 = __importDefault(require(".."));
const getFlags_1 = __importDefault(require("../utils/getFlags"));
const options = {
    "--category": {
        alias: "-c",
        message: "Locks an entire category",
    },
    "--time": {
        alias: "-t",
        message: "Locks the channel for a certain amount of time",
    },
    "--silent": {
        alias: "-s",
        message: "Locks the channel silently; does not display output",
    },
    "--help": {
        alias: "-h",
        message: "Displays this nice little help message",
    },
    "--dev": {
        alias: "-d",
        message: "For testing purposes; does not lock",
    },
};
exports.default = {
    name: "lock",
    args: false,
    usage: "<arguments> [options]",
    async callback({ message, args, client, locale, text }) {
        if (message.channel.type === "dm")
            return;
        const flags = getFlags_1.default(args);
        const flagNames = flags.map((f) => f.flag);
        const booleanFlags = new Set(flags.map(({ flag }) => options[`--${flag}`]?.alias || `-${flag}`));
        const channel = message.mentions.channels.first() ||
            message.guild?.channels.cache.get(args[0]) ||
            message.channel;
        for (const { flag, index } of flags) {
            switch (flag) {
                case "help":
                case "h": {
                    return message.channel.send(`
\`\`\`
${__1.default}${this.name}

    SYNTAX:
        ${__1.default}${this.name} ${this.usage}

    OPTIONS:${Object.keys(options)
                        .map((flag) => `\n        ${`${flag}, ${options[flag].alias}`.padEnd(16, " ")}${options[flag].message}`)
                        .join("")}
    
    DEFAULT:
        Locks the channel
\`\`\`
`);
                }
                case "category":
                case "c":
                    const cat = message.guild?.channels.cache.get(args[index + 1]);
                    if (!cat)
                        return message.channel.send(`Could not find the category`);
                    if (cat.type !== "category")
                        return message.channel.send(`Channel must be of type category when using the \`category\` flag.`);
                    const channels = message.guild?.channels.cache.filter((ch) => ch.parentID === cat.id);
                    if (!channels || !channels.size)
                        return message.channel.send(`The category does not have any channels`);
                    await Promise.all(channels.map((ch) => client.commands.get("lock")?.callback({
                        message,
                        args: [ch.id, "-s"],
                        client,
                        locale,
                        text,
                    })));
                    if (!booleanFlags.has("-s"))
                        return message.channel.send(`Locked category ${cat.name}`);
                case "time":
                case "t":
                    const time = Math.max(Math.min(ms_1.default(args[index + 1]), 86400000), 60000);
                    if (!time)
                        return message.channel.send(`A time is required when using the \`time\` flag.`);
                    if (channel.type === "category")
                        return message.channel.send(`Categories can only be locked when using the \`category\` flag.`);
                    if (!booleanFlags.has("-d"))
                        await channel.createOverwrite(message.guild?.roles.cache.get(message.guild.id), {
                            SEND_MESSAGES: false,
                        });
                    setTimeout(() => {
                        client.commands.get("unlock")?.callback({
                            message,
                            args: [channel.id, "-s"],
                            client,
                            locale,
                            text,
                        });
                    }, time);
                    if (!booleanFlags.has("-s"))
                        return message.channel.send(`Locked channel <#${channel.id}> for ${ms_1.default(time, { long: true })}`);
            }
        }
        if (channel.type === "category")
            return message.channel.send(`Categories can only be locked when using the \`category\` flag.`);
        if (!booleanFlags.has("-d"))
            await channel.createOverwrite(message.guild?.roles.cache.get(message.guild.id), {
                SEND_MESSAGES: false,
            });
        if (booleanFlags.has("-s"))
            return;
        return message.channel.send(`Locked channel <#${channel.id}>`);
    },
};
