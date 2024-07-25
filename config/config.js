require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  youtubeApiKey: process.env.YOUTUBE_API_KEY,
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  soundcloudClientId: process.env.SOUNDCLOUD_CLIENT_ID,
  soundcloudClientSecret: process.env.SOUNDCLOUD_CLIENT_SECRET,
  geniusAccessToken: process.env.GENIUS_ACCESS_TOKEN,
  database: {
    // Configure your database connection here (MySQL, MongoDB, etc.)
    // For SQLite:
    // type: 'sqlite',
    // filename: './src/database/database.sqlite',
    // For MySQL:
    // type: 'mysql',
    // host: 'localhost',
    // dialect: 'mysql',
    // username: 'your_username',
    // password: 'your_password',
    // database: 'your_database_name',
    // For MongoDB:
    // type: 'mongodb',
    // url: 'mongodb://your_username:your_password@your_host:your_port/your_database_name',
  },
};