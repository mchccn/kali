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
const discord_js_1 = require("discord.js");
function muteOverrides(channel, role) {
    return __awaiter(this, void 0, void 0, function* () {
        if (channel instanceof discord_js_1.VoiceChannel) {
            yield channel.updateOverwrite(role, {
                CONNECT: false,
            });
        }
        else if (channel instanceof discord_js_1.TextChannel) {
            yield channel.updateOverwrite(role, {
                SEND_MESSAGES: false,
            });
        }
        else if (channel instanceof discord_js_1.CategoryChannel) {
            yield channel.updateOverwrite(role, {
                CONNECT: false,
                SEND_MESSAGES: false,
            });
        }
    });
}
exports.default = muteOverrides;
