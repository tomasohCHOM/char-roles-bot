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


async def assign_role(char_name: str, message: discord.Message) -> None:
    role = get(message.guild.roles, name=char_name)
    await message.author.add_roles(role)


@tree.command(
    name="commandname",
    description="My first application Command",
    guild=discord.Object(id=discord_server_id),
)  # Add the guild ids in which the slash command will appear. If it should be in all, remove the argument, but note that it will take some time (up to an hour) to register the command if it's for all guilds.
async def first_command(interaction: discord.Interaction):
    await interaction.response.send_message("Hello!")


@client.event
async def on_message(message: discord.Message) -> None:
    if message.author == client.user or not message.guild:
        return
    if len(message.content) < 3:
        await message.channel.send("Query is too short!")
        return

    query = message.content.lower()

    for character in characters_set:
        if query in character.lower():
            await message.channel.send(f"That is the {character} Role")
            await assign_role(char_name=character, message=message)
            return

    await message.channel.send("Character has not been found.")


@client.event
async def on_ready() -> None:
    await tree.sync(guild=discord.Object(id=discord_server_id))
    print(f"{client.user} Bot is now online.")


if __name__ == "__main__":
    client.run(token)
