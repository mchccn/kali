import { MessageEmbed, MessageEmbedOptions } from "discord.js";

export default class Embed extends MessageEmbed {
    private static footers = [
        "Each command has options for more specific situations",
        "Some commands have a silent option where it does not give output",
        "Lock or unlock an entire category with the category flag",
        "Use the time command to see what time it is",
        "The help flag will display a helpful message for a command",
    ];

    constructor(data?: MessageEmbed | MessageEmbedOptions) {
        super(data);
        this.setFooter(Embed.footers[Math.floor(Math.random() * Embed.footers.length)]);
        this.setColor("RANDOM");
        this.setTimestamp();
    }
}
