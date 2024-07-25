const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { Player } = require('../../music/player.js');

module.exports = {
  name: 'load',
  description: 'Loads the specified playlist.',
  options: [
    {
      name: 'name',
      description: 'Name of the playlist to load.',
      type: 3,
      required: true,
    },
  ],
  execute(interaction, args) {
    const playlistName = interaction.options.getString('name');
    const guildId = interaction.guild.id;

    // Retrieve the playlist from the database or local storage
    // (Replace this with your actual database or file storage logic)
    // Example using a simple JSON file:
    const guildSettings = require(`../../config/guilds/${guildId}.json`);
    const playlist = guildSettings.playlists[playlistName];

    if (!playlist) {
      interaction.reply({ embeds: [createEmbed('Error', `Playlist ${playlistName} not found!`)] });
      return;
    }

    interaction.reply({ embeds: [createEmbed('Success', `Playlist ${playlistName} loaded!`)] });
  },
};