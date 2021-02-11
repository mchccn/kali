import { utils } from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/dist/types";

export default {
    name: "channel",
    args: true,
    usage: "[setting]",
    async callback({ message, args, client }) {
        if (message.channel.type !== "text" && message.channel.type !== "news") return;

        switch (args[0]) {
            case "slowmode":
                if (!args[1]) return message.channel.send(`Please provide the time`);
                try {
                    if (message.channel.type === "news")
                        return message.channel.send(`Channel must be a text channel`);
                    await message.channel.setRateLimitPerUser(parseInt(args[1]) || 0);
                    return message.channel.send(
                        `Updated slowmode to ${message.channel.rateLimitPerUser} seconds`
                    );
                } catch {
                    return message.channel.send(`Could not update slowmode`);
                }
            case "topic":
                if (!args[1]) return message.channel.send(`Please provide the topic`);
                try {
                    await message.channel.setTopic(args.slice(1).join(" "));
                    return message.channel.send(
                        `Set the channel topic to \`${args.slice(1).join(" ")}\``
                    );
                } catch {
                    return message.channel.send(`Could not set topic`);
                }
            case "nsfw":
                try {
                    await message.channel.setNSFW(!message.channel.nsfw);
                    return message.channel.send(`Toggled channel NSFW`);
                } catch {
                    return message.channel.send(`Could not toggle NSFW`);
                }
            case "name":
                if (!args[1]) return message.channel.send(`Please provide the name`);
                try {
                    await message.channel.setName(args.slice(1).join(" "));
                    return message.channel.send(
                        `Set the channel name to \`${args.slice(1).join(" ")}\``
                    );
                } catch {
                    return message.channel.send(`Could not set name`);
                }
            case "category":
                if (!args[1]) return message.channel.send(`Please provide the category`);
                if (!/\d{18}/.test(args[1]))
                    return message.channel.send(`Please provide a valid category`);
                const id = args[1].match(/(\d{18})/)![0];
                try {
                    await message.channel.setParent(id);
                    return message.channel.send(`Category updated`);
                } catch {
                    return message.channel.send(`Could not set category`);
                }
            case "sync":
                try {
                    await message.channel.lockPermissions();
                    return message.channel.send(`Permissions have been synced`);
                } catch {
                    return message.channel.send(`Could not sync permissions`);
                }
            default:
                return message.channel.send(
                    `The valid settings are ${utils.formatList([
                        "`slowmode`",
                        "`topic`",
                        "`nsfw`",
                        "`name`",
                        "`category`",
                    ])}`
                );
        }
    },
} as Command;
