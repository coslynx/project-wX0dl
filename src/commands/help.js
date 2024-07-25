const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../utils/embed.js');

module.exports = {
  name: 'help',
  description: 'Lists all available commands.',
  execute(message, args) {
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Discord Music Bot Help')
      .setDescription('Here are the available commands:')
      .addField('Music Commands', '```\n!play <query> - Play a song or playlist\n!skip - Skip the current song\n!stop - Stop the music and clear the queue\n!queue - Display the current music queue\n!pause - Pause the music playback\n!resume - Resume the music playback\n!volume <level> - Adjust the music volume (0-100)\n!loop - Toggle looping the current song\n!shuffle - Shuffle the music queue\n!lyrics - Display lyrics for the current song\n```')
      .addField('Other Commands', '```\n!about - Information about the bot\n!help - Display this help menu\n```')
      .setFooter({ text: 'Developed with love ❤️' });

    message.channel.send({ embeds: [embed] });
  },
};