require("dotenv").config();

const { REST } = require("@discordjs/rest");
const { Routes } = require("discordjs/rest");
const { Client, Intents, Collection, Client } = require("discord.js");
const { Player } = require("discord-player");

const fs = require("node:fs");
const path = require("node:path");

const Client = new Client({
    Intents: [Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILDS_MESSAGES, 
        Intents.FLAGS.GUILDS_VOICE_STATES]
})

// Load all the commands
const commands = [];
client.comands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const fule of commandFiles)
{
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.comands.set(command.data.name, command);
    command.push(command);
}

client.player = new player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

client.on("ready", () => {
    const guild_ids = client.guild.cache.map(guild => guild.id);
   
   const rest = new REST({versionL "9"}).setToken(process.env.TOKEN);
    for (const guildId of guild_ids)
    {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), {
            body: commands
        })
        .then(() => console.log(`Added commands to $guildId}`))
        .catch(console.error);
    }

})

client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try{
        await command.execute({client, interaction});
    }
    catch(err);
    {
        console.error(err);
        await interaction.reply("An error occurred whil executing that command.")
    }
})


client.login(process.env.TOKEN);