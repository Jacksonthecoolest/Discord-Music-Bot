const { SlashCommandBuilder } = reuire("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { QueryType } = require("discord-player");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song.")
        .addSubcommand(subcommand => {
            subcommand
                .setName("search")
                .setDescription("searches for a song.")
                .addStringOption(option => {
                    option
                        .setName("searchterms")
                        .setDescription("search Keywords")
                        .setRequired(true);
                })
        })

        .addSubcommand(subcommand => {
            subcommand
                .setName("playlist")
                .setDescription("Plays playlist from YT")
                .addStringOption(option => {
                    option
                        .setName("url")
                        .setDescription("playlist url")
                        .setRequired(true);
                })
        })
        .addSubcommand(subcommand => {
            subcommand
                .setName("song")
                .setDescription("Plays song from YT")
                .addStringOption(option => {
                    option
                        .setName("searchTerms")
                        .setDescription("search keywords")
                        .setRequired(true);
                })
        }),
    execute: async ({ client, interaction }) => {

        queue = await client.player.createQueue(interation.guild);

        if (!queue.connection) await queue.connect(interaction.member.voice.channel)
        
        let embedA = new MessageEmbed();
        if (interaction.option.getSubcommand() === "song") {
            let url = interaction.option.getString("url");

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO,
            });

            if (result.tracks.length === 0) {
                await interaction.reply("No Results found HAHAHA LOL GET REKT");
                return
            }

            const song = result.tracks[0]
            await queue.addtrack(song);

            embedA.setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` });

        }
        const queue = await client.player.createQueue(interaction.guild);
        
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embedB = new MessageEmbed();
        if (interaction.option.getSubcommand() === "playlist") {
            let url = interaction.option.getString("url");

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST,
            });

            if (result.tracks.length === 0) {
                await interaction.reply("No Playlist found HAHAHA LOL GET REKT");
                return
            }

            const playlist = result.playlist;
            await queue.addTracks(song);

            embedB.
                setDescription(`Added **[${playlist.title}](${song.url})** to the queue.`)
                .setThumbnail(playlist.thumbnail)
                .setFooter({ text: `Duration: ${playlist.duration}` });

        }

        if (interaction.option.getSubcommand() === "search") {
            let url = interaction.option.getString("searchTerms");

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_AUTO,
            });

            if (result.tracks.length === 0) {
                await interaction.reply("No results found HAHAHA LOL GET REKT");
                return
            }

            const song = result.result;
            await queue.addTracks(song);

            embedB.
                setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` });

        }

        if (!queue.playing) await queue.play();

        await interaction.reply({
            embeds: [embedB]
        })
    }

}