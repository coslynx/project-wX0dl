const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { Player } = require('../../music/player.js');

module.exports = {
  name: 'clear',
  description: 'Clears the current playlist.',
  execute(interaction, args) {
    const guildId = interaction.guild.id;
    const playerInstance = Player.getInstance(guildId);

    if (!playerInstance) {
      interaction.reply({ embeds: [createEmbed('Error', 'There is no playlist currently playing!')] });
      return;
    }

    playerInstance.clearQueue();
    interaction.reply({ embeds: [createEmbed('Success', 'Playlist cleared!')] });
  },
};