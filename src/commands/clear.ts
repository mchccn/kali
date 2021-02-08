import { Command } from "@aeroware/aeroclient/dist/types";
import prefix from "..";
import getFlags from "../utils/getFlags";

const options: {
    [flag: string]: {
        alias: string;
        message: string;
    };
} = {
    "--user": {
        alias: "-u",
        message: " Clear all of a user's messages",
    },
    "--regex": {
        alias: "-r",
        message: "Clear all messages that match the regex",
    },
    "--word": {
        alias: "-w",
        message: "Clear all messages with a specific word",
    },
    "--nuke": {
        alias: "-n",
        message: "Nuke the channel",
    },
    "--time": {
        alias: "-t",
        message: "Clear all messages sent within the time specified",
    },
    "--help": {
        alias: "-h",
        message: "Displays this nice little help message",
    },
    "--dev": {
        alias: "-d",
        message: "For testing purposes; does not actually clear",
    },
};

export default {
    name: "clear",
    args: false,
    usage: "[options] <arguments>",
    async callback({ message, args, client }) {
        const flags = getFlags(args);
        const flagNames = flags.map((f) => f.flag);
        const booleanFlags = new Set(
            flags.map(({ flag }) => options[`--${flag}`]?.alias || `-${flag}`)
        );

        for (const { flag, index } of flags) {
            switch (flag) {
                case "help":
                case "h":
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
        Bans users by mention or id with an optional reason
\`\`\`
`);
            }
        }

        return;
    },
} as Command;
