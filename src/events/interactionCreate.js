const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { Player } = require('../../music/player.js');
const { searchMusic } = require('../../music/search.js');

module.exports = {
  name: 'interactionCreate',
  once: false,
  execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const commandName = interaction.commandName;
    const args = interaction.options.data;

    // Handle music commands
    if (commandName === 'play') {
      const searchQuery = args[0].value;

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

        const guildId = interaction.guild.id;
        let playerInstance = Player.getInstance(guildId);

        if (!playerInstance) {
          // Create a new player instance if it doesn't exist
          new Player(guildId, voiceChannel);
          playerInstance = Player.getInstance(guildId);
        }

        playerInstance.addToQueue(song, voiceChannel);
        interaction.reply({ embeds: [createEmbed('Added to Queue', `${song.title}`)] });

        // Start playback if the queue is empty
        if (playerInstance.getQueue().length === 1) {
          playerInstance.play();
        }

      }).catch(error => {
        interaction.reply({ embeds: [createEmbed('Error', `An error occurred while adding the song: ${error}`)] });
        console.error(error);
      });
    } else if (commandName === 'skip') {
      const guildId = interaction.guild.id;
      const playerInstance = Player.getInstance(guildId);

      if (!playerInstance) {
        interaction.reply({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
        return;
      }

      const skippedSong = playerInstance.skip();
      if (skippedSong) {
        interaction.reply({ embeds: [createEmbed('Skipped', `Skipped: ${skippedSong.title}`)] });
      } else {
        interaction.reply({ embeds: [createEmbed('Error', 'There is no song to skip!')] });
      }
    } else if (commandName === 'stop') {
      const guildId = interaction.guild.id;
      const playerInstance = Player.getInstance(guildId);

      if (!playerInstance) {
        interaction.reply({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
        return;
      }

      playerInstance.stop();
      interaction.reply({ embeds: [createEmbed('Success', 'Music stopped and queue cleared!')] });
    } else if (commandName === 'queue') {
      const guildId = interaction.guild.id;
      const playerInstance = Player.getInstance(guildId);

      if (!playerInstance) {
        interaction.reply({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
        return;
      }

      const queue = playerInstance.getQueue();
      if (queue.length === 0) {
        interaction.reply({ embeds: [createEmbed('Error', 'The queue is empty!')] });
        return;
      }

      const queueEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Music Queue')
        .setDescription(queue.map((song, index) => `${index + 1}. ${song.title} - [${song.url}](${song.url})`).join('\n'));

      interaction.reply({ embeds: [queueEmbed] });
    } else if (commandName === 'pause') {
      const guildId = interaction.guild.id;
      const playerInstance = Player.getInstance(guildId);

      if (!playerInstance) {
        interaction.reply({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
        return;
      }

      if (playerInstance.isPaused()) {
        interaction.reply({ embeds: [createEmbed('Error', 'The music is already paused!')] });
        return;
      }

      playerInstance.pause();
      interaction.reply({ embeds: [createEmbed('Success', 'Music paused!')] });
    } else if (commandName === 'resume') {
      const guildId = interaction.guild.id;
      const playerInstance = Player.getInstance(guildId);

      if (!playerInstance) {
        interaction.reply({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
        return;
      }

      if (!playerInstance.isPaused()) {
        interaction.reply({ embeds: [createEmbed('Error', 'The music is already playing!')] });
        return;
      }

      playerInstance.resume();
      interaction.reply({ embeds: [createEmbed('Success', 'Music resumed!')] });
    } else if (commandName === 'volume') {
      const guildId = interaction.guild.id;
      const playerInstance = Player.getInstance(guildId);

      if (!playerInstance) {
        interaction.reply({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
        return;
      }

      const volumeLevel = parseInt(args[0].value);

      if (isNaN(volumeLevel)) {
        interaction.reply({ embeds: [createEmbed('Error', 'Please provide a valid volume level (0-100)!')] });
        return;
      }

      if (volumeLevel < 0 || volumeLevel > 100) {
        interaction.reply({ embeds: [createEmbed('Error', 'Volume level must be between 0 and 100!')] });
        return;
      }

      playerInstance.setVolume(volumeLevel / 100);
      interaction.reply({ embeds: [createEmbed('Success', `Volume set to ${volumeLevel}%!`)] });
    } else if (commandName === 'loop') {
      const guildId = interaction.guild.id;
      const playerInstance = Player.getInstance(guildId);

      if (!playerInstance) {
        interaction.reply({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
        return;
      }

      playerInstance.toggleLoop();
      const looping = playerInstance.isLooping();

      if (looping) {
        interaction.reply({ embeds: [createEmbed('Success', 'Looping enabled!')] });
      } else {
        interaction.reply({ embeds: [createEmbed('Success', 'Looping disabled!')] });
      }
    } else if (commandName === 'shuffle') {
      const guildId = interaction.guild.id;
      const playerInstance = Player.getInstance(guildId);

      if (!playerInstance) {
        interaction.reply({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
        return;
      }

      playerInstance.shuffleQueue();
      interaction.reply({ embeds: [createEmbed('Success', 'Queue shuffled!')] });
    } else if (commandName === 'lyrics') {
      const guildId = interaction.guild.id;
      const playerInstance = Player.getInstance(guildId);

      if (!playerInstance) {
        interaction.reply({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
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
        interaction.reply({ embeds: [embed] });
      } else {
        interaction.reply({ embeds: [createEmbed('Error', 'No lyrics found for this song.')] });
      }
    } else if (commandName === 'nowplaying') {
      const guildId = interaction.guild.id;
      const playerInstance = Player.getInstance(guildId);

      if (!playerInstance) {
        interaction.reply({ embeds: [createEmbed('Error', 'There is no song currently playing!')] });
        return;
      }

      const currentSong = playerInstance.getCurrentSong();
      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Now Playing')
        .setDescription(`${currentSong.title} \n [${currentSong.url}](${currentSong.url})`);

      interaction.reply({ embeds: [embed] });
    }
  },
};