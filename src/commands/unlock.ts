import { Command } from "@aeroware/aeroclient/dist/types";
import prefix from "..";
import getFlags from "../utils/getFlags";

const options: {
    [flag: string]: {
        alias: string;
        message: string;
    };
} = {
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

export default {
    name: "unlock",
    args: false,
    usage: "<arguments> [options]",
    async callback({ message, args, client, locale, text }) {
        if (message.channel.type === "dm") return;

        const flags = getFlags(args);
        const flagNames = flags.map((f) => f.flag);
        const booleanFlags = new Set(
            flags.map(({ flag }) => options[`--${flag}`]?.alias || `-${flag}`)
        );

        const channel =
            message.mentions.channels.first() ||
            message.guild?.channels.cache.get(args[0]) ||
            message.channel;

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
        Unlocks the channel
\`\`\`
`);
                }
                case "category":
                case "c":
                    const cat = message.guild?.channels.cache.get(args[index + 1]);

                    if (!cat) return message.channel.send(`Could not find the category`);

                    if (cat.type !== "category")
                        return message.channel.send(
                            `Channel must be of type category when using the \`category\` flag.`
                        );

                    const channels = message.guild?.channels.cache.filter(
                        (ch) => ch.parentID === cat.id
                    );

                    if (!channels || !channels.size)
                        return message.channel.send(`The category does not have any channels`);

                    await Promise.all(
                        channels.map((ch) =>
                            client.commands.get("unlock")?.callback({
                                message,
                                args: [ch.id, "-s"],
                                client,
                                locale,
                                text,
                            })
                        )
                    );

                    if (!booleanFlags.has("-s"))
                        return message.channel.send(`Unlocked category ${cat.name}`);
            }
        }

        if (channel.type === "category")
            return message.channel.send(
                `Categories can only be unlocked when using the \`category\` flag.`
            );

        if (!booleanFlags.has("-d"))
            await channel.createOverwrite(message.guild?.roles.cache.get(message.guild.id)!, {
                SEND_MESSAGES: true,
            });

        if (booleanFlags.has("-s")) return;

        return message.channel.send(`Unlocked channel <#${channel.id}>`);
    },
} as Command;
