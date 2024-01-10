import { RESTGetAPIGuildRolesResult } from "char-roles-bot/deps.ts";

export async function getServerRoles(
  guildId: string,
  botToken: string,
): Promise<RESTGetAPIGuildRolesResult> {
  const res = await fetch(
    `${BASE_URL}/guilds/${guildId}/roles`,
    {
      method: "GET",
      headers: {
        "Authorization": `${TOKEN_TYPE} ${botToken}`,
        "Accept": "application/json",
      },
    },
  );

  return res.json();
}

export async function makeRoleHandler(
  guildId: string,
  userId: string,
  roleId: string,
  botToken: string,
  remove: boolean,
) {
  const manageRoleType = remove ? "DELETE" : "PUT";

  await fetch(
    `${BASE_URL}/guilds/${guildId}/members/${userId}/roles/${roleId}`,
    {
      method: manageRoleType,
      headers: {
        "Authorization": `${TOKEN_TYPE} ${botToken}`,
        "Accept": "application/json",
      },
    },
  );
}

export async function addRole(
  characterName: string,
  userId: string,
  guildId: string,
  botToken: string,
): Promise<string> {
  const serverRoles = await getServerRoles(guildId, botToken);
  const role = serverRoles.find((role) => role.name === characterName);

  if (!role) {
    return "The discord server does not have this role yet. Please ask the moderators.";
  }

  await makeRoleHandler(guildId, userId, role.id, botToken, false);
  return `Added \`${characterName}\` role.`;
}

export async function removeRole(
  characterName: string,
  userId: string,
  guildId: string,
  botToken: string,
): Promise<string> {
  const serverRoles = await getServerRoles(guildId, botToken);
  const role = serverRoles.find((role) => role.name === characterName);

  if (!role) {
    return "The discord server does not have this role.";
  }

  await makeRoleHandler(guildId, userId, role.id, botToken, true);
  return `Removed \`${characterName}\` role.`;
}

// The base url for making fetch requests to the Discord api.
const BASE_URL = "https://discord.com/api/v10";
const TOKEN_TYPE = "Bot";
