const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { Player } = require('../../music/player.js');

module.exports = {
  name: 'save',
  description: 'Saves the current queue as a playlist.',
  options: [
    {
      name: 'name',
      description: 'Name of the playlist to save.',
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

    const playerInstance = Player.getInstance(guildId);

    if (!playerInstance) {
      interaction.reply({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
      return;
    }

    const queue = playerInstance.getQueue();

    if (queue.length === 0) {
      interaction.reply({ embeds: [createEmbed('Error', 'The queue is empty!')] });
      return;
    }

    // Store the playlist in a database or local storage
    // (Replace this with your actual database or file storage logic)
    // Example using a simple JSON file:
    const guildSettings = require(`../../config/guilds/${guildId}.json`);
    guildSettings.playlists[playlistName] = {
      name: playlistName,
      songs: queue.map(song => ({ title: song.title, url: song.url })),
    };

    require('fs').writeFileSync(`../../config/guilds/${guildId}.json`, JSON.stringify(guildSettings));

    interaction.reply({ embeds: [createEmbed('Success', `Playlist ${playlistName} saved!`)] });
  },
};