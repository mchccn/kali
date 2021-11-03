import { Command } from "@aeroware/aeroclient/dist/types";
import utils from "@aeroware/discord-utils";
import { CategoryChannel, Collection, GuildChannel } from "discord.js";
import Embed from "../utils/Embed";

export default {
  name: "list",
  args: true,
  usage: "[section]",
  async callback({ message, args, client }) {
    const itemsPerPage = 10;
    const color = Math.floor(Math.random() * 16777215).toString(16);
    switch (args[0]) {
      case "roles": {
        const array =
          message.guild?.roles.cache
            .array()
            .sort((a, b) =>
              a.name.toLowerCase() < b.name.toLowerCase()
                ? -1
                : a.name.toLowerCase() > b.name.toLowerCase()
                ? 1
                : 0
            )
            .filter((r) => r.name !== "@everyone") || [];

        const fields = array
          .map((_, i) =>
            i % itemsPerPage
              ? undefined!
              : array.slice(
                  i,
                  Math.floor(i / itemsPerPage) * itemsPerPage + itemsPerPage
                )
          )
          .filter(($) => !!$);

        const pages = fields.map((roles, i) =>
          new Embed()
            .setTitle("Roles")
            .setFooter(`page ${i + 1} out of ${fields.length}`)
            .setDescription(roles.map((r) => `<@&${r.id}>`).join("\n"))
            .setColor(color)
        );

        return utils.paginate(message, pages, {
          fastForwardAndRewind: {
            time: 10000,
          },
          goTo: {
            time: 10000,
          },
          time: 120000,
        });
      }
      case "channels": {
        const guild = message.guild!;

        const descPos = (a: GuildChannel, b: GuildChannel) => {
          if (a.type !== b.type) {
            if (a.type === "voice") return 1;
            else return -1;
          } else return a.position - b.position;
        };

        const channels = new Collection();

        channels.set(
          "__none",
          guild.channels.cache
            .filter((channel) => !channel.parent && channel.type !== "category")
            .sort(descPos)
        );

        const categories = guild.channels.cache
          .filter((channel) => channel.type === "category")
          .sort(descPos);

        categories.forEach((category) =>
          channels.set(
            category.id,
            (category as CategoryChannel).children.sort(descPos)
          )
        );

        const list: string[] = [];

        for (let [categoryID, children] of channels) {
          const category = guild.channels.cache.get(categoryID as string);

          if (category) list.push(`**${category.name}**`);

          for (let [, child] of children as any)
            list.push(
              child.type === "category"
                ? `**${child.name}**`
                : child.type === "voice"
                ? `🔊 ${child.name}`
                : `<#${child.id}>`
            );
        }

        const fields = list
          .map((_, i) =>
            i % itemsPerPage
              ? undefined!
              : list.slice(
                  i,
                  Math.floor(i / itemsPerPage) * itemsPerPage + itemsPerPage
                )
          )
          .filter(($) => !!$);

        const pages = fields.map((channels, i) =>
          new Embed()
            .setTitle("Channels")
            .setFooter(`page ${i + 1} out of ${fields.length}`)
            .setDescription(channels.join("\n"))
            .setColor(color)
        );

        return utils.paginate(message, pages, {
          fastForwardAndRewind: {
            time: 10000,
          },
          goTo: {
            time: 10000,
          },
          time: 120000,
        });
      }
      case "members": {
        const roles = new Set();

        const sort =
          message.guild?.members.cache
            .array()
            .sort(
              (a, b) => b.roles.highest.position - a.roles.highest.position
            ) || [];

        const array = sort.flatMap((m, i) =>
          roles.has(m.roles.highest.id)
            ? `<@!${m.id}>`
            : (() => {
                roles.add(m.roles.highest.id);
                const role = message.guild?.roles.cache.get(m.roles.highest.id);
                return [`<@&${role?.id}>`, `<@!${m.id}>`];
              })()
        );

        const fields = array
          .map((_, i) =>
            i % itemsPerPage
              ? undefined!
              : array.slice(
                  i,
                  Math.floor(i / itemsPerPage) * itemsPerPage + itemsPerPage
                )
          )
          .filter(($) => !!$);

        const pages = fields.map((members, i) =>
          new Embed()
            .setTitle("Members")
            .setFooter(`page ${i + 1} out of ${fields.length}`)
            .setDescription(members.join("\n"))
            .setColor(color)
        );

        return utils.paginate(message, pages, {
          fastForwardAndRewind: {
            time: 10000,
          },
          goTo: {
            time: 10000,
          },
          time: 120000,
        });
      }
      default:
        return message.channel.send(
          `The valid sections are \`roles\`, \`channels\` and \`members\`.`
        );
    }
    return;
  },
} as Command;
