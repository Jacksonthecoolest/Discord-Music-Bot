const {SlashCommandBuilder} = reuire("@discordjs/builders");
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
    }
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
                        .setName("searchterms")
                        .setDescription("search keywords")
                        .setRequired(true);
                    })
            })
            execute: async ({client, interaction}) => {
                {
                    await interaction.reply("You must be in a voice channel to use this command :D.");
                    return;
                }
                //if (interaction.commandName === "play")
            }
        
                const queue = await client.player.createQueue(interation.guild);

                if (!queue.connection) await queue.connect(interaction.member.voice.channel)

                let embed = new MessageEmbed();
                if(interaction.option.getsubcommand() === "song")
                {
                    let url = interaction.option.getstring("url");

                    const result = await client.player.search(url, {
                        requestedBy: interaction.user,
                        searchEngine: QueryType.YOUTUBE_VIDEO,
                    });

                    if (result.tracks.length === 0)
                    {
                        await interaction.reply("No Results found HAHAHA LOL GET REKT");
                        return
                    }

                    const song =result.tracks[0]
                    await queue.addtrack(song);

                    embed.
                    setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
                    .setThumbnail(song.thumbnail)
                    .setfooter({text: `Duration: ${song.duration}`});

                }
                const queue = await client.player.createQueue(interation.guild);

                if (!queue.connection) await queue.connect(interaction.member.voice.channel)

                let embed = new MessageEmbed();
                if(interaction.option.getsubcommand() === "playlist")
                {
                    let url = interaction.option.getstring("url");

                    const result = await client.player.search(url, {
                        requestedBy: interaction.user,
                        searchEngine: QueryType.YOUTUBE_PLAYLIST,
                    });

                    if (result.tracks.length === 0)
                    {
                        await interaction.reply("No Playlist found HAHAHA LOL GET REKT");
                        return
                    }

                    const playlist =result.playlist;
                    await queue.addtracks(song);

                    embed.
                    setDescription(`Added **[${playlist.title}](${song.url})** to the queue.`)
                    .setThumbnail(playlist.thumbnail)
                    .setfooter({text: `Duration: ${playlist.duration}`});

                }

                if(interaction.option.getsubcommand() === "search")
                {
                    let url = interaction.option.getstring("searchterms");

                    const result = await client.player.search(url, {
                        requestedBy: interaction.user,
                        searchEngine: QueryType.YOUTUBE_AUTO,
                    });

                    if (result.tracks.length === 0)
                    {
                        await interaction.reply("No results found HAHAHA LOL GET REKT");
                        return
                    }

                    const song =result.result;
                    await queue.addtracks(song);

                    embed.
                    setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
                    .setThumbnail(song.thumbnail)
                    .setfooter({text: `Duration: ${song.duration}`});

                }
            
                if(!queue.playing) await queue.play();

                await interaction.reply({
                    embeds: [embed]
                })
            
            
            
        