import AeroClient from "@aeroware/aeroclient";
import { Intents } from "discord.js";
import { config as dotenv } from "dotenv";

dotenv();

const prefix = ">>";

(async () => {
    try {
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
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();

export default prefix;
