from characters import characters_set
from dotenv import load_dotenv
from discord.utils import get
import discord
import os

load_dotenv()

intents = discord.Intents.default()
intents.message_content = True

client = discord.Client(intents=intents)
tree = discord.app_commands.CommandTree(client)

token = os.getenv("BOT_TOKEN")
discord_server_id = int(os.getenv("DISCORD_SERVER_ID"))


async def assign_role(char_name: str, interaction: discord.Interaction) -> None:
    role = get(interaction.guild.roles, name=char_name)
    await interaction.user.add_roles(role)


async def remove_role(char_name: str, interaction: discord.Interaction) -> None:
    role = get(interaction.guild.roles, name=char_name)
    await interaction.user.remove_roles(role)


@tree.command(
    name="select-character",
    description="Selects a SSBU Character role",
    guild=discord.Object(id=discord_server_id),
)
async def select_character_command(
    interaction: discord.Interaction, character_query: str
) -> None:
    if len(character_query) < 3:
        await interaction.response.send("Character query is too short!")
        return
    query = character_query.lower()

    for character in characters_set:
        if query in character.lower():
            await interaction.response.send_message(
                f"{interaction.user} selected {character} role"
            )
            await assign_role(char_name=character, interaction=interaction)
            return


@tree.command(
    name="remove-character",
    description="Removes a SSBU Character role for when you finally decided to drop that low-tier ass character",
    guild=discord.Object(id=discord_server_id),
)
async def remove_character_command(
    interaction: discord.Interaction, character: str
) -> None:
    if len(character) < 3:
        await interaction.response.send_message("Character query is too short!")
        return
    character_query = character.lower()

    for character in characters_set:
        if character_query in character.lower():
            await remove_role(char_name=character, interaction=interaction)
            await interaction.response.send_message(
                f"{interaction.user} removed {character} role"
            )
            return


@client.event
async def on_ready() -> None:
    await tree.sync(guild=discord.Object(id=discord_server_id))
    print(f"{client.user} Bot is now online.")


if __name__ == "__main__":
    client.run(token)
