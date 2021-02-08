import AeroClient from "@aeroware/aeroclient";
import { EventHandler } from "@aeroware/aeroclient/dist/types";

export default {
    name: "ready",
    once: true,
    async callback(this: AeroClient) {
        this.user?.setActivity({
            type: "PLAYING",
            name: "with Linux",
        });
        await Promise.all(this.guilds.cache.map((g) => g.members.fetch()));
    },
} as EventHandler;
