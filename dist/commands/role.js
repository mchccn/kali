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
    name: "role",
    args: true,
    usage: "<add/remove> <users> <roles>",
    callback({ message, args, client }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!["add", "remove"].includes(args[0].toLowerCase()))
                return message.channel.send(`Only \`add\` and \`remove\` are accepted`);
            const members = [];
            for (const arg of args.slice(1)) {
                if (/\d{18}/.test(arg)) {
                    try {
                        const member = yield message.guild.members.fetch(arg.match(/(\d{18})/)[0]);
                        if (member && member.id !== ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id))
                            members.push(member);
                        else
                            break;
                    }
                    catch (_b) {
                        break;
                    }
                }
            }
            const roles = [];
            for (const arg of args.slice(members.length + 1)) {
                if (/\d{18}/.test(arg)) {
                    try {
                        const role = yield message.guild.roles.fetch(arg.match(/(\d{18})/)[0]);
                        if (role)
                            roles.push(role);
                        else
                            break;
                    }
                    catch (_c) {
                        break;
                    }
                }
            }
            if (!members.length)
                return message.channel.send(`No users found`);
            if (!roles.length)
                return message.channel.send(`No roles found`);
            yield Promise.all(
            //@ts-ignore
            members.map((m) => Promise.all(roles.map((r) => m.roles[args[0].toLowerCase()](r)))));
            return message.channel.send(`${args[0].toLowerCase() === "add" ? "Added" : "Removed"} the role${roles.length !== 1 ? "s" : ""} ${aeroclient_1.utils.formatList(roles.map((r) => `**${r.name}**`))} ${args[0].toLowerCase() === "add" ? "to" : "from"} the user${members.length !== 1 ? "s" : ""} ${aeroclient_1.utils.formatList(members.map((m) => `**${m.displayName}**`))}`);
        });
    },
};
