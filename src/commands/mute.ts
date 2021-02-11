import { Command } from "@aeroware/aeroclient/dist/types";
import { GuildMember } from "discord.js";
import ms from "ms";
import prefix from "..";
import Embed from "../utils/Embed";
import getFlags from "../utils/getFlags";
import muteOverrides from "../utils/overrides";

const options: {
    [flag: string]: {
        alias: string;
        message: string;
    };
} = {
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

export default {
    name: "mute",
    args: true,
    usage: "<arguments> [options]",
    async callback({ message, args, client }) {
        const flags = getFlags(args);
        const flagNames = flags.map((f) => f.flag);
        const booleanFlags = new Set(
            flags.map(({ flag }) => options[`--${flag}`]?.alias || `-${flag}`)
        );

        const members: GuildMember[] = [];

        for (const arg of args) {
            if (/\d{18}/.test(arg)) {
                const member = await message.guild!.members.fetch(arg.match(/(\d{18})/)![0]);
                if (member && member.id !== client.user?.id) members.push(member);
            } else break;
        }

        for (const { flag, index } of flags) {
            switch (flag) {
                case "help":
                case "h": {
                    return message.channel.send(`
\`\`\`
${prefix}${this.name}

    SYNTAX:
        ${prefix}${this.name} ${this.usage}

    OPTIONS:${Object.keys(options)
        .map(
            (flag) =>
                `\n        ${`${flag}, ${options[flag].alias}`.padEnd(16, " ")}${
                    options[flag].message
                }`
        )
        .join("")}
    
    DEFAULT:
        No default action
\`\`\`
`);
                }
            }
        }

        const time = ms(args[members.length]);
        if (!time && !booleanFlags.has("-f"))
            return message.channel.send("Please provide a valid time");

        const reason =
            args
                .slice(members.length + 1)
                .filter((arg) => !/--?\w+/.test(arg))
                .join(" ") || "No reason specified";

        let role = message.guild?.roles.cache.find((ro) => ro.name === "Kali Mute");
        let react = message.guild?.roles.cache.find((ro) => ro.name === "Kali Reaction Mute");

        if (!role) {
            role = await message.guild!.roles.create({
                data: {
                    name: "Kali Mute",
                    permissions: 1115136,
                    hoist: false,
                    mentionable: false,
                },
            });

            message.guild?.channels.cache.forEach(async (ch) => {
                await muteOverrides(ch, role!);
            });
        }

        if (!react) {
            react = await message.guild!.roles.create({
                data: {
                    name: "Kali Reaction Mute",
                    permissions: 1115136,
                    hoist: false,
                    mentionable: false,
                },
            });

            message.guild?.channels.cache.forEach(async (ch) => {
                await ch.createOverwrite(react!, {
                    ADD_REACTIONS: false,
                });
            });
        }

        await Promise.all(
            members.map(async (m, i) => {
                try {
                    if (!booleanFlags.has("-s"))
                        try {
                            const dm = await m.createDM(true);
                            await (await client.users.fetch(m.id))?.createDM();
                            await dm.send(
                                `You have been muted in **${
                                    message.guild?.name
                                }** for \`${reason}\` for ${ms(time, { long: true })}`
                            );
                        } catch {
                            await message.channel.send(
                                `Could not send DM to **${m.user.tag}**`
                            );
                        }

                    if (!booleanFlags.has("-d")) await m.roles.add(role!);
                    if (!booleanFlags.has("-d") && booleanFlags.has("-r"))
                        await m.roles.add(react!);
                } catch (e) {
                    console.log(e);

                    members.splice(i, 1);
                    if (!booleanFlags.has("-s"))
                        await message.channel.send(`Could not mute **${m.user.tag}**`);
                }
            })
        );

        if (!booleanFlags.has("-d") && !booleanFlags.has("-f"))
            setTimeout(() => {
                members.forEach(async (m) => {
                    try {
                        if (m.roles.cache.has(role?.id!)) await m.roles.remove(role!);
                    } catch {}
                });
            }, time);

        if (!members.length) return message.channel.send(`Could not find any users to mute`);

        if (booleanFlags.has("-s")) return;

        return message.channel.send(
            new Embed()
                .setTitle(`Muted ${members.length} user${members.length !== 1 ? "s" : ""}`)
                .addField("Reason", `\`${reason}\``)
                .setDescription(
                    `**Muted users:**\n${members.map((m) => `${m.user.tag}`).join("\n")}`
                )
        );
    },
} as Command;
