const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { Player } = require('../../music/player.js');

module.exports = {
  name: 'skip',
  description: 'Skips the current song.',
  execute(message, args) {
    const guildId = message.guild.id;
    const playerInstance = Player.getInstance(guildId);

    if (!playerInstance) {
      message.channel.send({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
      return;
    }

    const skippedSong = playerInstance.skip();
    if (skippedSong) {
      message.channel.send({ embeds: [createEmbed('Skipped', `Skipped: ${skippedSong.title}`)] });
    } else {
      message.channel.send({ embeds: [createEmbed('Error', 'There is no song to skip!')] });
    }
  },
};