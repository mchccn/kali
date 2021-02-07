import AssertionError from "./AssertionError";

export default function getFlags(args: string[]): { flag: string; index: number }[] {
    const set = new Set();
    const res = [];
    args.forEach((arg, index) => {
        if (!/^--?\w+$/.test(arg)) return;

        if (/^-\w+$/.test(arg)) {
            const flags = arg.slice(1).split("");

            res.push(
                ...flags
                    .map((flag) => {
                        if (set.has(flag)) return;

                        set.add(flag);

                        return {
                            flag,
                            index,
                        };
                    })
                    .filter(($) => !!$)
            );
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
