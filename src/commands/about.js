const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../utils/embed.js');

module.exports = {
  name: 'about',
  description: 'Provides information about the bot.',
  execute(message, args) {
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Discord Music Bot')
      .setDescription('This bot is designed to provide a seamless and enjoyable music experience for Discord servers.  It allows you to play music from various sources, manage playlists, and control playback with ease.')
      .addField('Features', '• Music Playback\n• Queue Management\n• Playlist Management\n• User-Friendly Interface\n• Voice Channel Integration\n• Lyrics Retrieval')
      .addField('Commands', '• **!play <query>**: Play a song or playlist.\n• **!skip**: Skip the current song.\n• **!stop**: Stop the music and clear the queue.\n• **!queue**: Display the current music queue.\n• **!pause**: Pause the music playback.\n• **!resume**: Resume the music playback.\n• **!volume <level>**: Adjust the music volume.\n• **!loop**: Toggle looping the current song.\n• **!shuffle**: Shuffle the music queue.\n• **!lyrics**: Display lyrics for the current song.')
      .addField('Support', 'For any suggestions or issues, please contact the bot developer.')
      .setFooter({ text: 'Developed with love ❤️' });

    message.channel.send({ embeds: [embed] });
  },
};