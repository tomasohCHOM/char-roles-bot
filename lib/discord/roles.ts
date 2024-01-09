import { RESTGetAPIGuildRolesResult } from "char-roles-bot/deps.ts";

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

export async function makeAddRoleHandler(
  guildId: string,
  botToken: string,
  userId: string,
  roleId: string,
) {
  const res = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/roles/${userId}/roles/${roleId}`,
    {
      method: "PUT",
      headers: {
        "Authorization": `Bot ${botToken}`,
        "Accept": "application/json",
      },
    },
  );

  return res.json();
}

export async function makeDeleteRoleHandler() {
}

export async function addRole(
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
