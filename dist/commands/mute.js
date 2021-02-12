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
const overrides_1 = __importDefault(require("../utils/overrides"));
const options = {
    "--forever": {
        alias: "-f",
        message: "Mute users indefinitely",
    },
    "--reaction": {
        alias: "-r",
        message: "Disable reactions as well",
    },
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
        message: "For testing purposes; does not mute",
    },
};
exports.default = {
    name: "mute",
    args: true,
    usage: "<arguments> [options]",
    callback({ message, args, client }) {
        var _a, _b, _c, _d, _e;
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
        No default action
\`\`\`
`);
                    }
                }
            }
            const time = ms_1.default(args[members.length] || "");
            if (!time && !booleanFlags.has("-f"))
                return message.channel.send("Please provide a valid time");
            const reason = args
                .slice(members.length + 1)
                .filter((arg) => !/--?\w+/.test(arg))
                .join(" ") || "No reason specified";
            let role = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.roles.cache.find((ro) => ro.name === "Kali Mute");
            let react = (_c = message.guild) === null || _c === void 0 ? void 0 : _c.roles.cache.find((ro) => ro.name === "Kali Reaction Mute");
            if (!role) {
                role = yield message.guild.roles.create({
                    data: {
                        name: "Kali Mute",
                        permissions: 1115136,
                        hoist: false,
                        mentionable: false,
                    },
                });
                (_d = message.guild) === null || _d === void 0 ? void 0 : _d.channels.cache.forEach((ch) => __awaiter(this, void 0, void 0, function* () {
                    yield overrides_1.default(ch, role);
                }));
            }
            if (!react) {
                react = yield message.guild.roles.create({
                    data: {
                        name: "Kali Reaction Mute",
                        permissions: 1115136,
                        hoist: false,
                        mentionable: false,
                    },
                });
                (_e = message.guild) === null || _e === void 0 ? void 0 : _e.channels.cache.forEach((ch) => __awaiter(this, void 0, void 0, function* () {
                    yield ch.createOverwrite(react, {
                        ADD_REACTIONS: false,
                    });
                }));
            }
            yield Promise.all(members.map((m, i) => __awaiter(this, void 0, void 0, function* () {
                var _f, _g;
                try {
                    if (!booleanFlags.has("-s"))
                        try {
                            const dm = yield m.createDM(true);
                            yield ((_f = (yield client.users.fetch(m.id))) === null || _f === void 0 ? void 0 : _f.createDM());
                            yield dm.send(`You have been muted in **${(_g = message.guild) === null || _g === void 0 ? void 0 : _g.name}** for \`${reason}\` for ${ms_1.default(time, { long: true })}`);
                        }
                        catch (_h) {
                            yield message.channel.send(`Could not send DM to **${m.user.tag}**`);
                        }
                    if (!booleanFlags.has("-d"))
                        yield m.roles.add(role);
                    if (!booleanFlags.has("-d") && booleanFlags.has("-r"))
                        yield m.roles.add(react);
                }
                catch (e) {
                    console.log(e);
                    members.splice(i, 1);
                    if (!booleanFlags.has("-s"))
                        yield message.channel.send(`Could not mute **${m.user.tag}**`);
                }
            })));
            if (!booleanFlags.has("-d") && !booleanFlags.has("-f"))
                setTimeout(() => {
                    members.forEach((m) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            if (m.roles.cache.has(role === null || role === void 0 ? void 0 : role.id))
                                yield m.roles.remove(role);
                        }
                        catch (_a) { }
                    }));
                }, time);
            if (!members.length)
                return message.channel.send(`Could not find any users to mute`);
            if (booleanFlags.has("-s"))
                return;
            return message.channel.send(new Embed_1.default()
                .setTitle(`Muted ${members.length} user${members.length !== 1 ? "s" : ""}`)
                .addField("Reason", `\`${reason}\``)
                .setDescription(`**Muted users:**\n${members.map((m) => `${m.user.tag}`).join("\n")}`));
        });
    },
};
