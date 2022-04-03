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

// priv guild

const msgs = ["who asked"];

client.on("message", (msg) => {
    if (msg.guild?.id === "892973291000725594") {
        if (Math.random() < 0.1) {
            if (!(msg.channel instanceof TextChannel)) return;

            msg.channel
                .createWebhook("kelly's soul", {
                    avatar: "https://cdn.discordapp.com/avatars/508442553754845184/a_d13dfd8102b55726b779ffed4e3fd49f.gif?size=2048",
                    reason: "",
                })
                .then((h) => {
                    h.send(msgs[Math.floor(Math.random() * msgs.length)]);
                });
        }
    }
});

client.use(({ message }, next) => {
    if (!message.guild || (!message.member!.hasPermission("ADMINISTRATOR") && message.author.id !== "508442553754845184")) return next(true);
});

process.on("unhandledRejection", async (err) => {
    // ((client.channels.cache.get("806540623850373180") ||
    //   (await client.channels.fetch("806540623850373180"))) as TextChannel).send(
    //   //@ts-ignore
    //   (err && (err.stack || err.message)) || "An error occured.",
    //   {
    //     code: true,
    //   }
    // );
});

export { client };
export default prefix;
