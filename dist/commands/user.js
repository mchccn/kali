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
const __1 = __importDefault(require(".."));
const Embed_1 = __importDefault(require("../utils/Embed"));
const getFlags_1 = __importDefault(require("../utils/getFlags"));
const options = {
    "--lookup": {
        alias: "-l",
        message: "Fetch a user by their id",
    },
    "--enhance": {
        alias: "-e",
        message: "Displays extra information",
    },
    "--icon": {
        alias: "-i",
        message: "Only show user avatars",
    },
    "--help": {
        alias: "-h",
        message: "Displays this nice little help message",
    },
    "--dev": {
        alias: "-d",
        message: "For testing purposes; does not display info",
    },
};
const userFlags = {
    DISCORD_EMPLOYEE: "Discord employee",
    PARTNERED_SERVER_OWNER: "Partnered server owner",
    BUGHUNTER_LEVEL_1: "Bughunter L1",
    BUGHUNTER_LEVEL_2: "Bughunter L2",
    HYPESQUAD_EVENTS: "HypeSquad events",
    HOUSE_BRAVERY: "House of Bravery",
    HOUSE_BRILLIANCE: "House of Brilliance",
    HOUSE_BALANCE: "House of Balance",
    EARLY_SUPPORTER: "Early supporter",
    TEAM_USER: "Team user",
    SYSTEM: "System",
    VERIFIED_BOT: "Verified bot",
    EARLY_VERIFIED_BOT_DEVELOPER: "Early verified bot developer",
};
exports.default = {
    name: "user",
    args: false,
    usage: "[arguments] [options]",
    description: "Displays general user info",
    callback({ message, args, client }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const flags = getFlags_1.default(args);
            const flagNames = flags.map((f) => f.flag);
            const booleanFlags = new Set(flags.map(({ flag }) => { var _a; return ((_a = options[`--${flag}`]) === null || _a === void 0 ? void 0 : _a.alias) || `-${flag}`; }));
            if (booleanFlags.has("-d"))
                return;
            let user = message.author;
            if (/\d{18}/.test(args[0])) {
                user = yield client.users.fetch(args[0].match(/(\d{18})/)[0]);
                if (!user)
                    return message.channel.send(`User not found`);
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
        Displays your info
\`\`\`
`);
                    }
                    case "icon":
                    case "i": {
                        return message.channel.send(new Embed_1.default()
                            .setTitle(user.username)
                            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 })));
                    }
                    case "lookup":
                    case "l": {
                        if (!/\d{18}/.test(args[0]))
                            return message.channel.send(`That's not an id`);
                        user = yield client.users.fetch(args[0]);
                        if (!user)
                            return message.channel.send(`User not found`);
                    }
                }
            }
            const embed = new Embed_1.default()
                .setTitle(user.username)
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setDescription(`**Last message**\n${aeroclient_1.utils.trim(((_a = user.lastMessage) === null || _a === void 0 ? void 0 : _a.content) || "", 1000)}`)
                .addField("Username", user.username, true)
                .addField("Tag", user.tag, true)
                .addField("Flags", ((_b = user.flags) === null || _b === void 0 ? void 0 : _b.toArray().map((f) => userFlags[f]).join("\n")) || "None")
                .addField("ID", user.id, true)
                .addField("Account created", user.createdAt.toDateString(), true);
            if (booleanFlags.has("-e"))
                embed
                    .addField("Discriminator", user.discriminator)
                    .addField("Locale", user.locale)
                    .addField("Is bot", user.bot, true)
                    .addField("Is system", user.system, true);
            return message.channel.send(embed);
        });
    },
};
