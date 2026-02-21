const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Ticket = require('../models/Ticket');

module.exports = {
  customId: /^support_close_(.+)$/,
  async execute(interaction, client) {
    const ticketId = interaction.customId.split('_')[2];
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return interaction.reply({ content: '❌ Ticket no encontrado', ephemeral: true });
    }

    // Update ticket status
    ticket.status = 'closed';
    ticket.closedAt = new Date();
    await ticket.save();

    // Disable all buttons
    const originalMessage = await interaction.channel.messages.fetch(ticket.messageId);
    const embed = EmbedBuilder.from(originalMessage.embeds[0])
      .setColor('#FF0000')
      .addFields({ name: '🔒 Estado', value: 'CERRADO' });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`support_claim_${ticket._id}`)
          .setLabel('RECLAMAR')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId(`support_close_${ticket._id}`)
          .setLabel('CERRAR')
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true)
      );

    await originalMessage.edit({ embeds: [embed], components: [row] });

    await interaction.reply({
      content: '🔒 Ticket cerrado.',
      ephemeral: false
    });

    // Close channel after 3 seconds
    setTimeout(async () => {
      await interaction.channel.delete('Ticket cerrado');
    }, 3000);
  }
};