require("dotenv").config();

const { REST } = require("@discordjs/rest");
const { Routes } = require("discordjs/rest");
const { Client, Intents, Collection, Client } = require("discord.js");
const voice = require("@discordjs/voice");
const { Player } = require("discord-player");

const fs = require("node:fs");
const path = require("node:path");

const client = new Client({
    Intents: [Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILDS_MESSAGES,
    Intents.FLAGS.GUILDS_VOICE_STATES]
})

// Load all the commands
const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
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

    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
    for (const guildId of guild_ids) {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), {
            body: commands
        })
            .then(() => console.log(`Added commands to $guildId}`))
            .catch(console.error);
    }

})

client.on("interactionCreate", async interaction => {
    
    if (!interaction.isCommand()) return;
    if (!(await interaction.guild.members.fetch(interaction.user.id)).voice.channel) return interaction.reply("You must be in a VC to use that command"); // This can be changed to run when only VC based commands are run. This is only a temp fix.

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute({ client, interaction });
    }
    catch (err)
    {
        console.error(err);
        await interaction.reply("An error occurred while executing that command.")
    }
})


client.login(process.env.TOKEN);