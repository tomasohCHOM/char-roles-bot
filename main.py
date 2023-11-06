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
    role = get(message.guild.roles, name="Sephiroth")
    await message.mentions[0].add_roles(role)


@client.event
async def on_message(message: discord.Message):
    if message.author == client.user or not message.guild:
        return
    if len(message.content) < 3:
        await message.channel.send("Query is too short!")
        return

    msg = message.content.lower()
    if msg in "sephiroth":
        await message.channel.send("That is the Sephiroth Role")
        await assign_role(char_name="sephiroth", message=message)


@client.event
async def on_ready():
    print(f"{client.user} Bot is now online.")


if __name__ == "__main__":
    client.run(token)
