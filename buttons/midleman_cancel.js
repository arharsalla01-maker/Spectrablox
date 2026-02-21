const { EmbedBuilder } = require('discord.js');

module.exports = {
  customId: /^midleman_cancel_(.+)$/,
  async execute(interaction, client) {
    await interaction.update({
      content: '❌ Has cancelado la solicitud de midleman.',
      components: [],
      embeds: []
    });

    // Delete temporary channel after 3 seconds
    setTimeout(async () => {
      await interaction.channel.delete('Solicitud cancelada');
    }, 3000);
  }
};