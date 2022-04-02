"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ms_1 = __importDefault(require("ms"));
const __1 = __importStar(require(".."));
const getFlags_1 = __importDefault(require("../utils/getFlags"));
const options = {
    "--ban": {
        alias: "-b",
        message: "Lockdown defense is ban instead of kick",
    },
    "--mute": {
        alias: "-m",
        message: "Lockdown defense is mute instead of kick",
    },
    "--full": {
        alias: "-f",
        message: "Locks every channel as well",
    },
    "--time": {
        alias: "-t",
        message: "Time to lockdown the server",
    },
    "--silent": {
        alias: "-s",
        message: "Lockdown the server silently",
    },
    "--help": {
        alias: "-h",
        message: "Displays this nice little help message",
    },
    "--dev": {
        alias: "-d",
        message: "For testing purposes; does not lockdown",
    },
};
const lockdown = new Map();
exports.default = {
    name: "lockdown",
    args: false,
    usage: "[options]",
    async callback({ message, args, client, text, locale }) {
        if (message.channel.type === "dm")
            return;
        const flags = getFlags_1.default(args);
        const flagNames = flags.map((f) => f.flag);
        const booleanFlags = new Set(flags.map(({ flag }) => options[`--${flag}`]?.alias || `-${flag}`));
        let ban = false;
        let mute = false;
        let time = 0;
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
        Puts the server in lockdown for one day
\`\`\`
`);
                }
                case "ban":
                case "b":
                    ban = true;
                    break;
                case "mute":
                case "m":
                    mute = true;
                    break;
                case "time":
                case "t":
                    time = Math.min(Math.max(ms_1.default(args[index + 1]), 60000), 86400000);
                    break;
            }
        }
        if (["off", "disable", "disabled", "false", "no", "stop"].includes(args[0])) {
            lockdown.delete(message.guild?.id);
            message.guild?.channels.cache.array().forEach(async (ch) => {
                try {
                    if (ch.type === "category") {
                        await client.commands.get("unlock")?.callback({
                            message,
                            args: ["-cs", ch.id],
                            client,
                            text,
                            locale,
                        });
                    }
                    else {
                        await client.commands.get("unlock")?.callback({
                            message,
                            args: ["-s", ch.id],
                            client,
                            text,
                            locale,
                        });
                    }
                }
                catch { }
            });
            if (!booleanFlags.has("-s"))
                return message.channel.send(`Lockdown has been turned off`);
        }
        if (booleanFlags.has("-f") && !booleanFlags.has("-d"))
            message.guild?.channels.cache.array().forEach(async (ch) => {
                try {
                    if (ch.type === "category") {
                        await client.commands.get("lock")?.callback({
                            message,
                            args: ["-cs", ch.id],
                            client,
                            text,
                            locale,
                        });
                    }
                    else {
                        await client.commands.get("lock")?.callback({
                            message,
                            args: ["-s", ch.id],
                            client,
                            text,
                            locale,
                        });
                    }
                }
                catch { }
            });
        if (!booleanFlags.has("-d")) {
            lockdown.set(message.guild?.id, {
                defense: ban ? "ban" : mute ? "mute" : "kick",
                start: Date.now(),
                time: time || 86400000,
                message: message.channel.id + message.id,
            });
            client.on("guildMemberAdd", (member) => lockdownInspect(member, client));
        }
        if (!booleanFlags.has("-s"))
            return message.channel.send(`Server is now in lockdown mode${time
                ? ` for ${ms_1.default(time, {
                    long: true,
                })}`
                : ""}`);
        return;
    },
};
async function lockdownInspect(member, client) {
    const lock = lockdown.get(member.guild.id);
    if (lock) {
        if (member.partial)
            await member.fetch();
        const dm = await member.createDM(true);
        await dm.send(`**${member.guild.name}** is currently under lockdown`);
        switch (lock.defense) {
            case "kick":
                return member.kick();
            case "ban":
                return member.ban();
            case "mute":
                const msg = await (await client.channels.fetch(lock.message.slice(0, 18))).messages.fetch(lock.message.slice(18));
                return client.commands.get("mute")?.callback({
                    message: msg,
                    args: [member.id, "-frs"],
                    client,
                    locale: "",
                    text: "",
                });
        }
    }
    return;
}
setInterval(async () => {
    for (const [id, lock] of lockdown) {
        if (Date.now() > lock.start + lock.time && lock.time) {
            lockdown.delete(id);
            const msg = await (await __1.client.channels.fetch(lock.message.slice(0, 18))).messages.fetch(lock.message.slice(18));
            (await __1.client.guilds.fetch(id)).channels.cache.forEach(async (ch) => {
                try {
                    if (ch.type === "category") {
                        await __1.client.commands.get("unlock")?.callback({
                            message: msg,
                            args: ["-cs", ch.id],
                            client: __1.client,
                            text: "",
                            locale: "",
                        });
                    }
                    else {
                        await __1.client.commands.get("unlock")?.callback({
                            message: msg,
                            args: ["-s", ch.id],
                            client: __1.client,
                            text: "",
                            locale: "",
                        });
                    }
                }
                catch { }
            });
        }
    }
}, 60000);
