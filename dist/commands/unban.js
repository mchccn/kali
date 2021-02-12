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
const Embed_1 = __importDefault(require("../utils/Embed"));
const getFlags_1 = __importDefault(require("../utils/getFlags"));
const options = {
    "--silent": {
        alias: "-s",
        message: "Unbans users silently; does not display output",
    },
    "--help": {
        alias: "-h",
        message: "Displays this nice little help message",
    },
    "--dev": {
        alias: "-d",
        message: "For testing purposes; does not unban",
    },
};
exports.default = {
    name: "unban",
    args: true,
    usage: "[options] <arguments>",
    callback({ message, args, client }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (message.channel.type === "dm")
                return;
            const flags = getFlags_1.default(args);
            const booleanFlags = new Set(flags.map(({ flag }) => { var _a; return ((_a = options[`--${flag}`]) === null || _a === void 0 ? void 0 : _a.alias) || `-${flag}`; }));
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
            const users = [];
            for (const arg of args) {
                if (/^\d{18}$/.test(arg)) {
                    const user = client.users.cache.get(arg) || (yield client.users.fetch(arg));
                    if (user && user.id !== ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id))
                        users.push(user);
                }
                else
                    break;
            }
            const reason = args.slice(users.length).join(" ") || "No reason specified";
            yield Promise.all(users.map((u, i) => __awaiter(this, void 0, void 0, function* () {
                var _b;
                try {
                    if (!booleanFlags.has("-d"))
                        yield ((_b = message.guild) === null || _b === void 0 ? void 0 : _b.members.unban(u, reason));
                }
                catch (_c) {
                    users.splice(i, 1);
                    if (!booleanFlags.has("-s"))
                        yield message.channel.send(`Could not unban **${u.tag}**`);
                }
            })));
            if (booleanFlags.has("-s"))
                return;
            if (!users.length)
                return message.channel.send(`Could not find any users to unban`);
            return message.channel.send(new Embed_1.default()
                .setTitle(`Unbanned ${users.length} user${users.length !== 1 ? "s" : ""}`)
                .addField("Reason", `\`${reason}\``)
                .setDescription(`**Unbanned users:**\n${users.map((u) => `${u.tag}`).join("\n")}`));
        });
    },
};
