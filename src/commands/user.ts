import { utils } from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/dist/types";
import prefix from "..";
import Embed from "../utils/Embed";
import getFlags from "../utils/getFlags";

const options: {
  [flag: string]: {
    alias: string;
    message: string;
  };
} = {
  "--lookup": {
    alias: "-l",
    message: "Fetch a user by their id",
  },
  "--enhance": {
    alias: "-e",
    message: "Displays extra information",
  },
  "--icon": {
    alias: "-i",
    message: "Only show user avatars",
  },
  "--help": {
    alias: "-h",
    message: "Displays this nice little help message",
  },
  "--dev": {
    alias: "-d",
    message: "For testing purposes; does not display info",
  },
};

const userFlags: {
  [flag: string]: string;
} = {
  DISCORD_EMPLOYEE: "Discord employee",
  PARTNERED_SERVER_OWNER: "Partnered server owner",
  BUGHUNTER_LEVEL_1: "Bughunter L1",
  BUGHUNTER_LEVEL_2: "Bughunter L2",
  HYPESQUAD_EVENTS: "HypeSquad events",
  HOUSE_BRAVERY: "House of Bravery",
  HOUSE_BRILLIANCE: "House of Brilliance",
  HOUSE_BALANCE: "House of Balance",
  EARLY_SUPPORTER: "Early supporter",
  TEAM_USER: "Team user",
  SYSTEM: "System",
  VERIFIED_BOT: "Verified bot",
  EARLY_VERIFIED_BOT_DEVELOPER: "Early verified bot developer",
};

export default {
  name: "user",
  args: false,
  usage: "[arguments] [options]",
  description: "Displays general user info",
  async callback({ message, args, client }) {
    const flags = getFlags(args);
    const flagNames = flags.map((f) => f.flag);
    const booleanFlags = new Set(
      flags.map(({ flag }) => options[`--${flag}`]?.alias || `-${flag}`)
    );

    if (booleanFlags.has("-d")) return;

    let user = message.author;

    if (/\d{18}/.test(args[0])) {
      user = await client.users.fetch(args[0].match(/(\d{18})/)![0])!;
      if (!user) return message.channel.send(`User not found`);
    }

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
        Displays your info
\`\`\`
`);
        }
        case "icon":
        case "i": {
          return message.channel.send(
            new Embed()
              .setTitle(user.username)
              .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
          );
        }
        case "lookup":
        case "l": {
          if (!/\d{18}/.test(args[0]))
            return message.channel.send(`That's not an id`);

          user = await client.users.fetch(args[0]);

          if (!user) return message.channel.send(`User not found`);
        }
      }
    }

    const embed = new Embed()
      .setTitle(user.username)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `**Last message**\n${utils.trim(user.lastMessage?.content || "", 1000)}`
      )
      .addField("Username", user.username, true)
      .addField("Tag", user.tag, true)
      .addField(
        "Flags",
        user.flags
          ?.toArray()
          .map((f) => userFlags[f])
          .join("\n") || "None"
      )
      .addField("ID", user.id, true)
      .addField("Account created", user.createdAt.toDateString(), true);

    if (booleanFlags.has("-e"))
      embed
        .addField("Discriminator", user.discriminator)
        .addField("Locale", user.locale)
        .addField("Is bot", user.bot, true)
        .addField("Is system", user.system, true);

    return message.channel.send(embed);
  },
} as Command;
