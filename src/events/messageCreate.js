const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { Player } = require('../../music/player.js');
const { searchMusic } = require('../../music/search.js');

module.exports = {
  name: 'messageCreate',
  once: false,
  execute(message) {
    // Ignore messages from the bot itself
    if (message.author.bot) return;

    // Check if the message starts with the prefix
    if (!message.content.startsWith('!')) return;

    // Extract the command and arguments
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Handle music commands
    switch (command) {
      case 'play': {
        // Get the search query
        const query = args.join(' ');

        // Search for music
        searchMusic(query)
          .then(song => {
            if (!song) {
              message.channel.send({ embeds: [createEmbed('Error', `No results found for "${query}"`)] });
              return;
            }

            const guildId = message.guild.id;
            let playerInstance = Player.getInstance(guildId);

            if (!playerInstance) {
              // Create a new player instance if it doesn't exist
              new Player(guildId, message.member.voice.channel);
              playerInstance = Player.getInstance(guildId);
            }

            playerInstance.addToQueue(song, message.member.voice.channel);
            message.channel.send({ embeds: [createEmbed('Added to Queue', `${song.title}`)] });

            // Start playback if the queue is empty
            if (playerInstance.getQueue().length === 1) {
              playerInstance.play();
            }
          })
          .catch(error => {
            message.channel.send({ embeds: [createEmbed('Error', `An error occurred while adding the song: ${error}`)] });
            console.error(error);
          });
        break;
      }
      case 'skip': {
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
        break;
      }
      case 'stop': {
        const guildId = message.guild.id;
        const playerInstance = Player.getInstance(guildId);

        if (!playerInstance) {
          message.channel.send({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
          return;
        }

        playerInstance.stop();
        message.channel.send({ embeds: [createEmbed('Success', 'Music stopped and queue cleared!')] });
        break;
      }
      case 'queue': {
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
        break;
      }
      case 'pause': {
        const guildId = message.guild.id;
        const playerInstance = Player.getInstance(guildId);

        if (!playerInstance) {
          message.channel.send({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
          return;
        }

        if (playerInstance.isPaused()) {
          message.channel.send({ embeds: [createEmbed('Error', 'The music is already paused!')] });
          return;
        }

        playerInstance.pause();
        message.channel.send({ embeds: [createEmbed('Success', 'Music paused!')] });
        break;
      }
      case 'resume': {
        const guildId = message.guild.id;
        const playerInstance = Player.getInstance(guildId);

        if (!playerInstance) {
          message.channel.send({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
          return;
        }

        if (!playerInstance.isPaused()) {
          message.channel.send({ embeds: [createEmbed('Error', 'The music is already playing!')] });
          return;
        }

        playerInstance.resume();
        message.channel.send({ embeds: [createEmbed('Success', 'Music resumed!')] });
        break;
      }
      case 'volume': {
        const guildId = message.guild.id;
        const playerInstance = Player.getInstance(guildId);

        if (!playerInstance) {
          message.channel.send({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
          return;
        }

        const volumeLevel = parseInt(args[0]);

        if (isNaN(volumeLevel)) {
          message.channel.send({ embeds: [createEmbed('Error', 'Please provide a valid volume level (0-100)!')] });
          return;
        }

        if (volumeLevel < 0 || volumeLevel > 100) {
          message.channel.send({ embeds: [createEmbed('Error', 'Volume level must be between 0 and 100!')] });
          return;
        }

        playerInstance.setVolume(volumeLevel / 100);
        message.channel.send({ embeds: [createEmbed('Success', `Volume set to ${volumeLevel}%!`)] });
        break;
      }
      case 'loop': {
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
        break;
      }
      case 'shuffle': {
        const guildId = message.guild.id;
        const playerInstance = Player.getInstance(guildId);

        if (!playerInstance) {
          message.channel.send({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
          return;
        }

        playerInstance.shuffleQueue();
        message.channel.send({ embeds: [createEmbed('Success', 'Queue shuffled!')] });
        break;
      }
      case 'lyrics': {
        const guildId = message.guild.id;
        const playerInstance = Player.getInstance(guildId);

        if (!playerInstance) {
          message.channel.send({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
          return;
        }

        const currentSong = playerInstance.getCurrentSong();

        // Use lyrics-finder package to fetch lyrics
        const lyrics = await lyricsFinder(currentSong.title, currentSong.artist);

        if (lyrics) {
          const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Lyrics for ${currentSong.title}`)
            .setDescription(lyrics);
          message.channel.send({ embeds: [embed] });
        } else {
          message.channel.send({ embeds: [createEmbed('Error', 'No lyrics found for this song.')] });
        }
        break;
      }
      case 'nowplaying': {
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
        break;
      }
      default: {
        message.channel.send({ embeds: [createEmbed('Invalid Command', `Invalid command: ${command}`)] });
      }
    }
  },
};