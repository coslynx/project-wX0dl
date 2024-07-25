const { MessageEmbed } = require('discord.js');
const { constants } = require('./constants.js');

/**
 * Creates a Discord message embed with the specified title, description, and color.
 *
 * @param {string} title The title of the embed.
 * @param {string} description The description of the embed.
 * @param {string} color The color of the embed.
 * @returns {MessageEmbed} A Discord message embed object.
 */
function createEmbed(title, description, color = constants.EMBED_COLOR) {
  const embed = new MessageEmbed()
    .setColor(color)
    .setTitle(title)
    .setDescription(description);

  return embed;
}

module.exports = {
  createEmbed,
};