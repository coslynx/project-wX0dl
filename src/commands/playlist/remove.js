const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { Player } = require('../../music/player.js');

module.exports = {
  name: 'remove',
  description: 'Removes a song from the playlist.',
  options: [
    {
      name: 'index',
      description: 'The index of the song to remove.',
      type: 4, // INTEGER
      required: true,
    },
  ],
  execute(interaction, args) {
    const songIndex = interaction.options.getInteger('index');
    const guildId = interaction.guild.id;
    const playerInstance = Player.getInstance(guildId);

    if (!playerInstance) {
      interaction.reply({ embeds: [createEmbed('Error', 'There is no playlist currently playing!')] });
      return;
    }

    const queue = playerInstance.getQueue();

    if (songIndex < 1 || songIndex > queue.length) {
      interaction.reply({ embeds: [createEmbed('Error', `Invalid song index! Please enter a number between 1 and ${queue.length}.`)] });
      return;
    }

    const removedSong = queue.splice(songIndex - 1, 1)[0]; // Remove song at specified index

    if (removedSong) {
      interaction.reply({ embeds: [createEmbed('Success', `Removed: ${removedSong.title}`)] });
    } else {
      interaction.reply({ embeds: [createEmbed('Error', 'An error occurred while removing the song.')] });
    }
  },
};