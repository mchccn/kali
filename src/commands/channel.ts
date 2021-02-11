import { Command } from "@aeroware/aeroclient/dist/types";

export default {
    name: "channel",
    args: true,
    usage: "[setting]",
    async callback({ message, args, client }) {
        if (message.channel.type !== "text" && message.channel.type !== "news") return;

        if (!args[1]) return message.channel.send(`Please provide the value`);

        switch (args[0]) {
            case "slowmode":
                if (message.channel.type === "news")
                    return message.channel.send(`Channel must be a text channel`);
                await message.channel.setRateLimitPerUser(parseInt(args[1]) || 0);
                return message.channel.send(
                    `Updated slowmode to ${message.channel.rateLimitPerUser} seconds`
                );
            case "topic":
                await message.channel.setTopic(args.slice(1).join(" "));
                return message.channel.send(
                    `Set the channel topic to \`${args.slice(1).join(" ")}\``
                );
            case "nsfw":
                await message.channel.setNSFW(!message.channel.nsfw);
                return message.channel.send(`Toggled channel NSFW`);
            case "name":
                await message.channel.setName(args.slice(1).join(" "));
                return message.channel.send(
                    `Set the channel name to \`${args.slice(1).join(" ")}\``
                );
            case "category":
                const id = args[1].match(/(\d{18})/)![0];
                try {
                    await message.channel.setParent(id);
                    return message.channel.send(`Category updated`);
                } catch {
                    return message.channel.send(`Could not set category`);
                }
            default:
                return message.channel.send(`work in progress`);
        }

        return;
    },
} as Command;
