import { load } from "char-roles-bot/deps.ts";
import type { AppSchema } from "char-roles-bot/deps.ts";
import {
  ApplicationCommandOptionType,
  createApp,
  InteractionResponseType,
  MessageFlags,
} from "char-roles-bot/deps.ts";
import {
  characters,
  OFFICIAL_NAME_IDX,
  ROLE_NAME_IDX,
} from "char-roles-bot/lib/characters/characters.ts";
import { addRole, removeRole } from "char-roles-bot/lib/discord/roles.ts";

export const characterRoles = {
  chatInput: {
    name: "character-roles",
    description: "Set of commands to add/remove character roles in SSBU server",
    subcommands: {
      add: {
        description: "Selects a Smash Character role.",
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
        description:
          "Removes a Smash Character role for when you finally decided to drop that low-tier ass character.",
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
    add: async (interaction) => {
      const query = interaction.data.parsedOptions.character.toLowerCase();
      if (query.length < 3) {
        return {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: "Character query is too short!",
            flags: MessageFlags.Ephemeral,
          },
        };
      }

      for (let i = 0; i < characters.length; i++) {
        if (
          characters[i][OFFICIAL_NAME_IDX].toLowerCase().includes(query) ||
          characters[i][ROLE_NAME_IDX].toLowerCase().includes(query)
        ) {
          const response = await addRole(
            characters[i][ROLE_NAME_IDX],
            interaction.member?.user.id!,
            interaction.guild_id!,
            Deno.env.get("DISCORD_TOKEN")!,
          );

          return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
              content: response,
              flags: MessageFlags.Ephemeral,
            },
          };
        }
      }

      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "This server role does not exist. Please try again.",
          flags: MessageFlags.Ephemeral,
        },
      };
    },

    remove: async (interaction) => {
      const query = interaction.data.parsedOptions.character.toLowerCase();
      if (query.length < 3) {
        return {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: "Character query is too short!",
            flags: MessageFlags.Ephemeral,
          },
        };
      }

      for (let i = 0; i < characters.length; i++) {
        if (
          characters[i][OFFICIAL_NAME_IDX].toLowerCase().includes(query) ||
          characters[i][ROLE_NAME_IDX].toLowerCase().includes(query)
        ) {
          const response = await removeRole(
            characters[i][ROLE_NAME_IDX],
            interaction.member?.user.id!,
            interaction.guild_id!,
            Deno.env.get("DISCORD_TOKEN")!,
          );

          return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
              content: response,
              flags: MessageFlags.Ephemeral,
            },
          };
        }
      }

      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "User does not have this role",
          flags: MessageFlags.Ephemeral,
        },
      };
    },
  });

  // Start the server.
  Deno.serve(handle);
}
