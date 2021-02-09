import { utils } from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/dist/types";
import { Guild } from "discord.js";
import prefix from "..";
import Embed from "../utils/Embed";
import getFlags from "../utils/getFlags";

const options: {
    [flag: string]: {
        alias: string;
        message: string;
    };
} = {
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

export default {
    name: "server",
    args: false,
    usage: "[arguments] [options]",
    async callback({ message, args, client }) {
        const flags = getFlags(args);
        const flagNames = flags.map((f) => f.flag);
        const booleanFlags = new Set(
            flags.map(({ flag }) => options[`--${flag}`]?.alias || `-${flag}`)
        );

        if (booleanFlags.has("-d")) return;

        let guild = message.guild!;

        for (const { flag, index } of flags) {
            switch (flag) {
                case "help":
                case "h": {
                    return message.channel.send(`
\`\`\`
${prefix}${this.name}

    SYNTAX:
        ${prefix}${this.name} ${this.usage}

    OPTIONS:${Object.keys(options).map(
        (flag) =>
            `\n        ${`${flag}, ${options[flag].alias}`.padEnd(16, " ")}${
                options[flag].message
            }`
    )}
    
    DEFAULT:
        Displays server info
\`\`\`
`);
                }
                case "icon":
                case "i": {
                    return message.channel.send(
                        new Embed()
                            .setTitle(guild.name)
                            .setImage(guild.iconURL({ dynamic: true, size: 512 }) || "")
                    );
                }
                case "lookup":
                case "l": {
                    if (!/\d{18}/.test(args[0]))
                        return message.channel.send(`That's not an id`);

                    try {
                        guild = await client.guilds.fetch(args[0]);
                    } catch {
                        return message.channel.send(`Guild not found`);
                    }
                }
            }
        }

        const embed = new Embed()
            .setTitle(guild.name)
            .setDescription(guild.description || "No description")
            .setThumbnail(guild.iconURL({ dynamic: true }) || "")
            .setImage(
                guild.bannerURL({
                    format: "png",
                    size: 512,
                }) || ""
            )
            .addField("Members", guild.memberCount, true)
            .addField(
                "Channels",
                Object.keys(channelInfo(guild)).map((k) => {
                    return channelInfo(guild)[k] > 0
                        ? `**${k[0].toUpperCase() + k.slice(1)}:** ${channelInfo(guild)[k]}`
                        : "";
                }),
                true
            )
            .addField("Roles", guild.roles.cache.size, true)
            .addField(
                "Admins",
                guild.members.cache.filter(
                    (m) => !m.user.bot && m.hasPermission("ADMINISTRATOR")
                ).size,
                true
            )
            .addField("Server Boost Level", guild.premiumTier, true)
            .addField("Server Boosts", guild.premiumSubscriptionCount, true)
            .addField("Region", guild.region);

        if (booleanFlags.has("-e"))
            embed
                .setImage(guild.bannerURL() || "")
                .addField(
                    "Verification level",
                    utils.formatMacroCase(guild.verificationLevel),
                    true
                )
                .addField("MFA level", guild.mfaLevel, true)
                .addField("Public updates channel", guild.publicUpdatesChannel, true)
                .addField("Rules channel", guild.rulesChannel, true)
                .addField("System channel", guild.systemChannel, true)
                .addField("AFK channel", guild.afkChannel, true)
                .addField("AFK timeout", guild.afkTimeout, true)
                .addField(
                    "Content filter",
                    utils.formatMacroCase(guild.explicitContentFilter),
                    true
                );

        return message.channel.send(embed);
    },
} as Command;

function channelInfo(guild: Guild): { [type: string]: number } {
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
