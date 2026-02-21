const { EmbedBuilder } = require('discord.js');

module.exports = {
  customId: 'midleman_rechazar',
  async execute(interaction, client) {
    await interaction.update({
      content: '❌ Has rechazado solicitar un midleman. Si cambias de opinión, puedes volver a usar el comando !tradesecure',
      components: [],
      embeds: []
    });
  }
};