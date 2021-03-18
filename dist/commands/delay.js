"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ms_1 = __importDefault(require("ms"));
exports.default = {
    name: "delay",
    args: true,
    usage: "<time> <command>",
    async callback({ message, args, client, locale, text }) {
        const time = Math.min(Math.max(ms_1.default(args[0]), 60000), 86400000);
        if (!time)
            return message.channel.send(`Please provide a valid time`);
        if (!args[1])
            return message.channel.send(`Please provide a command to execute`);
        setTimeout(() => {
            client.commands.get(args[1])?.callback({
                message,
                args: args.slice(2),
                client,
                locale,
                text,
            });
        }, time);
        return message.channel.send(`Delayed the execution of \`${args.slice(1).join(" ")}\` for ${ms_1.default(time, {
            long: true,
        })}`);
    },
};
