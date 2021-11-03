import AeroClient from "@aeroware/aeroclient";
import { Intents, TextChannel } from "discord.js";
import { config as dotenv } from "dotenv";

dotenv();

const prefix = ">>";

const client = new AeroClient(
  {
    token: process.env.TOKEN,
    prefix,
    commandsPath: "commands",
    eventsPath: "events",
    logging: true,
    responses: {
      usage: `${prefix}$COMMAND $USAGE`,
    },
    staff: ["508442553754845184", "564930157371195437"],
  },
  {
    ws: {
      intents: [Intents.NON_PRIVILEGED, "GUILD_MEMBERS"],
    },
  }
);

client.use(({ message }, next) => {
  if (!message.guild || !message.member!.hasPermission("ADMINISTRATOR"))
    return next(true);
});

process.on("unhandledRejection", async (err) => {
  ((client.channels.cache.get("806540623850373180") ||
    (await client.channels.fetch("806540623850373180"))) as TextChannel).send(
    //@ts-ignore
    (err && (err.stack || err.message)) || "An error occured.",
    {
      code: true,
    }
  );
});

export { client };
export default prefix;
