const { Player } = require('../../music/player.js');

module.exports = {
  name: 'voiceStateUpdate',
  once: false,
  execute(oldState, newState) {
    const guildId = oldState.guild.id;
    const playerInstance = Player.getInstance(guildId);

    // If there is no player instance for the guild, return
    if (!playerInstance) return;

    // If the bot is leaving the voice channel, disconnect the player
    if (newState.id === playerInstance.client.user.id && !newState.channel) {
      playerInstance.stop();
    }

    // If the bot is joining a voice channel, update the channelId
    if (newState.id === playerInstance.client.user.id && newState.channel) {
      playerInstance.setChannelId(newState.channel.id);
    }

    // If the bot is being disconnected from the voice channel, disconnect the player
    if (oldState.id === playerInstance.client.user.id && oldState.channel && !newState.channel) {
      playerInstance.stop();
    }
  },
};