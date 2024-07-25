const { MessageEmbed } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');

module.exports = {
  name: 'language',
  description: 'Sets the bot\'s language.',
  options: [
    {
      name: 'language',
      description: 'The language to set (e.g., en, fr, es).',
      type: 3,
      required: true,
      choices: [
        { name: 'English', value: 'en' },
        { name: 'French', value: 'fr' },
        { name: 'Spanish', value: 'es' },
        // Add more languages as needed
      ],
    },
  ],
  execute(interaction, args) {
    const language = interaction.options.getString('language');
    const guildId = interaction.guild.id;

    // Store the language in a database or a local file
    // (replace with your actual database or file storage logic)
    // Example using a simple JSON file:
    const guildSettings = require(`../../config/guilds/${guildId}.json`);
    guildSettings.language = language;

    // Save the updated settings
    require('fs').writeFileSync(`../../config/guilds/${guildId}.json`, JSON.stringify(guildSettings));

    interaction.reply({ embeds: [createEmbed('Success', `Bot language set to ${language}!`)] });
  },
};