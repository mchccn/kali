"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const Embed_1 = __importDefault(require("../utils/Embed"));
const getFlags_1 = __importDefault(require("../utils/getFlags"));
const options = {
    "--name": {
        alias: "-n",
        message: "Bans all users whose name has the specified word in",
    },
    "--regex": {
        alias: "-r",
        message: "Bans all users whose name match the regex",
    },
    "--silent": {
        alias: "-s",
        message: "Bans users silently; does not DM them or displays output",
    },
    "--soft": {
        alias: "-S",
        message: "Effectively kicks users and clears their messages",
    },
    "--hard": {
        alias: "-H",
        message: "Bans users and appends your custom message to the DM",
    },
    "--help": {
        alias: "-h",
        message: "Displays this nice little help message",
    },
    "--dev": {
        alias: "-d",
        message: "For testing purposes; does not ban",
    },
};
exports.default = {
    name: "ban",
    args: true,
    usage: "[options] <arguments>",
    async callback({ message, args, client, locale, text }) {
        const flags = getFlags_1.default(args);
        const flagNames = flags.map((f) => f.flag);
        const booleanFlags = new Set(flags.map(({ flag }) => options[`--${flag}`]?.alias || `-${flag}`));
        const members = [];
        for (const arg of args) {
            if (/\d{18}/.test(arg)) {
                const member = await message.guild.members.fetch(arg.match(/(\d{18})/)[0]);
                if (member && member.id !== client.user?.id)
                    members.push(member);
            }
            else
                break;
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
        Bans users by mention or id with an optional reason
\`\`\`
`);
                }
                case "name":
                case "n": {
                    if (!args[index + 1])
                        return message.channel.send(`A name is required when using the \`name\` flag.`);
                    members.length = 0;
                    members.push(...message.guild?.members.cache
                        .filter((m) => m.displayName.includes(args[index + 1]))
                        .array());
                    break;
                }
                case "regex":
                case "r": {
                    if (!args[index + 1])
                        return message.channel.send(`A regex is required when using the \`regex\` flag.`);
                    if (args[index + 1].length > 12 || args[index + 1].length < 3)
                        return message.channel.send(`Regex must be between 3 and 12 characters long.`);
                    const regex = new RegExp(args[index + 1] || "");
                    members.length = 0;
                    members.push(...message.guild?.members.cache
                        .filter((m) => regex.test(m.displayName))
                        .array());
                    break;
                }
            }
        }
        const reason = args
            .slice(members.length +
            (flagNames.includes("r") || flagNames.includes("regex")
                ? flags[flagNames.lastIndexOf("r") < 0
                    ? flagNames.lastIndexOf("regex")
                    : flagNames.lastIndexOf("r")].index
                : flagNames.includes("n") || flagNames.includes("name")
                    ? flags[flagNames.lastIndexOf("n") < 0
                        ? flagNames.lastIndexOf("name")
                        : flagNames.lastIndexOf("n")].index
                    : 0), flagNames.includes("H") || flagNames.includes("hard")
            ? args.lastIndexOf([...args].reverse().find((a) => a.startsWith("-")))
            : undefined)
            .filter((arg) => !/--?\w+/.test(arg))
            .join(" ") || "No reason specified";
        let banFailed = false;
        await Promise.all(members.map(async (m, i) => {
            let notif;
            try {
                if (!booleanFlags.has("-s"))
                    try {
                        const dm = await m.createDM(true);
                        await (await client.users.fetch(m.id))?.createDM();
                        notif = await dm.send(`You have been ${booleanFlags.has("-S") ? "soft" : ""}banned from **${message.guild?.name}** for \`${reason}\`${booleanFlags.has("-H")
                            ? `\n**${message.author.tag}**'s comment: ${args
                                .slice(flags[flagNames.indexOf("H") < 0
                                ? flagNames.indexOf("hard")
                                : flagNames.indexOf("H")].index + 1)
                                .join(" ")}`
                            : ""}`.slice(0, 2000));
                    }
                    catch {
                        await message.channel.send(`Could not send DM to **${m.user.tag}**`);
                    }
                if (!booleanFlags.has("-d"))
                    await m.ban({ reason });
                if (booleanFlags.has("-S")) {
                    await message.guild?.members.unban(m.user);
                    client.commands.get("clear")?.callback({
                        message,
                        args: ["100", "-u", m.id],
                        client,
                        locale,
                        text,
                    });
                }
            }
            catch (e) {
                console.log(e);
                banFailed = true;
                members.splice(i, 1);
                if (notif)
                    await notif.delete();
                if (!booleanFlags.has("-s"))
                    await message.channel.send(`Could not ban **${m.user.tag}**`);
            }
        }));
        if (!members.length && !banFailed)
            return message.channel.send(`Could not find any users to ban`);
        if (booleanFlags.has("-s"))
            return;
        return message.channel.send(new Embed_1.default()
            .setTitle(`Banned ${members.length} user${members.length !== 1 ? "s" : ""}`)
            .addField("Reason", `\`${reason}\``)
            .setDescription(`**Banned users:**\n${members.map((m) => `${m.user.tag}`).join("\n")}`));
    },
};
