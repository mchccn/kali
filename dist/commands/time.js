"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "time",
    async callback({ message }) {
        message.channel.send(new Date().toUTCString());
    },
};
