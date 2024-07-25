const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { searchMusic } = require('../../music/search.js');
const { Player } = require('../../music/player.js');

module.exports = {
  name: 'add',
  description: 'Adds a song to the queue.',
  execute(message, args) {
    const searchQuery = args.join(' ');
    if (!searchQuery) {
      message.channel.send({ embeds: [createEmbed('Error', 'Please provide a search query!')] });
      return;
    }

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.channel.send({ embeds: [createEmbed('Error', 'You must be in a voice channel!')] });
      return;
    }

    searchMusic(searchQuery).then(song => {
      if (!song) {
        message.channel.send({ embeds: [createEmbed('Error', `No results found for "${searchQuery}"`)] });
        return;
      }

      const guildId = message.guild.id;
      const playerInstance = Player.getInstance(guildId);

      if (!playerInstance) {
        // Create a new player instance if it doesn't exist
        new Player(guildId, voiceChannel);
        playerInstance = Player.getInstance(guildId);
      }

      playerInstance.addToQueue(song, voiceChannel);
      message.channel.send({ embeds: [createEmbed('Added to Queue', `${song.title}`)] });

    }).catch(error => {
      message.channel.send({ embeds: [createEmbed('Error', `An error occurred while adding the song: ${error}`)] });
      console.error(error);
    });
  },
};