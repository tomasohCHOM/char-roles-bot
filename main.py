from characters import *
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


# Helper function to assign a specific role to the uesr
async def assign_role(char_name: str, interaction: discord.Interaction) -> None:
    role = get(interaction.guild.roles, name=char_name)
    if not role:
        await interaction.response.send_message(
            "The discord server does not have this role yet. Please ask the moderators."
        )
        return
    for char_role in interaction.user.roles:
        if char_role == role:
            await interaction.response.send_message("User already has this role.")
            return
    await interaction.user.add_roles(role)
    await interaction.response.send_message(f"Selected `{char_name}` role.")


# Helper function to remove a specific role to the user
async def remove_role(char_name: str, interaction: discord.Interaction) -> None:
    role = get(interaction.guild.roles, name=char_name)
    if not role:
        await interaction.response.send_message(
            "The discord server does not have this role."
        )
        return

    for char_role in interaction.user.roles:
        if char_role == role:
            await interaction.user.remove_roles(role)
            await interaction.response.send_message(f"Removed `{char_name}` role")
            return
    await interaction.response.send_message("User does not have this role.")


@tree.command(
    name="select-character",
    description="Selects a SSBU Character role.",
    guild=discord.Object(id=discord_server_id),
)
async def select_character_command(
    interaction: discord.Interaction, character: str
) -> None:
    if len(character) < 3:
        await interaction.response.send_message("Character query is too short!")
        return
    query = character.lower()

    for i in range(len(characters)):
        if (
            query in characters[i][OFFICIAL_NAME_IDX].lower()
            or query in characters[i][ROLE_NAME_IDX]
        ):
            await assign_role(
                char_name=characters[i][ROLE_NAME_IDX], interaction=interaction
            )
            return


@tree.command(
    name="remove-character",
    description="Removes a SSBU Character role for when you finally decided to drop that low-tier ass character.",
    guild=discord.Object(id=discord_server_id),
)
async def remove_character_command(
    interaction: discord.Interaction, character: str
) -> None:
    if len(character) < 3:
        await interaction.response.send_message("Character query is too short!")
        return
    query = character.lower()

    for i in range(len(characters)):
        if (
            query in characters[i][OFFICIAL_NAME_IDX].lower()
            or query in characters[i][ROLE_NAME_IDX]
        ):
            await remove_role(
                char_name=characters[i][ROLE_NAME_IDX], interaction=interaction
            )
            return


@client.event
async def on_ready() -> None:
    await tree.sync(guild=discord.Object(id=discord_server_id))
    print(f"{client.user} Bot is now online.")


if __name__ == "__main__":
    client.run(token)
