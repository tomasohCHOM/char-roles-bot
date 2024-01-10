import { RESTGetAPIGuildRolesResult } from "char-roles-bot/deps.ts";

export interface ManageServerRolesResult {
  /**
   * The message sent to the user after executing add/remove
   */
  response: string;

  /**
   * The indicator of whether the operation failed or not.
   */
  error?: string;
}

export async function getServerRoles(
  guildId: string,
  botToken: string,
): Promise<RESTGetAPIGuildRolesResult> {
  const res = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/roles`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bot ${botToken}`,
        "Accept": "application/json",
      },
    },
  );

  return res.json();
}

export async function addRoleHandler(
  guildId: string,
  userId: string,
  roleId: string,
  botToken: string,
) {
  await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/members/${userId}/roles/${roleId}`,
    {
      method: "PUT",
      headers: {
        "Authorization": `Bot ${botToken}`,
        "Accept": "application/json",
      },
    },
  );
}

export async function makeDeleteRoleHandler() {
}

export async function addRole(
  characterName: string,
  userId: string,
  guildId: string,
  botToken: string,
): Promise<ManageServerRolesResult> {
  const serverRoles = await getServerRoles(guildId, botToken);
  const role = serverRoles.find((role) => role.name === characterName);

  if (!role) {
    return {
      response:
        "The discord server does not have this role yet. Please ask the moderators.",
      error: "Server role does not exist for this character.",
    };
  }

  await addRoleHandler(guildId, userId, role.id, botToken);
  return {
    response: `Added \`${characterName}\` role.`,
  };
}

export async function removeRole(
  characterName: string,
  guildId: string,
  botToken: string,
) {
  const serverRoles = await getServerRoles(guildId, botToken);
  if (!serverRoles.some((role) => role.name === characterName)) {
    console.log(characterName + " is not a role");
  }
  console.log(characterName);
}
