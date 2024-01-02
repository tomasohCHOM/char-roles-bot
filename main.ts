import { load } from "char-roles-bot/deps.ts";
import type { AppSchema } from "char-roles-bot/deps.ts";
import {
  ApplicationCommandOptionType,
  createApp,
  InteractionResponseType,
} from "char-roles-bot/deps.ts";

export const characterRoles = {
  chatInput: {
    name: "character-roles",
    description: "Set of commands to add/remove character roles in SSBU server",
    subcommands: {
      add: {
        description: "Add a character role",
        options: {
          character: {
            type: ApplicationCommandOptionType.String,
            description:
              "The character's name (query must be 3+ characters long)",
            required: true,
          },
        },
      },
      remove: {
        description: "Remove a character role",
        options: {
          character: {
            type: ApplicationCommandOptionType.String,
            description:
              "The character's name (query must be 3+ characters long)",
            required: true,
          },
        },
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
    schema: characterRoles,
    applicationID: Deno.env.get("DISCORD_APPLICATION_ID")!,
    publicKey: Deno.env.get("DISCORD_PUBLIC_KEY")!,
    register: { token: Deno.env.get("DISCORD_TOKEN")! },
    invite: { path: "/invite", scopes: ["applications.commands"] },
  }, {
    add: (interaction) => {
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `Hello, added ${interaction.data.parsedOptions.character}`,
        },
      };
    },
    remove: (interaction) => {
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `Hello, removed ${interaction.data.parsedOptions.character}`,
        },
      };
    },
  });

  // Start server
  Deno.serve(handle);
}
