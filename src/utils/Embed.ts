import { MessageEmbed, MessageEmbedOptions } from "discord.js";

export default class Embed extends MessageEmbed {
    private static footers = [
        "Each command has options for more specific situations",
        "Some commands have a silent option where it does not give output",
    ];

    constructor(data?: MessageEmbed | MessageEmbedOptions) {
        super(data);
        this.setFooter(Embed.footers[Math.floor(Math.random() * Embed.footers.length)]);
        this.setColor("RANDOM");
        this.setTimestamp();
    }
}
