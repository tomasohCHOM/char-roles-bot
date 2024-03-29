import { load } from "char-roles-bot/deps.ts";
import type { AppSchema } from "char-roles-bot/deps.ts";
import {
  ApplicationCommandOptionType,
  createApp,
  InteractionResponseType,
  MessageFlags,
} from "char-roles-bot/deps.ts";
import { addRole, removeRole } from "char-roles-bot/lib/discord/roles.ts";
import { verifyQuery } from "char-roles-bot/lib/characters/verify.ts";

/**
 * Defines the schema of the character roles slash command app.
 */
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

  // The bot token is used more than once.
  const BOT_TOKEN = Deno.env.get("DISCORD_TOKEN")!;

  // Create the discord application
  const handle = await createApp({
    schema: characterRoles,
    applicationID: Deno.env.get("DISCORD_APPLICATION_ID")!,
    publicKey: Deno.env.get("DISCORD_PUBLIC_KEY")!,
    register: { token: BOT_TOKEN },
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

      const queryVerification = verifyQuery(query);

      if (!queryVerification.success) {
        return {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: "User does not have this role.",
            flags: MessageFlags.Ephemeral,
          },
        };
      }

      const response = await addRole(
        queryVerification.data,
        interaction.member?.user.id!,
        interaction.guild_id!,
        BOT_TOKEN,
      );

      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: response,
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

      const queryVerification = verifyQuery(query);

      if (!queryVerification.success) {
        return {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: "User does not have this role.",
            flags: MessageFlags.Ephemeral,
          },
        };
      }

      const response = await removeRole(
        queryVerification.data,
        interaction.member?.user.id!,
        interaction.guild_id!,
        BOT_TOKEN,
      );

      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: response,
          flags: MessageFlags.Ephemeral,
        },
      };
    },
  });

  // Start the server.
  Deno.serve(handle);
}
