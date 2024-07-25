const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');

module.exports = {
  name: 'prefix',
  description: 'Sets the bot\'s prefix for this server.',
  options: [
    {
      name: 'prefix',
      description: 'The new prefix to set.',
      type: 3,
      required: true,
    },
  ],
  execute(interaction, args) {
    const prefix = interaction.options.getString('prefix');
    const guildId = interaction.guild.id;

    // Store the prefix in a database or a local file
    // (replace with your actual database or file storage logic)
    // Example using a simple JSON file:
    const guildSettings = require(`../../config/guilds/${guildId}.json`);
    guildSettings.prefix = prefix;

    // Save the updated settings
    require('fs').writeFileSync(`../../config/guilds/${guildId}.json`, JSON.stringify(guildSettings));

    interaction.reply({ embeds: [createEmbed('Success', `Prefix set to ${prefix}!`)] });
  },
};