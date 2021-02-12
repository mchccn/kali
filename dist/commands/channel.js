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
Object.defineProperty(exports, "__esModule", { value: true });
const aeroclient_1 = require("@aeroware/aeroclient");
exports.default = {
    name: "channel",
    args: true,
    usage: "[setting]",
    callback({ message, args, client }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.channel.type !== "text" && message.channel.type !== "news")
                return;
            switch (args[0]) {
                case "slowmode":
                    if (!args[1])
                        return message.channel.send(`Please provide the time`);
                    try {
                        if (message.channel.type === "news")
                            return message.channel.send(`Channel must be a text channel`);
                        yield message.channel.setRateLimitPerUser(parseInt(args[1]) || 0);
                        return message.channel.send(`Updated slowmode to ${message.channel.rateLimitPerUser} seconds`);
                    }
                    catch (_a) {
                        return message.channel.send(`Could not update slowmode`);
                    }
                case "topic":
                    if (!args[1])
                        return message.channel.send(`Please provide the topic`);
                    try {
                        yield message.channel.setTopic(args.slice(1).join(" "));
                        return message.channel.send(`Set the channel topic to \`${args.slice(1).join(" ")}\``);
                    }
                    catch (_b) {
                        return message.channel.send(`Could not set topic`);
                    }
                case "nsfw":
                    try {
                        yield message.channel.setNSFW(!message.channel.nsfw);
                        return message.channel.send(`Toggled channel NSFW`);
                    }
                    catch (_c) {
                        return message.channel.send(`Could not toggle NSFW`);
                    }
                case "name":
                    if (!args[1])
                        return message.channel.send(`Please provide the name`);
                    try {
                        yield message.channel.setName(args.slice(1).join(" "));
                        return message.channel.send(`Set the channel name to \`${args.slice(1).join(" ")}\``);
                    }
                    catch (_d) {
                        return message.channel.send(`Could not set name`);
                    }
                case "category":
                    if (!args[1])
                        return message.channel.send(`Please provide the category`);
                    if (!/\d{18}/.test(args[1]))
                        return message.channel.send(`Please provide a valid category`);
                    const id = args[1].match(/(\d{18})/)[0];
                    try {
                        yield message.channel.setParent(id);
                        return message.channel.send(`Category updated`);
                    }
                    catch (_e) {
                        return message.channel.send(`Could not set category`);
                    }
                case "sync":
                    try {
                        yield message.channel.lockPermissions();
                        return message.channel.send(`Permissions have been synced`);
                    }
                    catch (_f) {
                        return message.channel.send(`Could not sync permissions`);
                    }
                default:
                    return message.channel.send(`The valid settings are ${aeroclient_1.utils.formatList([
                        "`slowmode`",
                        "`topic`",
                        "`nsfw`",
                        "`name`",
                        "`category`",
                    ])}`);
            }
        });
    },
};
