const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { searchMusic } = require('../../music/search.js');
const { Player } = require('../../music/player.js');

module.exports = {
  name: 'add',
  description: 'Adds a song to the playlist.',
  options: [
    {
      name: 'query',
      description: 'The song or playlist to add.',
      type: 3, // STRING
      required: true,
    },
  ],
  execute(interaction, args) {
    const searchQuery = interaction.options.getString('query');
    const guildId = interaction.guild.id;
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      interaction.reply({ embeds: [createEmbed('Error', 'You must be in a voice channel!')] });
      return;
    }

    searchMusic(searchQuery).then(song => {
      if (!song) {
        interaction.reply({ embeds: [createEmbed('Error', `No results found for "${searchQuery}"`)] });
        return;
      }

      const playerInstance = Player.getInstance(guildId);

      if (!playerInstance) {
        // Create a new player instance if it doesn't exist
        new Player(guildId, voiceChannel);
        playerInstance = Player.getInstance(guildId);
      }

      playerInstance.addToQueue(song, voiceChannel);
      interaction.reply({ embeds: [createEmbed('Added to Queue', `${song.title}`)] });

    }).catch(error => {
      interaction.reply({ embeds: [createEmbed('Error', `An error occurred while adding the song: ${error}`)] });
      console.error(error);
    });
  },
};