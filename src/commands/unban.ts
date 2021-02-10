import { Command } from "@aeroware/aeroclient/dist/types";
import { User } from "discord.js";
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

export default {
    name: "unban",
    args: true,
    usage: "[options] <arguments>",
    async callback({ message, args, client }) {
        if (message.channel.type === "dm") return;

        const flags = getFlags(args);
        const booleanFlags = new Set(
            flags.map(({ flag }) => options[`--${flag}`]?.alias || `-${flag}`)
        );

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

        const users: User[] = [];

        for (const arg of args) {
            if (/^\d{18}$/.test(arg)) {
                const user = client.users.cache.get(arg) || (await client.users.fetch(arg));
                if (user && user.id !== client.user?.id) users.push(user);
            } else break;
        }

        const reason = args.slice(users.length).join(" ") || "No reason specified";

        await Promise.all(
            users.map(async (u, i) => {
                try {
                    if (!booleanFlags.has("-d")) await message.guild?.members.unban(u, reason);
                } catch {
                    users.splice(i, 1);
                    if (!booleanFlags.has("-s"))
                        await message.channel.send(`Could not unban **${u.tag}**`);
                }
            })
        );

        if (booleanFlags.has("-s")) return;

        return message.channel.send(
            new Embed()
                .setTitle(`Unbanned ${users.length} user${users.length !== 1 ? "s" : ""}`)
                .addField("Reason", `\`${reason}\``)
                .setDescription(
                    `**Unbanned users:**\n${users.map((u) => `${u.tag}`).join("\n")}`
                )
        );
    },
} as Command;
