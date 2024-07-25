const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { Player } = require('../../music/player.js');

module.exports = {
  name: 'queue',
  description: 'Displays the current music queue.',
  execute(message, args) {
    const guildId = message.guild.id;
    const playerInstance = Player.getInstance(guildId);

    if (!playerInstance) {
      message.channel.send({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
      return;
    }

    const queue = playerInstance.getQueue();
    if (queue.length === 0) {
      message.channel.send({ embeds: [createEmbed('Error', 'The queue is empty!')] });
      return;
    }

    const queueEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Music Queue')
      .setDescription(queue.map((song, index) => `${index + 1}. ${song.title} - [${song.url}](${song.url})`).join('\n'));

    message.channel.send({ embeds: [queueEmbed] });
  },
};