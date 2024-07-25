const { createEmbed } = require('../../utils/embed.js');
const { Player } = require('../../music/player.js');

module.exports = {
  name: 'guildCreate',
  once: true,
  execute(guild) {
    // Create a folder for the guild in the config directory
    const guildId = guild.id;
    const guildSettingsPath = `../../config/guilds/${guildId}.json`;

    // Create the guild settings file with default values
    const guildSettings = {
      prefix: '!', // Default prefix for the guild
      playlists: {}, // Initialize an empty object for playlists
    };

    try {
      // Try to write the guild settings file
      require('fs').writeFileSync(guildSettingsPath, JSON.stringify(guildSettings));
      console.log(`Created guild settings file for ${guild.name} (${guildId})`);
    } catch (error) {
      // Handle any errors that occur during file creation
      console.error(`Error creating guild settings file: ${error}`);
    }

    // Initialize a new Player instance for the guild
    // This ensures the bot has a player instance available for the guild
    new Player(guildId, null); 
    console.log(`Joined guild: ${guild.name} (${guildId})`);
  },
};