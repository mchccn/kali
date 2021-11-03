import { Command } from "@aeroware/aeroclient/dist/types";
import Embed from "../utils/Embed";

export default {
  name: "help",
  async callback({ message, client }) {
    return message.channel.send(
      new Embed()
        .setTitle("Commands")
        .setDescription(
          `
\`\`\`
${client.commands.map((cmd) => cmd.name).join("\n")}
\`\`\``
        )
        .addField(
          "\u200b",
          `Join [AeroWare](https://discord.gg/Vs4rfsfd4q) for updates, news, and support.`
        )
        .setURL("https://discord.gg/Vs4rfsfd4q")
    );
  },
} as Command;
