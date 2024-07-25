const { version } = require('discord.js');

module.exports = {
  // Discord API Version
  DISCORD_API_VERSION: version,

  // Bot Prefix
  PREFIX: '!',

  // Default Language
  DEFAULT_LANGUAGE: 'en',

  // Supported Languages
  SUPPORTED_LANGUAGES: ['en', 'fr', 'es'],

  // Maximum Song Queue Size
  MAX_QUEUE_SIZE: 100,

  // Music Source Types
  MUSIC_SOURCE_TYPES: ['youtube', 'spotify', 'soundcloud'],

  // Default Volume
  DEFAULT_VOLUME: 0.5,

  // Discord.js Intents
  INTENTS: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],

  // Embed Color
  EMBED_COLOR: '#0099ff',

  // Bot Error Codes
  ERROR_CODES: {
    NO_RESULTS_FOUND: 'NO_RESULTS_FOUND',
    INVALID_SEARCH_QUERY: 'INVALID_SEARCH_QUERY',
    NOT_IN_VOICE_CHANNEL: 'NOT_IN_VOICE_CHANNEL',
    NO_SONG_PLAYING: 'NO_SONG_PLAYING',
    QUEUE_IS_EMPTY: 'QUEUE_IS_EMPTY',
    MUSIC_ALREADY_PAUSED: 'MUSIC_ALREADY_PAUSED',
    MUSIC_ALREADY_PLAYING: 'MUSIC_ALREADY_PLAYING',
    INVALID_VOLUME_LEVEL: 'INVALID_VOLUME_LEVEL',
    FAILED_TO_JOIN_VOICE_CHANNEL: 'FAILED_TO_JOIN_VOICE_CHANNEL',
    FAILED_TO_PLAY_SONG: 'FAILED_TO_PLAY_SONG',
    FAILED_TO_FETCH_LYRICS: 'FAILED_TO_FETCH_LYRICS',
    INVALID_SONG_INDEX: 'INVALID_SONG_INDEX',
  },
};