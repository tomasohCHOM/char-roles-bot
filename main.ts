import { load } from "char-roles-bot/deps.ts";
import type { AppSchema } from "char-roles-bot/deps.ts";
import {
  ApplicationCommandOptionType,
  createApp,
  InteractionResponseType,
} from "char-roles-bot/deps.ts";

export const hello = {
  chatInput: {
    name: "sample_command",
    description: "A command that sends hello!",
    options: {
      character: {
        type: ApplicationCommandOptionType.String,
        description: "The character's name",
        required: true,
      },
    },
  },
} as const satisfies AppSchema;

if (import.meta.main) {
  await main();
}

async function main() {
  await load({ export: true });

  // Create the discord application
  const handle = await createApp({
    schema: hello,
    applicationID: Deno.env.get("DISCORD_APPLICATION_ID")!,
    publicKey: Deno.env.get("DISCORD_PUBLIC_KEY")!,
    register: { token: Deno.env.get("DISCORD_TOKEN")! },
    invite: { path: "/invite", scopes: ["applications.commands"] },
  }, (interaction) => {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: `Hello, ${interaction.user?.username}` },
    };
  });

  // Start server
  Deno.serve(handle);
}
