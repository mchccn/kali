"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AssertionError_1 = __importDefault(require("./AssertionError"));
function getFlags(args) {
    const set = new Set();
    const res = [];
    args.forEach((arg, index) => {
        if (!/^--?\w+$/.test(arg))
            return;
        if (/^-\w+$/.test(arg)) {
            const flags = arg
                .slice(1)
                .split("")
                .map((flag) => {
                if (set.has(flag))
                    return;
                set.add(flag);
                return {
                    flag,
                    index,
                };
            })
                .filter(($) => !!$);
            //@ts-ignore
            res.push(...flags);
        }
        else if (/^--\w+$/.test(arg)) {
            const flag = arg.slice(2);
            if (set.has(flag))
                return;
            set.add(flag);
            res.push({
                flag,
                index,
            });
        }
        else
            throw new AssertionError_1.default(`Invalid flag format: '${arg}'`);
    });
    return res;
}
exports.default = getFlags;
