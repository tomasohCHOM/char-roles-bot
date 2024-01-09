export async function getServerRoles(guild_id: string, bot_token: string) {
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
