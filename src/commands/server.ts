import { Command } from "@aeroware/aeroclient/dist/types";
import { CategoryChannel, Guild, TextChannel, VoiceChannel } from "discord.js";
import fetch from "node-fetch";
import prefix from "..";
import Embed from "../utils/Embed";
import getFlags from "../utils/getFlags";

const options: {
    [flag: string]: {
        alias: string;
        message: string;
    };
} = {
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
        message: "For testing purposes; does not do anything",
    },
};

export default {
    name: "server",
    args: false,
    usage: "[section] [subsection] [arguments]",
    async callback({ message, args, client }) {
        const flags = getFlags(args);
        const flagNames = flags.map((f) => f.flag);
        const booleanFlags = new Set(
            flags.map(({ flag }) => options[`--${flag}`]?.alias || `-${flag}`)
        );

        const guild = message.guild!;

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
        Displays general info about the server
\`\`\`
`);
                }
            }
        }

        if (!args.length) {
            return message.channel.send(
                new Embed()
                    .setTitle(guild.name)
                    .setDescription(guild.description || "No description")
                    .setThumbnail(guild.iconURL({ dynamic: true }) || "")
                    .setImage(
                        guild.bannerURL({
                            format: "png",
                            size: 512,
                        }) || ""
                    )
                    .addFields(
                        {
                            name: "Members",
                            value: guild.memberCount,
                            inline: true,
                        },
                        {
                            name: "People",
                            value: guild.members.cache.filter((m) => !m.user.bot).size,
                            inline: true,
                        },
                        {
                            name: "Bots",
                            value: guild.members.cache.filter((m) => m.user.bot).size,
                            inline: true,
                        },
                        {
                            name: "Owner",
                            value: guild.owner,
                        },
                        {
                            name: "Channels",
                            value: Object.keys(channelInfo(guild)).map((k) => {
                                // @ts-ignore
                                return channelInfo(guild)[k] > 0
                                    ? // @ts-ignore
                                      `**${k}:** ${channelInfo(guild)[k]}`
                                    : "";
                            }),
                            inline: true,
                        },
                        {
                            name: "Roles",
                            value: guild.roles.cache.size,
                            inline: true,
                        },
                        {
                            name: "Admins",
                            value: guild.members.cache.filter((m) =>
                                m.hasPermission("ADMINISTRATOR")
                            ).size,
                            inline: true,
                        },
                        {
                            name: "Server Boost Level",
                            value: guild.premiumTier,
                            inline: true,
                        },
                        {
                            name: "Server Boosts",
                            value: guild.premiumSubscriptionCount,
                            inline: true,
                        },
                        {
                            name: "Region",
                            value: guild.region,
                            inline: true,
                        }
                    )
            );
        }

        if (!booleanFlags.has("-d"))
            switch (args[0]) {
                case "roles": {
                    //TODO: make subcommands
                }
                case "channels": {
                    switch (args[1]) {
                        case "create": {
                            //TODO: make interactive form
                        }
                        case "delete": {
                            if (!args[2])
                                return message.channel.send(`Please provide the channel`);
                            if (!/\d{18}/.test(args[2]))
                                return message.channel.send(`Please provide a valid channel`);
                            const id = args[2].match(/(\d{18})/)![0];
                            const channel = message.guild?.channels.cache.get(id);
                            if (!channel) return message.channel.send(`Channel not found`);
                            await channel.delete();
                            return message.channel.send(`Deleted channel successfully`);
                        }
                        case "info": {
                            if (!args[2])
                                return message.channel.send(`Please provide the channel`);
                            if (!/\d{18}/.test(args[2]))
                                return message.channel.send(`Please provide a valid channel`);
                            const id = args[2].match(/(\d{18})/)![0];
                            const channel = message.guild?.channels.cache.get(id);
                            if (!channel) return message.channel.send(`Channel not found`);
                            if (channel.type === "category") {
                                return message.channel.send(
                                    new Embed()
                                        .setTitle(channel?.name)
                                        .setDescription(
                                            `**Channels**\n${(channel as CategoryChannel).children
                                                .map((child) =>
                                                    child.type === "voice"
                                                        ? `🔊 ${child.name}`
                                                        : `<#${child.id}>`
                                                )
                                                .join("\n")}`
                                        )
                                        .addField("Type", channel.type, true)
                                        .addField("ID", (channel as CategoryChannel).id, true)
                                        .addField(
                                            "Created at",
                                            (channel as CategoryChannel).createdAt.toDateString(),
                                            true
                                        )
                                );
                            }
                            if (channel.type === "voice") {
                                return message.channel.send(
                                    new Embed()
                                        .setTitle(channel?.name)
                                        .addField(
                                            "User limit",
                                            (channel as VoiceChannel).userLimit,
                                            true
                                        )
                                        .addField("Type", channel.type, true)
                                        .addField(
                                            "Bitrate",
                                            (channel as VoiceChannel).bitrate,
                                            true
                                        )
                                        .addField(
                                            "Parent",
                                            (channel as VoiceChannel).parent?.name || "None"
                                        )
                                        .addField("ID", (channel as VoiceChannel).id, true)
                                        .addField(
                                            "Created at",
                                            (channel as VoiceChannel).createdAt.toDateString(),
                                            true
                                        )
                                );
                            }
                            if (channel.type === "store")
                                return message.channel.send(`Store channels are not supported`);
                            return message.channel.send(
                                new Embed()
                                    .setTitle(channel?.name)
                                    .setDescription(
                                        (channel as TextChannel).topic || "No topic"
                                    )
                                    .addField("NSFW", (channel as TextChannel).nsfw, true)
                                    .addField("Type", channel.type, true)
                                    .addField(
                                        "Rate limit",
                                        (channel as TextChannel).rateLimitPerUser + " seconds",
                                        true
                                    )
                                    .addField(
                                        "Parent",
                                        (channel as TextChannel).parent?.name || "None"
                                    )
                                    .addField("ID", (channel as TextChannel).id, true)
                                    .addField(
                                        "Created at",
                                        (channel as TextChannel).createdAt.toDateString(),
                                        true
                                    )
                            );
                        }
                    }
                }
                case "emoji": {
                    switch (args[1]) {
                        case "create": {
                            if (!args[2] || !args[3])
                                return message.channel.send(`Please provide the name and URL`);
                            try {
                                const emoji = await message.guild?.emojis.create(
                                    await (await fetch(args[3])).buffer(),
                                    args[2]
                                );
                                return message.channel.send(
                                    `Emoji created: <${emoji?.animated ? "a" : ""}:${
                                        emoji?.name
                                    }:${emoji?.id}>`
                                );
                            } catch {
                                return message.channel.send(`Emoji creation failed`);
                            }
                        }
                        case "delete":
                            if (!args[2])
                                return message.channel.send(`Please provide the name`);
                            try {
                                const emoji = message.guild?.emojis.cache.find(
                                    (e) => e.name === args[2]
                                );
                                await emoji?.delete();
                                return message.channel.send(`Emoji was deleted`);
                            } catch {
                                return message.channel.send(`Emoji deletion failed`);
                            }
                    }
                }
                case "settings": {
                    switch (args[1]) {
                        case "name": {
                            if (!args[2])
                                return message.channel.send(`Please provide the name`);
                            const name = args.slice(2).join(" ");
                            try {
                                await guild.setName(args.slice(2).join(" "));
                                return message.channel.send(`Server name set to \`${name}\``);
                            } catch {
                                return message.channel.send(`Settings update failed`);
                            }
                        }
                        case "icon": {
                            if (!args[2])
                                return message.channel.send(`Please provide the setting`);
                            const icon = args[2];
                            try {
                                await guild.setIcon(icon);
                                return message.channel.send(`Icon was updated!`);
                            } catch {
                                return message.channel.send(`The icon must be a URL`);
                            }
                        }
                        case "widget": {
                            if (message.channel.type === "dm") return;
                            if (!args[2]) return message.channel.send(`Please provide the URL`);
                            if (!["true", "false"].includes(args[2].toLowerCase()))
                                return message.channel.send(`Setting must be true or false`);
                            try {
                                await guild.setWidget({
                                    channel: message.channel,
                                    enabled: args[2].toLowerCase() === "true",
                                });
                                return message.channel.send(
                                    `Widget has been ${
                                        args[2].toLowerCase() === "true"
                                            ? "enabled"
                                            : "disabled"
                                    }`
                                );
                            } catch {
                                return message.channel.send(`Settings update failed`);
                            }
                        }
                        case "region": {
                            if (message.channel.type === "dm") return;
                            if (!args[2])
                                return message.channel.send(`Please provide the region`);
                            try {
                                await guild.setRegion(args[2]);
                                return message.channel.send(
                                    `Region has been set to \`${args[2]}\``
                                );
                            } catch {
                                return message.channel.send(`Settings update failed`);
                            }
                        }
                        case "locale": {
                            if (message.channel.type === "dm") return;
                            if (!args[2])
                                return message.channel.send(`Please provide the locale`);
                            try {
                                await guild.setPreferredLocale(args[2]);
                                return message.channel.send(
                                    `Locale has been set to \`${args[2]}\``
                                );
                            } catch {
                                return message.channel.send(`Settings update failed`);
                            }
                        }
                        case "banner":
                            if (!args[2]) return message.channel.send(`Please provide the URL`);
                            try {
                                await message.guild?.setBanner(args[2]);
                                return message.channel.send(`Server banner updated!`);
                            } catch {
                                return message.channel.send(`Settings update failed`);
                            }
                            break;
                        case "splash":
                            if (!args[2]) return message.channel.send(`Please provide the URL`);
                            try {
                                await message.guild?.setSplash(args[2]);
                                return message.channel.send(`Server splash set!`);
                            } catch {
                                return message.channel.send(`Settings update failed`);
                            }
                            break;
                        case "discovery":
                            if (!args[2]) return message.channel.send(`Please provide the URL`);
                            try {
                                await message.guild?.setDiscoverySplash(args[2]);
                                return message.channel.send(`Discovery splash set!`);
                            } catch {
                                return message.channel.send(`Settings update failed`);
                            }
                            break;
                        case "template":
                            if (!args[2]) return message.channel.send(`Please provide a name`);
                            try {
                                await message.guild?.createTemplate(
                                    args[2],
                                    args.slice(3).join(" ") || ""
                                );
                                return message.channel.send(`Template created!`);
                            } catch {
                                return message.channel.send(`Failed to create a template`);
                            }
                            break;
                    }
                }
            }

        return;
    },
} as Command;

function channelInfo(guild: Guild) {
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
