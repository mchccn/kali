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
const ms_1 = __importDefault(require("ms"));
const __1 = __importDefault(require(".."));
const Embed_1 = __importDefault(require("../utils/Embed"));
const getFlags_1 = __importDefault(require("../utils/getFlags"));
const options = {
    "--name": {
        alias: "-n",
        message: "Bans all users whose name has the specified word in",
    },
    "--regex": {
        alias: "-r",
        message: "Bans all users whose name match the regex",
    },
    "--silent": {
        alias: "-s",
        message: "Bans users silently; does not DM them or displays output",
    },
    "--soft": {
        alias: "-S",
        message: "Effectively kicks users and clears their messages",
    },
    "--hard": {
        alias: "-H",
        message: "Bans users and appends your custom message to the DM",
    },
    "--help": {
        alias: "-h",
        message: "Displays this nice little help message",
    },
    "--dev": {
        alias: "-d",
        message: "For testing purposes; does not ban",
    },
};
exports.default = {
    name: "tempban",
    args: true,
    usage: "[options] <arguments>",
    callback({ message, args, client, locale, text }) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const flags = getFlags_1.default(args);
            const flagNames = flags.map((f) => f.flag);
            const booleanFlags = new Set(flags.map(({ flag }) => { var _a; return ((_a = options[`--${flag}`]) === null || _a === void 0 ? void 0 : _a.alias) || `-${flag}`; }));
            const members = [];
            for (const arg of args) {
                if (/\d{18}/.test(arg)) {
                    const member = yield message.guild.members.fetch(arg.match(/(\d{18})/)[0]);
                    if (member && member.id !== ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id))
                        members.push(member);
                }
                else
                    break;
            }
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
        Bans users by mention or id with an optional reason
\`\`\`
`);
                    }
                    case "name":
                    case "n": {
                        if (!args[index + 1])
                            return message.channel.send(`A name is required when using the \`name\` flag.`);
                        members.length = 0;
                        members.push(...(_b = message.guild) === null || _b === void 0 ? void 0 : _b.members.cache.filter((m) => m.displayName.includes(args[index + 1])).array());
                        break;
                    }
                    case "regex":
                    case "r": {
                        if (!args[index + 1])
                            return message.channel.send(`A regex is required when using the \`regex\` flag.`);
                        if (args[index + 1].length > 12 || args[index + 1].length < 3)
                            return message.channel.send(`Regex must be between 3 and 12 characters long.`);
                        const regex = new RegExp(args[index + 1] || "");
                        members.length = 0;
                        members.push(...(_c = message.guild) === null || _c === void 0 ? void 0 : _c.members.cache.filter((m) => regex.test(m.displayName)).array());
                        break;
                    }
                }
            }
            const time = Math.max(ms_1.default(args[members.length]), 60000);
            if (!time)
                return message.channel.send(`Please include a time.`);
            const reason = args
                .slice(members.length +
                (flagNames.includes("r") || flagNames.includes("regex")
                    ? flags[flagNames.lastIndexOf("r") < 0
                        ? flagNames.lastIndexOf("regex")
                        : flagNames.lastIndexOf("r")].index
                    : flagNames.includes("n") || flagNames.includes("name")
                        ? flags[flagNames.lastIndexOf("n") < 0
                            ? flagNames.lastIndexOf("name")
                            : flagNames.lastIndexOf("n")].index
                        : 0) +
                1, flagNames.includes("H") || flagNames.includes("hard")
                ? args.lastIndexOf([...args].reverse().find((a) => a.startsWith("-")))
                : undefined)
                .filter((arg) => !/--?\w+/.test(arg))
                .join(" ") || "No reason specified";
            yield Promise.all(members.map((m, i) => __awaiter(this, void 0, void 0, function* () {
                var _d, _e, _f, _g;
                try {
                    if (!booleanFlags.has("-s"))
                        try {
                            const dm = yield m.createDM(true);
                            yield ((_d = (yield client.users.fetch(m.id))) === null || _d === void 0 ? void 0 : _d.createDM());
                            yield dm.send(`You have been ${booleanFlags.has("-S") ? "soft" : ""}banned from **${(_e = message.guild) === null || _e === void 0 ? void 0 : _e.name}** for \`${reason}\` for ${ms_1.default(time, { long: true })}${booleanFlags.has("-H")
                                ? `\n**${message.author.tag}**'s comment: ${args
                                    .slice(flags[flagNames.indexOf("H") < 0
                                    ? flagNames.indexOf("hard")
                                    : flagNames.indexOf("H")].index + 1)
                                    .join(" ")}`
                                : ""}`.slice(0, 2000));
                        }
                        catch (_h) {
                            yield message.channel.send(`Could not send DM to **${m.user.tag}**`);
                        }
                    if (!booleanFlags.has("-d"))
                        yield m.ban({ reason });
                    if (booleanFlags.has("-S")) {
                        yield ((_f = message.guild) === null || _f === void 0 ? void 0 : _f.members.unban(m.user));
                        (_g = client.commands.get("clear")) === null || _g === void 0 ? void 0 : _g.callback({
                            message,
                            args: ["100", "-u", m.id],
                            client,
                            locale,
                            text,
                        });
                    }
                }
                catch (e) {
                    console.log(e);
                    members.splice(i, 1);
                    if (!booleanFlags.has("-s"))
                        yield message.channel.send(`Could not ban **${m.user.tag}**`);
                }
            })));
            if (!members.length)
                return message.channel.send(`Could not find any users to ban`);
            if (!booleanFlags.has("-d"))
                setTimeout(() => {
                    members.forEach((m) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        try {
                            yield ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.unban(m.id, "Temporary ban over"));
                        }
                        catch (_b) { }
                    }));
                }, time);
            if (booleanFlags.has("-s"))
                return;
            return message.channel.send(new Embed_1.default()
                .setTitle(`Banned ${members.length} user${members.length !== 1 ? "s" : ""}`)
                .addField("Reason", `\`${reason}\``)
                .addField("Time", ms_1.default(time, {
                long: true,
            }))
                .setDescription(`**Banned users:**\n${members.map((m) => `${m.user.tag}`).join("\n")}`));
        });
    },
};
