from characters import characters_set
from dotenv import load_dotenv
from discord.utils import get
import discord
import os

load_dotenv()

intents = discord.Intents.default()
intents.message_content = True

client = discord.Client(intents=intents)

token = os.getenv("BOT_TOKEN")


async def assign_role(char_name, message: discord.Message):
    role = get(message.guild.roles, name=char_name)
    await message.author.add_roles(role)


@client.event
async def on_message(message: discord.Message):
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
async def on_ready():
    print(f"{client.user} Bot is now online.")


if __name__ == "__main__":
    client.run(token)
