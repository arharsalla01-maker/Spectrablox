const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const Ticket = require('../models/Ticket');

module.exports = {
  customId: /^trade_complete_(.+)$/,
  async execute(interaction, client) {
    const ticketId = interaction.customId.split('_')[2];
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return interaction.reply({ content: '❌ Ticket no encontrado', ephemeral: true });
    }

    // Only the creator can complete the trade
    if (interaction.user.id !== ticket.userId) {
      return interaction.reply({ 
        content: '❌ Solo la persona que creó el ticket puede marcarlo como completado.', 
        ephemeral: true 
      });
    }

    // Create modal for feedback
    const modal = new ModalBuilder()
      .setCustomId(`trade_feedback_${ticketId}`)
      .setTitle('¿Cómo te fue en el trade?');

    const feedbackInput = new TextInputBuilder()
      .setCustomId('feedback')
      .setLabel('Cuéntanos tu experiencia')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setPlaceholder('¿Cómo te fue? ¿Todo salió bien?');

    const firstActionRow = new ActionRowBuilder().addComponents(feedbackInput);
    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
  }
};