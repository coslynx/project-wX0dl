const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { Player } = require('../../music/player.js');

module.exports = {
  name: 'volume',
  description: 'Adjusts the music volume.',
  execute(message, args) {
    const guildId = message.guild.id;
    const playerInstance = Player.getInstance(guildId);

    if (!playerInstance) {
      message.channel.send({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
      return;
    }

    const volumeLevel = parseInt(args[0]);

    if (isNaN(volumeLevel)) {
      message.channel.send({ embeds: [createEmbed('Error', 'Please provide a valid volume level (0-100)!')] });
      return;
    }

    if (volumeLevel < 0 || volumeLevel > 100) {
      message.channel.send({ embeds: [createEmbed('Error', 'Volume level must be between 0 and 100!')] });
      return;
    }

    playerInstance.setVolume(volumeLevel / 100);
    message.channel.send({ embeds: [createEmbed('Success', `Volume set to ${volumeLevel}%!`)] });
  },
};