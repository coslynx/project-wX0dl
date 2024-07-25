const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { Player } = require('../../music/player.js');

module.exports = {
  name: 'create',
  description: 'Creates a new playlist.',
  options: [
    {
      name: 'name',
      description: 'Name of the playlist to create.',
      type: 3, // STRING
      required: true,
    },
  ],
  execute(interaction, args) {
    const playlistName = interaction.options.getString('name');
    const guildId = interaction.guild.id;

    // Store the playlist in a database or local storage
    // (Replace this with your actual database or file storage logic)
    // Example using a simple JSON file:
    const guildSettings = require(`../../config/guilds/${guildId}.json`);
    guildSettings.playlists[playlistName] = {
      name: playlistName,
      songs: [],
    };

    require('fs').writeFileSync(`../../config/guilds/${guildId}.json`, JSON.stringify(guildSettings));

    interaction.reply({ embeds: [createEmbed('Success', `Playlist ${playlistName} created!`)] });
  },
};