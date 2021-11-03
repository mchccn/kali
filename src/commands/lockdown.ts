import AeroClient from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/dist/types";
import { GuildMember, TextChannel } from "discord.js";
import ms from "ms";
import prefix, { client } from "..";
import getFlags from "../utils/getFlags";

const options: {
  [flag: string]: {
    alias: string;
    message: string;
  };
} = {
  "--ban": {
    alias: "-b",
    message: "Lockdown defense is ban instead of kick",
  },
  "--mute": {
    alias: "-m",
    message: "Lockdown defense is mute instead of kick",
  },
  "--full": {
    alias: "-f",
    message: "Locks every channel as well",
  },
  "--time": {
    alias: "-t",
    message: "Time to lockdown the server",
  },
  "--silent": {
    alias: "-s",
    message: "Lockdown the server silently",
  },
  "--help": {
    alias: "-h",
    message: "Displays this nice little help message",
  },
  "--dev": {
    alias: "-d",
    message: "For testing purposes; does not lockdown",
  },
};

interface Lockdown {
  defense: "mute" | "ban" | "kick";
  start: number;
  time: number;
  message: string;
}

const lockdown = new Map<string, Lockdown>();

export default {
  name: "lockdown",
  args: false,
  usage: "[options]",
  async callback({ message, args, client, text, locale }) {
    if (message.channel.type === "dm") return;

    const flags = getFlags(args);
    const flagNames = flags.map((f) => f.flag);
    const booleanFlags = new Set(
      flags.map(({ flag }) => options[`--${flag}`]?.alias || `-${flag}`)
    );

    let ban = false;
    let mute = false;
    let time = 0;

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
        Puts the server in lockdown for one day
\`\`\`
`);
        }
        case "ban":
        case "b":
          ban = true;
          break;
        case "mute":
        case "m":
          mute = true;
          break;
        case "time":
        case "t":
          time = Math.min(Math.max(ms(args[index + 1]), 60000), 86400000);
          break;
      }
    }

    if (
      ["off", "disable", "disabled", "false", "no", "stop"].includes(args[0])
    ) {
      lockdown.delete(message.guild?.id!);

      message.guild?.channels.cache.array().forEach(async (ch) => {
        try {
          if (ch.type === "category") {
            await client.commands.get("unlock")?.callback({
              message,
              args: ["-cs", ch.id],
              client,
              text,
              locale,
            });
          } else {
            await client.commands.get("unlock")?.callback({
              message,
              args: ["-s", ch.id],
              client,
              text,
              locale,
            });
          }
        } catch {}
      });

      if (!booleanFlags.has("-s"))
        return message.channel.send(`Lockdown has been turned off`);
    }

    if (booleanFlags.has("-f") && !booleanFlags.has("-d"))
      message.guild?.channels.cache.array().forEach(async (ch) => {
        try {
          if (ch.type === "category") {
            await client.commands.get("lock")?.callback({
              message,
              args: ["-cs", ch.id],
              client,
              text,
              locale,
            });
          } else {
            await client.commands.get("lock")?.callback({
              message,
              args: ["-s", ch.id],
              client,
              text,
              locale,
            });
          }
        } catch {}
      });

    if (!booleanFlags.has("-d")) {
      lockdown.set(message.guild?.id!, {
        defense: ban ? "ban" : mute ? "mute" : "kick",
        start: Date.now(),
        time: time || 86400000,
        message: message.channel.id + message.id,
      });

      client.on("guildMemberAdd", (member) => lockdownInspect(member, client));
    }

    if (!booleanFlags.has("-s"))
      return message.channel.send(
        `Server is now in lockdown mode${
          time
            ? ` for ${ms(time, {
                long: true,
              })}`
            : ""
        }`
      );

    return;
  },
} as Command;

async function lockdownInspect(member: GuildMember, client: AeroClient) {
  const lock = lockdown.get(member.guild.id);

  if (lock) {
    if (member.partial) await member.fetch();

    const dm = await member.createDM(true);
    await dm.send(`**${member.guild.name}** is currently under lockdown`);

    switch (lock.defense) {
      case "kick":
        return member.kick();
      case "ban":
        return member.ban();
      case "mute":
        const msg = await ((await client.channels.fetch(
          lock.message.slice(0, 18)
        )) as TextChannel).messages.fetch(lock.message.slice(18));

        return client.commands.get("mute")?.callback({
          message: msg,
          args: [member.id, "-frs"],
          client,
          locale: "",
          text: "",
        });
    }
  }

  return;
}

setInterval(async () => {
  for (const [id, lock] of lockdown) {
    if (Date.now() > lock.start + lock.time && lock.time) {
      lockdown.delete(id);

      const msg = await ((await client.channels.fetch(
        lock.message.slice(0, 18)
      )) as TextChannel).messages.fetch(lock.message.slice(18));

      (await client.guilds.fetch(id)).channels.cache.forEach(async (ch) => {
        try {
          if (ch.type === "category") {
            await client.commands.get("unlock")?.callback({
              message: msg,
              args: ["-cs", ch.id],
              client,
              text: "",
              locale: "",
            });
          } else {
            await client.commands.get("unlock")?.callback({
              message: msg,
              args: ["-s", ch.id],
              client,
              text: "",
              locale: "",
            });
          }
        } catch {}
      });
    }
  }
}, 60000);
