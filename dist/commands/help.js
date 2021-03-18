"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Embed_1 = __importDefault(require("../utils/Embed"));
exports.default = {
    name: "help",
    async callback({ message, client }) {
        return message.channel.send(new Embed_1.default()
            .setTitle("Commands")
            .setDescription(`
\`\`\`
${client.commands.map((cmd) => cmd.name).join("\n")}
\`\`\``)
            .addField("\u200b", `Join [AeroWare](https://discord.gg/Vs4rfsfd4q) for updates, news, and support.`)
            .setURL("https://discord.gg/Vs4rfsfd4q"));
    },
};
