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
const time_1 = require("@aeroware/discord-utils/dist/time");
const __1 = __importDefault(require(".."));
const getFlags_1 = __importDefault(require("../utils/getFlags"));
const options = {
    "--limit": {
        alias: "-l",
        message: "Test ratelimit threshold",
    },
    "--delete": {
        alias: "-D",
        message: "Test deletion ping",
    },
    "--stat": {
        alias: "-s",
        message: "Display statistical details",
    },
    "--help": {
        alias: "-h",
        message: "Displays this nice little help message",
    },
    "--dev": {
        alias: "-d",
        message: "For testing purposes; does not do anything",
    },
};
exports.default = {
    name: "ping",
    args: false,
    usage: "[options]",
    callback({ message, args, client }) {
        return __awaiter(this, void 0, void 0, function* () {
            const flags = getFlags_1.default(args);
            const flagNames = flags.map((f) => f.flag);
            const booleanFlags = new Set(flags.map(({ flag }) => { var _a; return ((_a = options[`--${flag}`]) === null || _a === void 0 ? void 0 : _a.alias) || `-${flag}`; }));
            if (booleanFlags.has("-d"))
                return;
            for (const { flag, index } of flags) {
                switch (flag) {
                    case "help":
                    case "h": {
                        return message.channel.send(`
\`\`\`
${__1.default}${this.name}

    SYNTAX:
        ${__1.default}${this.name} ${this.usage}

    OPTIONS:${Object.keys(options)
                            .map((flag) => `\n        ${`${flag}, ${options[flag].alias}`.padEnd(16, " ")}${options[flag].message}`)
                            .join("")}
    
    DEFAULT:
        Displays client ping
\`\`\`
`);
                    }
                }
            }
            const ping = yield message.channel.send(`Ping: ${client.ws.ping}ms`);
            yield ping.edit(`Ping: ${client.ws.ping}ms | API Latency: ${ping.createdTimestamp - message.createdTimestamp}ms`);
            if (booleanFlags.has("-l")) {
                let stop = false;
                let i = 1;
                client.once("rateLimit", () => {
                    stop = true;
                    message.channel.send(`${i} attempts were needed to get ratelimited`);
                });
                for (; i < 101; i++) {
                    const msg = yield message.channel.send(`Test ${i}: ${client.ws.ping}`);
                    yield msg.edit(`Test ${i}: ${client.ws.ping}ms | ${ping}ms elapsed`);
                    yield msg.delete();
                    if (stop)
                        break;
                    yield time_1.aDelayOf(100);
                }
                return;
            }
            if (booleanFlags.has("-s") || booleanFlags.has("-D")) {
                const data = [];
                const stats = {
                    mean: 0,
                    median: 0,
                    mode: 0,
                    range: 0,
                };
                for (let i = 1; i < 11; i++) {
                    const msg = yield message.channel.send(`Test ${i}: ${client.ws.ping}ms`);
                    if (booleanFlags.has("-D")) {
                        const now = Date.now();
                        yield msg.delete();
                        data.push(Date.now() - now);
                    }
                    else {
                        const ping = Date.now() - msg.createdTimestamp;
                        yield msg.edit(`Test ${i}: ${client.ws.ping}ms | ${ping}ms elapsed`);
                        data.push(ping);
                    }
                    yield time_1.aDelayOf(2000);
                }
                const mid = Math.floor(data.length / 2);
                data.sort((a, b) => a - b);
                stats.mean = Math.round(data.reduce((acc, cur) => acc + cur, 0) / data.length);
                stats.median = data.length % 2 !== 0 ? data[mid] : (data[mid - 1] + data[mid]) / 2;
                stats.mode = data.reduce((current, item) => {
                    //@ts-ignore
                    const val = (current.numMapping[item] =
                        //@ts-ignore
                        (current.numMapping[item] || 0) + 1);
                    if (val > current.greatestFreq) {
                        current.greatestFreq = val;
                        current.mode = item;
                    }
                    return current;
                }, { mode: 0, greatestFreq: -Infinity, numMapping: {} }).mode;
                stats.range = data.reverse()[0] - data.reverse()[1];
                return message.channel.send(`**Results:**\n${Object.keys(stats)
                    //@ts-ignore
                    .map((s) => `${s}: ${Math.round(stats[s])}ms`)
                    .join("\n")}`);
            }
            return;
        });
    },
};
