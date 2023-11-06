import discord
import os
from dotenv import load_dotenv

load_dotenv()

intents = discord.Intents.default()
intents.message_content = True

client = discord.Client(intents=intents)

token = os.getenv("BOT_TOKEN")


@client.event
async def on_message(message: discord.Message):
    if message.author == client.user or not message.guild:
        return
    await message.channel.send("Hello World!")


@client.event
async def on_ready():
    print(f"{client.user} Bot is now online.")


if __name__ == "__main__":
    client.run(token)
