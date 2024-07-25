const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { Player } = require('../../music/player.js');

module.exports = {
  name: 'pause',
  description: 'Pauses the music playback.',
  execute(message, args) {
    const guildId = message.guild.id;
    const playerInstance = Player.getInstance(guildId);

    if (!playerInstance) {
      message.channel.send({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
      return;
    }

    if (playerInstance.isPaused()) {
      message.channel.send({ embeds: [createEmbed('Error', 'The music is already paused!')] });
      return;
    }

    playerInstance.pause();
    message.channel.send({ embeds: [createEmbed('Success', 'Music paused!')] });
  },
};