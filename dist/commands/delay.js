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
const ms_1 = __importDefault(require("ms"));
exports.default = {
    name: "delay",
    args: true,
    usage: "<time> <command>",
    callback({ message, args, client, locale, text }) {
        return __awaiter(this, void 0, void 0, function* () {
            const time = Math.min(Math.max(ms_1.default(args[0]), 60000), 86400000);
            if (!time)
                return message.channel.send(`Please provide a valid time`);
            if (!args[1])
                return message.channel.send(`Please provide a command to execute`);
            setTimeout(() => {
                var _a;
                (_a = client.commands.get(args[1])) === null || _a === void 0 ? void 0 : _a.callback({
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
        });
    },
};
