const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { Player } = require('../../music/player.js');
const lyricsFinder = require('lyrics-finder');

module.exports = {
  name: 'lyrics',
  description: 'Displays lyrics for the currently playing song.',
  execute(message, args) {
    const guildId = message.guild.id;
    const playerInstance = Player.getInstance(guildId);

    if (!playerInstance) {
      message.channel.send({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
      return;
    }

    const currentSong = playerInstance.getCurrentSong();

    lyricsFinder(currentSong.title, currentSong.artist)
      .then(lyrics => {
        if (lyrics) {
          const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Lyrics for ${currentSong.title}`)
            .setDescription(lyrics);
          message.channel.send({ embeds: [embed] });
        } else {
          message.channel.send({ embeds: [createEmbed('Error', 'No lyrics found for this song.')] });
        }
      })
      .catch(error => {
        message.channel.send({ embeds: [createEmbed('Error', 'An error occurred while fetching lyrics.')] });
        console.error('Error fetching lyrics:', error);
      });
  },
};