import AssertionError from "./AssertionError";

export default function getFlags(args: string[]): { flag: string; index: number }[] {
    const set = new Set();
    const res: { flag: string; index: number }[] = [];
    args.forEach((arg, index) => {
        if (!/^--?\w+$/.test(arg)) return;

        if (/^-\w+$/.test(arg)) {
            const flags = arg
                .slice(1)
                .split("")
                .map((flag) => {
                    if (set.has(flag)) return;

                    set.add(flag);

                    return {
                        flag,
                        index,
                    };
                })
                .filter(($) => !!$);

            //@ts-ignore
            res.push(...flags);
        } else if (/^--\w+$/.test(arg)) {
            const flag = arg.slice(2);

            if (set.has(flag)) return;

            set.add(flag);

            res.push({
                flag,
                index,
            });
        } else throw new AssertionError(`Invalid flag format: '${arg}'`);
    });
    return res;
}
