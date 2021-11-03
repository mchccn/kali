import { utils } from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/dist/types";
import { GuildMember, Role } from "discord.js";

export default {
  name: "role",
  args: true,
  usage: "<add/remove> <users> <roles>",
  async callback({ message, args, client }) {
    if (!["add", "remove"].includes(args[0].toLowerCase()))
      return message.channel.send(`Only \`add\` and \`remove\` are accepted`);

    const members: GuildMember[] = [];

    for (const arg of args.slice(1)) {
      if (/\d{18}/.test(arg)) {
        try {
          const member = await message.guild!.members.fetch(
            arg.match(/(\d{18})/)![0]
          );
          if (member && member.id !== client.user?.id) members.push(member);
          else break;
        } catch {
          break;
        }
      }
    }

    const roles: Role[] = [];

    for (const arg of args.slice(members.length + 1)) {
      if (/\d{18}/.test(arg)) {
        try {
          const role = await message.guild!.roles.fetch(
            arg.match(/(\d{18})/)![0]
          );
          if (role) roles.push(role);
          else break;
        } catch {
          break;
        }
      }
    }

    if (!members.length) return message.channel.send(`No users found`);
    if (!roles.length) return message.channel.send(`No roles found`);

    await Promise.all(
      //@ts-ignore
      members.map((m) =>
        Promise.all(roles.map((r) => m.roles[args[0].toLowerCase()](r)))
      )
    );

    return message.channel.send(
      `${args[0].toLowerCase() === "add" ? "Added" : "Removed"} the role${
        roles.length !== 1 ? "s" : ""
      } ${utils.formatList(roles.map((r) => `**${r.name}**`))} ${
        args[0].toLowerCase() === "add" ? "to" : "from"
      } the user${members.length !== 1 ? "s" : ""} ${utils.formatList(
        members.map((m) => `**${m.displayName}**`)
      )}`
    );
  },
} as Command;
