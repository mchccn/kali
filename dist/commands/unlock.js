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
const __1 = __importDefault(require(".."));
const getFlags_1 = __importDefault(require("../utils/getFlags"));
const options = {
    "--category": {
        alias: "-c",
        message: "Unlocks an entire category",
    },
    "--silent": {
        alias: "-s",
        message: "Unlocks the channel silently; does not display output",
    },
    "--help": {
        alias: "-h",
        message: "Displays this nice little help message",
    },
    "--dev": {
        alias: "-d",
        message: "For testing purposes; does not unlock",
    },
};
exports.default = {
    name: "unlock",
    args: false,
    usage: "<arguments> [options]",
    callback({ message, args, client, locale, text }) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (message.channel.type === "dm")
                return;
            const flags = getFlags_1.default(args);
            const flagNames = flags.map((f) => f.flag);
            const booleanFlags = new Set(flags.map(({ flag }) => { var _a; return ((_a = options[`--${flag}`]) === null || _a === void 0 ? void 0 : _a.alias) || `-${flag}`; }));
            const channel = message.mentions.channels.first() || ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.get(args[0])) ||
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
        Unlocks the channel
\`\`\`
`);
                    }
                    case "category":
                    case "c":
                        const cat = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.channels.cache.get(args[index + 1]);
                        if (!cat)
                            return message.channel.send(`Could not find the category`);
                        if (cat.type !== "category")
                            return message.channel.send(`Channel must be of type category when using the \`category\` flag.`);
                        const channels = (_c = message.guild) === null || _c === void 0 ? void 0 : _c.channels.cache.filter((ch) => ch.parentID === cat.id);
                        if (!channels || !channels.size)
                            return message.channel.send(`The category does not have any channels`);
                        yield Promise.all(channels.map((ch) => { var _a; return (_a = client.commands.get("unlock")) === null || _a === void 0 ? void 0 : _a.callback({
                            message,
                            args: [ch.id, "-s"],
                            client,
                            locale,
                            text,
                        }); }));
                        if (!booleanFlags.has("-s"))
                            return message.channel.send(`Unlocked category ${cat.name}`);
                }
            }
            if (channel.type === "category")
                return message.channel.send(`Categories can only be unlocked when using the \`category\` flag.`);
            if (!booleanFlags.has("-d"))
                yield channel.createOverwrite((_d = message.guild) === null || _d === void 0 ? void 0 : _d.roles.cache.get(message.guild.id), {
                    SEND_MESSAGES: true,
                });
            if (booleanFlags.has("-s"))
                return;
            return message.channel.send(`Unlocked channel <#${channel.id}>`);
        });
    },
};
