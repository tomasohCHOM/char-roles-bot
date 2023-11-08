# Character Roles Bot

A Discord bot that will let users select their character roles in a SSBU Discord Server.

## Installation / Getting Started

Make sure you have Python installed on your machine (version 3.11.0 and above). See here to [install Python](https://www.python.org/downloads/).

Clone this repository by running the following:

```bash
$ git clone https://github.com/tomasohCHOM/CanvasFindPeople.git
$ cd CanvasFindPeople
$ python3 main.py
```

And then install all the dependencies through this command (NOTE: It is suggested that you set up a [Python Virtual Environment](https://realpython.com/python-virtual-environments-a-primer/) before running the instruction):

```bash
$ pip install -r requirements.txt
```

Next, create a new Discord application to set up the bot with your server (read the Discord Documentation [here](https://discordpy.readthedocs.io/en/stable/discord.html)). Save the generated token and the discord channel id (where you want the bot to operate) into a new `.env` (template provided in `.env.example`) file and run the program to start using the Character Roles bot!

## Usage

You can use the slash commands `/select-character [query]` and `/remove-character [query]` to select/remove character roles through their names! It facilitates Discord role management by not having to ask moderators to manually assign those roles (NOTE: The character roles in characters.py is are exclusive to the CSUF SSBU Discord. Feel free to change the names of the roles if using it on your own server).
