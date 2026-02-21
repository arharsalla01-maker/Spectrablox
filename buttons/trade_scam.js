const { EmbedBuilder } = require('discord.js');
const Ticket = require('../models/Ticket');

module.exports = {
  customId: /^trade_scam_(.+)$/,
  async execute(interaction, client) {
    const ticketId = interaction.customId.split('_')[2];
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return interaction.reply({ content: '❌ Ticket no encontrado', ephemeral: true });
    }

    // Send scam alert in red
    const embed = new EmbedBuilder()
      .setTitle('⚠️ ALERTA DE POSIBLE ESTAFA')
      .setDescription('Esto podría ser una estafa. Mantén la calma.')
      .setColor('#FF0000')
      .addFields(
        { name: '👤 Usuario', value: `<@${ticket.userId}>` },
        { name: '📋 ID de Roblox', value: ticket.data.robloxId }
      )
      .setTimestamp();

    // Mention owner and admin
    await interaction.channel.send({
      content: '<@&owner> <@&admin>',
      embeds: [embed]
    });

    await interaction.reply({
      content: '⚠️ Se ha notificado al staff sobre esta posible estafa.',
      ephemeral: false
    });
  }
};