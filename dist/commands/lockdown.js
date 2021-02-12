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
    callback({ message, args, client, text, locale }) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (message.channel.type === "dm")
                return;
            const flags = getFlags_1.default(args);
            const flagNames = flags.map((f) => f.flag);
            const booleanFlags = new Set(flags.map(({ flag }) => { var _a; return ((_a = options[`--${flag}`]) === null || _a === void 0 ? void 0 : _a.alias) || `-${flag}`; }));
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
                lockdown.delete((_a = message.guild) === null || _a === void 0 ? void 0 : _a.id);
                (_b = message.guild) === null || _b === void 0 ? void 0 : _b.channels.cache.array().forEach((ch) => __awaiter(this, void 0, void 0, function* () {
                    var _e, _f;
                    try {
                        if (ch.type === "category") {
                            yield ((_e = client.commands.get("unlock")) === null || _e === void 0 ? void 0 : _e.callback({
                                message,
                                args: ["-cs", ch.id],
                                client,
                                text,
                                locale,
                            }));
                        }
                        else {
                            yield ((_f = client.commands.get("unlock")) === null || _f === void 0 ? void 0 : _f.callback({
                                message,
                                args: ["-s", ch.id],
                                client,
                                text,
                                locale,
                            }));
                        }
                    }
                    catch (_g) { }
                }));
                if (!booleanFlags.has("-s"))
                    return message.channel.send(`Lockdown has been turned off`);
            }
            if (booleanFlags.has("-f") && !booleanFlags.has("-d"))
                (_c = message.guild) === null || _c === void 0 ? void 0 : _c.channels.cache.array().forEach((ch) => __awaiter(this, void 0, void 0, function* () {
                    var _h, _j;
                    try {
                        if (ch.type === "category") {
                            yield ((_h = client.commands.get("lock")) === null || _h === void 0 ? void 0 : _h.callback({
                                message,
                                args: ["-cs", ch.id],
                                client,
                                text,
                                locale,
                            }));
                        }
                        else {
                            yield ((_j = client.commands.get("lock")) === null || _j === void 0 ? void 0 : _j.callback({
                                message,
                                args: ["-s", ch.id],
                                client,
                                text,
                                locale,
                            }));
                        }
                    }
                    catch (_k) { }
                }));
            if (!booleanFlags.has("-d")) {
                lockdown.set((_d = message.guild) === null || _d === void 0 ? void 0 : _d.id, {
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
        });
    },
};
function lockdownInspect(member, client) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const lock = lockdown.get(member.guild.id);
        if (lock) {
            if (member.partial)
                yield member.fetch();
            const dm = yield member.createDM(true);
            yield dm.send(`**${member.guild.name}** is currently under lockdown`);
            switch (lock.defense) {
                case "kick":
                    return member.kick();
                case "ban":
                    return member.ban();
                case "mute":
                    const msg = yield (yield client.channels.fetch(lock.message.slice(0, 18))).messages.fetch(lock.message.slice(18));
                    return (_a = client.commands.get("mute")) === null || _a === void 0 ? void 0 : _a.callback({
                        message: msg,
                        args: [member.id, "-frs"],
                        client,
                        locale: "",
                        text: "",
                    });
            }
        }
        return;
    });
}
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    for (const [id, lock] of lockdown) {
        if (Date.now() > lock.start + lock.time && lock.time) {
            lockdown.delete(id);
            const msg = yield (yield __1.client.channels.fetch(lock.message.slice(0, 18))).messages.fetch(lock.message.slice(18));
            (yield __1.client.guilds.fetch(id)).channels.cache.forEach((ch) => __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b;
                try {
                    if (ch.type === "category") {
                        yield ((_a = __1.client.commands.get("unlock")) === null || _a === void 0 ? void 0 : _a.callback({
                            message: msg,
                            args: ["-cs", ch.id],
                            client: __1.client,
                            text: "",
                            locale: "",
                        }));
                    }
                    else {
                        yield ((_b = __1.client.commands.get("unlock")) === null || _b === void 0 ? void 0 : _b.callback({
                            message: msg,
                            args: ["-s", ch.id],
                            client: __1.client,
                            text: "",
                            locale: "",
                        }));
                    }
                }
                catch (_c) { }
            }));
        }
    }
}), 60000);
