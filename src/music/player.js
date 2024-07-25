const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, VoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { createEmbed } = require('../../utils/embed.js');
const { logger } = require('../../utils/logger.js');
const spotify = require('../spotify.js');
const soundcloud = require('../soundcloud.js');

class Player {
  static instances = {};

  constructor(guildId, voiceChannel) {
    this.guildId = guildId;
    this.voiceChannel = voiceChannel;
    this.connection = null;
    this.player = createAudioPlayer();
    this.queue = [];
    this.currentSong = null;
    this.looping = false;
    this.volume = 1;
    this.channelId = null;

    Player.instances[guildId] = this;

    this.player.on(AudioPlayerStatus.Playing, () => {
      logger.info(`Playing: ${this.currentSong.title}`);
    });

    this.player.on(AudioPlayerStatus.AutoPaused, () => {
      logger.info('Audio player auto-paused.');
    });

    this.player.on(AudioPlayerStatus.Buffering, () => {
      logger.info('Audio player buffering.');
    });

    this.player.on(AudioPlayerStatus.Paused, () => {
      logger.info('Audio player paused.');
    });

    this.player.on(AudioPlayerStatus.Idle, () => {
      logger.info('Audio player idle.');
      this.playNext();
    });

    this.player.on('error', (error) => {
      logger.error(`Error occurred in player: ${error}`);
    });
  }

  static getInstance(guildId) {
    return Player.instances[guildId];
  }

  setChannelId(channelId) {
    this.channelId = channelId;
  }

  addToQueue(song, voiceChannel) {
    this.queue.push({ ...song, channelId: voiceChannel.id });
  }

  getQueue() {
    return this.queue;
  }

  clearQueue() {
    this.queue = [];
  }

  getCurrentSong() {
    return this.currentSong;
  }

  play() {
    if (this.connection && this.connection.state.status === VoiceConnectionStatus.Ready) {
      this.playNext();
    } else {
      this.joinVoiceChannel(this.voiceChannel);
    }
  }

  playNext() {
    if (this.queue.length > 0) {
      this.currentSong = this.queue.shift();
      this.playSong(this.currentSong);
    } else {
      this.player.stop();
      this.currentSong = null;
    }
  }

  skip() {
    if (this.queue.length > 0) {
      const skippedSong = this.currentSong;
      this.playNext();
      return skippedSong;
    } else {
      return null;
    }
  }

  stop() {
    this.player.stop();
    this.queue = [];
    this.currentSong = null;
    this.disconnect();
  }

  pause() {
    this.player.pause();
  }

  resume() {
    this.player.unpause();
  }

  isPaused() {
    return this.player.state.status === AudioPlayerStatus.Paused;
  }

  isLooping() {
    return this.looping;
  }

  toggleLoop() {
    this.looping = !this.looping;
  }

  setVolume(volume) {
    this.volume = volume;
    this.player.setVolumeLogarithmic(volume);
  }

  shuffleQueue() {
    this.queue.sort(() => Math.random() - 0.5);
  }

  async joinVoiceChannel(voiceChannel) {
    try {
      this.connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });
      logger.info(`Joined voice channel: ${voiceChannel.name}`);
      this.play();
    } catch (error) {
      logger.error(`Error joining voice channel: ${error}`);
    }
  }

  async playSong(song) {
    try {
      let resource;

      switch (song.type) {
        case 'youtube':
          resource = await createAudioResource(song.url, {
            inputType: StreamType.Arbitrary,
          });
          break;
        case 'spotify':
          resource = await createAudioResource(await spotify.getAudioStream(song.url), {
            inputType: StreamType.Arbitrary,
          });
          break;
        case 'soundcloud':
          resource = await createAudioResource(await soundcloud.download(song.url), {
            inputType: StreamType.Arbitrary,
          });
          break;
        default:
          return;
      }

      this.player.play(resource);
      this.connection.subscribe(this.player);

      const channel = this.connection.joinConfig.channelId;
      const voiceChannel = this.voiceChannel.client.channels.cache.get(channel);
      if (voiceChannel) {
        voiceChannel.send({ embeds: [createEmbed('Now Playing', `${song.title}\n${song.url}`)] });
      }

    } catch (error) {
      logger.error(`Error playing song: ${error}`);
    }
  }

  disconnect() {
    if (this.connection) {
      this.connection.disconnect();
      this.connection = null;
      logger.info('Disconnected from voice channel.');
    }
  }
}

module.exports = { Player };