import {
  CategoryChannel,
  GuildChannel,
  RoleResolvable,
  TextChannel,
  VoiceChannel,
} from "discord.js";

export default async function muteOverrides(
  channel: GuildChannel,
  role: RoleResolvable
) {
  if (channel instanceof VoiceChannel) {
    await channel.updateOverwrite(role, {
      CONNECT: false,
    });
  } else if (channel instanceof TextChannel) {
    await channel.updateOverwrite(role, {
      SEND_MESSAGES: false,
    });
  } else if (channel instanceof CategoryChannel) {
    await channel.updateOverwrite(role, {
      CONNECT: false,
      SEND_MESSAGES: false,
    });
  }
}
