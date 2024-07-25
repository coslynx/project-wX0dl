const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { Player } = require('../../music/player.js');

module.exports = {
  name: 'loop',
  description: 'Toggles looping the current song.',
  execute(message, args) {
    const guildId = message.guild.id;
    const playerInstance = Player.getInstance(guildId);

    if (!playerInstance) {
      message.channel.send({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
      return;
    }

    playerInstance.toggleLoop();
    const looping = playerInstance.isLooping();

    if (looping) {
      message.channel.send({ embeds: [createEmbed('Success', 'Looping enabled!')] });
    } else {
      message.channel.send({ embeds: [createEmbed('Success', 'Looping disabled!')] });
    }
  },
};