import { load } from "char-roles-bot/deps.ts";
import type { AppSchema } from "char-roles-bot/deps.ts";
import {
  ApplicationCommandOptionType,
  createApp,
  InteractionResponseType,
} from "char-roles-bot/deps.ts";
import {
  characters,
  OFFICIAL_NAME_IDX,
  ROLE_NAME_IDX,
} from "char-roles-bot/lib/characters/characters.ts";

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

async function getServerRoles(guild_id: string, bot_token: string) {
  const res = await fetch(
    `https://discord.com/api/v10/guilds/${guild_id}/roles`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bot ${bot_token}`,
        "Accept": "application/json",
      },
    },
  );

  return res.json();
}

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
      const query = interaction.data.parsedOptions.character.toLowerCase();
      if (query.length < 3) {
        throw new Error("Character query is too short!");
      }

      for (let i = 0; i < characters.length; i++) {
        if (
          characters[i][OFFICIAL_NAME_IDX].toLowerCase().includes(query) ||
          characters[i][ROLE_NAME_IDX].toLowerCase().includes(query)
        ) {
          // do something
        }
      }

      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `Added \`${interaction.data.parsedOptions.character}\` role`,
        },
      };
    },
    remove: async (interaction) => {
      const query = interaction.data.parsedOptions.character.toLowerCase();
      if (query.length < 3) {
        throw new Error("Character query is too short!");
      }

      for (let i = 0; i < characters.length; i++) {
        if (
          characters[i][OFFICIAL_NAME_IDX].toLowerCase().includes(query) ||
          characters[i][ROLE_NAME_IDX].toLowerCase().includes(query)
        ) {
          // do something
        }
      }

      const data = await getServerRoles(
        interaction.guild_id!,
        Deno.env.get("DISCORD_TOKEN")!,
      );
      console.log(data);

      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content:
            `Removed \`${interaction.data.parsedOptions.character}\` role`,
        },
      };
    },
  });

  // Start server
  Deno.serve(handle);
}
