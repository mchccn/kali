"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "ready",
    once: true,
    async callback() {
        this.user?.setActivity({
            type: "PLAYING",
            name: "with Linux",
        });
        await Promise.all(this.guilds.cache.map((g) => g.members.fetch()));
    },
};
