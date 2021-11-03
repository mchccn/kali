import { Command } from "@aeroware/aeroclient/dist/types";
import { aDelayOf } from "@aeroware/discord-utils/dist/time";
import prefix from "..";
import getFlags from "../utils/getFlags";

const options: {
  [flag: string]: {
    alias: string;
    message: string;
  };
} = {
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

export default {
  name: "ping",
  args: false,
  usage: "[options]",
  async callback({ message, args, client }) {
    const flags = getFlags(args);
    const flagNames = flags.map((f) => f.flag);
    const booleanFlags = new Set(
      flags.map(({ flag }) => options[`--${flag}`]?.alias || `-${flag}`)
    );

    if (booleanFlags.has("-d")) return;

    for (const { flag, index } of flags) {
      switch (flag) {
        case "help":
        case "h": {
          return message.channel.send(`
\`\`\`
${prefix}${this.name}

    SYNTAX:
        ${prefix}${this.name} ${this.usage}

    OPTIONS:${Object.keys(options)
      .map(
        (flag) =>
          `\n        ${`${flag}, ${options[flag].alias}`.padEnd(16, " ")}${
            options[flag].message
          }`
      )
      .join("")}
    
    DEFAULT:
        Displays client ping
\`\`\`
`);
        }
      }
    }

    const ping = await message.channel.send(`Ping: ${client.ws.ping}ms`);
    await ping.edit(
      `Ping: ${client.ws.ping}ms | API Latency: ${
        ping.createdTimestamp - message.createdTimestamp
      }ms`
    );

    if (booleanFlags.has("-l")) {
      let stop = false;

      let i = 1;

      client.once("rateLimit", () => {
        stop = true;
        message.channel.send(`${i} attempts were needed to get ratelimited`);
      });

      for (; i < 101; i++) {
        const msg = await message.channel.send(`Test ${i}: ${client.ws.ping}`);
        await msg.edit(`Test ${i}: ${client.ws.ping}ms | ${ping}ms elapsed`);
        await msg.delete();
        if (stop) break;
        await aDelayOf(100);
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
        const msg = await message.channel.send(
          `Test ${i}: ${client.ws.ping}ms`
        );
        if (booleanFlags.has("-D")) {
          const now = Date.now();
          await msg.delete();
          data.push(Date.now() - now);
        } else {
          const ping = Date.now() - msg.createdTimestamp;
          await msg.edit(`Test ${i}: ${client.ws.ping}ms | ${ping}ms elapsed`);
          data.push(ping);
        }
        await aDelayOf(2000);
      }

      const mid = Math.floor(data.length / 2);
      data.sort((a, b) => a - b);

      stats.mean = Math.round(
        data.reduce((acc, cur) => acc + cur, 0) / data.length
      );
      stats.median =
        data.length % 2 !== 0 ? data[mid] : (data[mid - 1] + data[mid]) / 2;
      stats.mode = data.reduce(
        (current, item) => {
          //@ts-ignore
          const val = (current.numMapping[item] =
            //@ts-ignore
            (current.numMapping[item] || 0) + 1);
          if (val > current.greatestFreq) {
            current.greatestFreq = val;
            current.mode = item;
          }
          return current;
        },
        { mode: 0, greatestFreq: -Infinity, numMapping: {} }
      ).mode;
      stats.range = data.reverse()[0] - data.reverse()[1];

      return message.channel.send(
        `**Results:**\n${Object.keys(stats)
          //@ts-ignore
          .map((s) => `${s}: ${Math.round(stats[s])}ms`)
          .join("\n")}`
      );
    }

    return;
  },
} as Command;
