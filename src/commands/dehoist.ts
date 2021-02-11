import { Command } from "@aeroware/aeroclient/dist/types";
import prefix from "..";
import getFlags from "../utils/getFlags";

const options: {
    [flag: string]: {
        alias: string;
        message: string;
    };
} = {
    "--name": {
        alias: "-n",
        message: "Nickname to give to dehoisted users",
    },
    "--chars": {
        alias: "-c",
        message: "Define characters to dehoist",
    },
    "--help": {
        alias: "-h",
        message: "Displays this nice little help message",
    },
    "--dev": {
        alias: "-d",
        message: "For testing purposes; does not kick",
    },
};

export default {
    name: "dehoist",
    args: false,
    usage: "[options] [arguments]",
    async callback({ message, args, client }) {
        const flags = getFlags(args);
        const flagNames = flags.map((f) => f.flag);
        const booleanFlags = new Set(
            flags.map(({ flag }) => options[`--${flag}`]?.alias || `-${flag}`)
        );

        const chars = ["!"];
        let name = "dehoisted";

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
        Dehoists exclamation mark
\`\`\`
`);
                }
                case "chars":
                case "c":
                    if (!args[index + 1])
                        return message.channel.send(
                            `A string of characters is required when using the \`chars\` flag.`
                        );

                    chars.length = 0;
                    chars.push(...args[index + 1].split(""));
                    break;
                case "name":
                case "n":
                    if (!args[index + 1])
                        return message.channel.send(
                            `A nickname is required when using the \`name\` flag.`
                        );

                    name = args[index + 1];
                    break;
            }
        }

        await message.guild?.members.fetch();

        await Promise.all(
            message.guild?.members.cache.map((m) => {
                if (chars.some((c) => m.displayName.startsWith(c)))
                    try {
                        m.setNickname(name);
                    } catch {}
            })!
        );

        return message.channel.send(`Dehoisted all members successfully`);
    },
} as Command;
