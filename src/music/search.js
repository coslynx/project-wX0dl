const { createEmbed } = require('../../utils/embed.js');
const ytsr = require('ytsr');
const ytdl = require('ytdl-core');
const spotify = require('../../music/spotify.js');
const soundcloud = require('../../music/soundcloud.js');

/**
 * Searches for music based on the provided query.
 * @param {string} query The search query.
 * @returns {Promise<Object>} A promise that resolves with the song object or null if no results are found.
 */
async function searchMusic(query) {
  // Search YouTube first
  try {
    const searchResults = await ytsr(query, { limit: 1 });
    if (searchResults.items.length > 0) {
      const video = searchResults.items[0];
      return {
        title: video.title,
        url: video.url,
        type: 'youtube',
        duration: ytdl.getDuration(video.url),
      };
    }
  } catch (error) {
    console.error('Error searching YouTube:', error);
  }

  // Search Spotify if YouTube search fails
  try {
    const spotifyResult = await spotify.search(query);
    if (spotifyResult) {
      return {
        title: spotifyResult.name,
        url: spotifyResult.external_urls.spotify,
        type: 'spotify',
        duration: spotifyResult.duration_ms,
      };
    }
  } catch (error) {
    console.error('Error searching Spotify:', error);
  }

  // Search SoundCloud if YouTube and Spotify searches fail
  try {
    const soundcloudResult = await soundcloud.search(query);
    if (soundcloudResult) {
      return {
        title: soundcloudResult.title,
        url: soundcloudResult.permalink_url,
        type: 'soundcloud',
        duration: soundcloudResult.duration,
      };
    }
  } catch (error) {
    console.error('Error searching SoundCloud:', error);
  }

  // Return null if no results are found
  return null;
}

module.exports = {
  searchMusic,
};