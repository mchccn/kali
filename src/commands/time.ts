import { Command } from "@aeroware/aeroclient/dist/types";

export default {
    name: "time",
    async callback({ message }) {
        message.channel.send(new Date().toUTCString());
    },
} as Command;
