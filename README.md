# Discord Music Bot

This repository contains the source code for a Discord music bot built with Node.js and Discord.js. This bot aims to provide a seamless and enjoyable music experience for Discord server users.

## Features

- **Music Playback:** Play music from YouTube, Spotify, and SoundCloud.
- **Queue Management:** Add songs to the queue, skip tracks, and control playback.
- **Playlist Management:** Create, save, load, and share custom playlists.
- **User-Friendly Interface:** Simple and intuitive command-based system.
- **Voice Channel Integration:** Join and leave voice channels, control volume, and manage audio output.
- **Lyrics Retrieval:** Fetch lyrics for the currently playing song.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/discord-music-bot.git
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Set up your environment variables:**
   - Replace the placeholders in `.env` with your Discord bot token and any API keys.
   - **DISCORD_TOKEN:** Your Discord bot token.
   - **YOUTUBE_API_KEY:** Your Google Cloud Platform API key for the YouTube Data API v3.
   - **SPOTIFY_CLIENT_ID:** Your Spotify client ID.
   - **SPOTIFY_CLIENT_SECRET:** Your Spotify client secret.
   - **SOUNDCLOUD_CLIENT_ID:** Your SoundCloud client ID.
   - **SOUNDCLOUD_CLIENT_SECRET:** Your SoundCloud client secret.
   - **GENIUS_ACCESS_TOKEN:** Your Genius API access token.

5. **Run the bot:**
   ```bash
   npm start
   ```

## Commands

- **`!play <query>`:** Play a song or playlist from YouTube, Spotify, or SoundCloud.
- **`!skip`:** Skip the currently playing song.
- **`!stop`:** Stop the music and clear the queue.
- **`!queue`:** Display the current music queue.
- **`!pause`:** Pause the music playback.
- **`!resume`:** Resume the music playback.
- **`!volume <level>`:** Adjust the music volume (0-100).
- **`!loop`:** Toggle looping the current song.
- **`!shuffle`:** Shuffle the music queue.
- **`!lyrics`:** Display lyrics for the currently playing song.

## Contributing

Contributions are welcome! Please open an issue or pull request to suggest improvements or report bugs.

## License

This project is licensed under the MIT License.

## Disclaimer

This bot is provided for educational purposes only. It is not intended for commercial use. Please ensure you comply with the terms of service and API usage guidelines for each music streaming service.