"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Embed_1 = __importDefault(require("../utils/Embed"));
exports.default = {
    name: "help",
    callback({ message, client }) {
        return __awaiter(this, void 0, void 0, function* () {
            return message.channel.send(new Embed_1.default()
                .setTitle("Commands")
                .setDescription(`
\`\`\`
${client.commands.map((cmd) => cmd.name).join("\n")}
\`\`\``)
                .addField("\u200b", `Join [AeroWare](https://discord.gg/Vs4rfsfd4q) for updates, news, and support.`)
                .setURL("https://discord.gg/Vs4rfsfd4q"));
        });
    },
};
