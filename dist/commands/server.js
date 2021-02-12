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
        message: "Fetch a guild the bot is in by id",
    },
    "--enhance": {
        alias: "-e",
        message: "Displays extra information",
    },
    "--icon": {
        alias: "-i",
        message: "Only show guild icons",
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
exports.default = {
    name: "server",
    args: false,
    usage: "[arguments] [options]",
    callback({ message, args, client }) {
        return __awaiter(this, void 0, void 0, function* () {
            const flags = getFlags_1.default(args);
            const flagNames = flags.map((f) => f.flag);
            const booleanFlags = new Set(flags.map(({ flag }) => { var _a; return ((_a = options[`--${flag}`]) === null || _a === void 0 ? void 0 : _a.alias) || `-${flag}`; }));
            if (booleanFlags.has("-d"))
                return;
            let guild = message.guild;
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
        Displays server info
\`\`\`
`);
                    }
                    case "icon":
                    case "i": {
                        return message.channel.send(new Embed_1.default()
                            .setTitle(guild.name)
                            .setImage(guild.iconURL({ dynamic: true, size: 512 }) || ""));
                    }
                    case "lookup":
                    case "l": {
                        if (!/\d{18}/.test(args[0]))
                            return message.channel.send(`That's not an id`);
                        try {
                            guild = yield client.guilds.fetch(args[0]);
                        }
                        catch (_a) {
                            return message.channel.send(`Guild not found`);
                        }
                    }
                }
            }
            const embed = new Embed_1.default()
                .setTitle(guild.name)
                .setDescription(guild.description || "No description")
                .setThumbnail(guild.iconURL({ dynamic: true }) || "")
                .setImage(guild.bannerURL({
                format: "png",
                size: 512,
            }) || "")
                .addField("Members", guild.memberCount, true)
                .addField("Channels", Object.keys(channelInfo(guild)).map((k) => {
                return channelInfo(guild)[k] > 0
                    ? `**${k[0].toUpperCase() + k.slice(1)}:** ${channelInfo(guild)[k]}`
                    : "";
            }), true)
                .addField("Roles", guild.roles.cache.size, true)
                .addField("Admins", guild.members.cache.filter((m) => !m.user.bot && m.hasPermission("ADMINISTRATOR")).size, true)
                .addField("Server Boost Level", guild.premiumTier, true)
                .addField("Server Boosts", guild.premiumSubscriptionCount, true)
                .addField("Region", guild.region);
            if (booleanFlags.has("-e"))
                embed
                    .setImage(guild.bannerURL() || "")
                    .addField("Verification level", aeroclient_1.utils.formatMacroCase(guild.verificationLevel), true)
                    .addField("MFA level", guild.mfaLevel, true)
                    .addField("Public updates channel", guild.publicUpdatesChannel, true)
                    .addField("Rules channel", guild.rulesChannel, true)
                    .addField("System channel", guild.systemChannel, true)
                    .addField("AFK channel", guild.afkChannel, true)
                    .addField("AFK timeout", guild.afkTimeout, true)
                    .addField("Content filter", aeroclient_1.utils.formatMacroCase(guild.explicitContentFilter), true);
            return message.channel.send(embed);
        });
    },
};
function channelInfo(guild) {
    const channels = {
        text: 0,
        voice: 0,
        category: 0,
        news: 0,
        store: 0,
    };
    guild.channels.cache.each((c) => channels[c.type]++);
    return channels;
}
