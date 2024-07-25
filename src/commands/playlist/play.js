const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { Player } = require('../../music/player.js');

module.exports = {
  name: 'play',
  description: 'Plays the specified playlist.',
  options: [
    {
      name: 'name',
      description: 'Name of the playlist to play.',
      type: 3,
      required: true,
    },
  ],
  execute(interaction, args) {
    const playlistName = interaction.options.getString('name');
    const guildId = interaction.guild.id;
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      interaction.reply({ embeds: [createEmbed('Error', 'You must be in a voice channel!')] });
      return;
    }

    // Retrieve the playlist from the database or local storage
    // (Replace this with your actual database or file storage logic)
    // Example using a simple JSON file:
    const guildSettings = require(`../../config/guilds/${guildId}.json`);
    const playlist = guildSettings.playlists[playlistName];

    if (!playlist) {
      interaction.reply({ embeds: [createEmbed('Error', `Playlist ${playlistName} not found!`)] });
      return;
    }

    let playerInstance = Player.getInstance(guildId);

    if (!playerInstance) {
      // Create a new player instance if it doesn't exist
      new Player(guildId, voiceChannel);
      playerInstance = Player.getInstance(guildId);
    }

    // Add the playlist's songs to the queue
    playlist.songs.forEach(song => {
      playerInstance.addToQueue(song, voiceChannel);
    });

    interaction.reply({ embeds: [createEmbed('Success', `Playing playlist: ${playlistName}!`)] });

    // Start playback if the queue is empty
    if (playerInstance.getQueue().length === 1) {
      playerInstance.play();
    }
  },
};