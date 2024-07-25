const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { Player } = require('../../music/player.js');

module.exports = {
  name: 'nowplaying',
  description: 'Shows the currently playing song.',
  execute(message, args) {
    const guildId = message.guild.id;
    const playerInstance = Player.getInstance(guildId);

    if (!playerInstance) {
      message.channel.send({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
      return;
    }

    const currentSong = playerInstance.getCurrentSong();
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Now Playing')
      .setDescription(`${currentSong.title} \n [${currentSong.url}](${currentSong.url})`);

    message.channel.send({ embeds: [embed] });
  },
};