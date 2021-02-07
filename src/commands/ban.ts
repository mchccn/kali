import { Command } from "@aeroware/aeroclient/dist/types";
import { GuildMember } from "discord.js";
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
        message: "Bans all users with a specific nickname",
    },
    "--regex": {
        alias: "-r",
        message: "Bans all users whose nickname match the regex",
    },
    "--silent": {
        alias: "-s",
        message: "Bans users silently; does not DM them or displays result",
    },
    "--soft": {
        alias: "-S",
        message: "Effectively Kicks users and clears their messages",
    },
    "--hard": {
        alias: "-H",
        message: "Bans users and appends your custom message to the DM",
    },
    "--help": {
        alias: "-h",
        message: "Displays this nice little help message",
    },
};

export default {
    name: "ban",
    args: true,
    usage: "[options] <arguments>",
    async callback(this: Command, { message, args, client }) {
        const flags = getFlags(args);

        for (const { flag, index } of flags) {
            switch (flag) {
                case "help":
                case "h":
                    return message.channel.send(`
${prefix}${this.name}

    SYNTAX:
        ${prefix}${this.name} ${this.usage}
    OPTIONS:${Object.keys(options).map(
        (flag) =>
            `\n        ${`${flag}, ${options[flag].alias}`.padEnd(16, " ")}${
                options[flag].alias
            }`
    )}
    DEFAULT:
        Bans users by mention or id. '>>ban @alice @bob 123123123123123123' will ban all three users.
`);
            }
        }

        const members: GuildMember[] = [];

        for (const arg of args) {
            if (/^<@!?\d{18}>$/.test(arg)) {
                const member = message.guild.members.cache.get(arg.match(/(\d{18})/)[0]);
                if (member) members.push(member);
            } else if (/^\d{18}$/.test(arg)) {
                const member = message.guild.members.cache.get(arg);
                if (member) members.push(member);
            }
            break;
        }

        const reason = args.slice(members.length).join(" ");

        await Promise.all(members.map((m) => m.ban({ reason })));
    },
} as Command;
