const { EmbedBuilder } = require('discord.js');

module.exports = {
  customId: 'trade_elgringo_no_acepto',
  async execute(interaction, client) {
    await interaction.update({
      content: '❌ Has rechazado las condiciones. Si cambias de opinión, puedes volver a usar el comando !tradesecure',
      components: [],
      embeds: []
    });
  }
};