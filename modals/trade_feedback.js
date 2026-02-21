const { EmbedBuilder } = require('discord.js');
const Ticket = require('../models/Ticket');
const Brainrot = require('../models/Brainrot');

module.exports = {
  customId: /^trade_feedback_(.+)$/,
  async execute(interaction, client) {
    const ticketId = interaction.customId.split('_')[2];
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return interaction.reply({ content: '❌ Ticket no encontrado', ephemeral: true });
    }

    const feedback = interaction.fields.getTextInputValue('feedback');

    // Send feedback to proofs channel
    const proofsChannel = await client.channels.fetch(process.env.PROOFS_CHANNEL_ID);
    
    const embed = new EmbedBuilder()
      .setTitle('✅ TRADE COMPLETADO')
      .setColor('#00FF00')
      .addFields(
        { name: '👤 Usuario', value: `<@${ticket.userId}>` },
        { name: '📋 ID de Roblox', value: ticket.data.robloxId },
        { name: '💬 Feedback', value: feedback }
      )
      .setTimestamp();

    await proofsChannel.send({ embeds: [embed] });

    // Update ticket status
    ticket.status = 'closed';
    ticket.closedAt = new Date();
    ticket.data.feedback = feedback;
    await ticket.save();

    // Disable all buttons in ticket
    const originalMessage = await interaction.channel.messages.fetch(ticket.messageId);
    const updatedEmbed = EmbedBuilder.from(originalMessage.embeds[0])
      .setColor('#00FF00')
      .addFields({ name: '✅ Estado', value: 'COMPLETADO' });

    const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
    
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`trade_claim_${ticket._id}`)
          .setLabel('RECLAMAR')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId(`trade_close_${ticket._id}`)
          .setLabel('CERRAR')
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId(`trade_scam_${ticket._id}`)
          .setLabel('FUI ESTAFADO')
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId(`trade_complete_${ticket._id}`)
          .setLabel('TRADE COMPLETADO')
          .setStyle(ButtonStyle.Success)
          .setDisabled(true)
      );

    await originalMessage.edit({ embeds: [updatedEmbed], components: [row] });

    await interaction.reply({
      content: '✅ ¡Gracias por tu feedback! Tu trade ha sido completado exitosamente.',
      ephemeral: false
    });

    // Close channel after 3 seconds
    setTimeout(async () => {
      await interaction.channel.delete('Trade completado');
    }, 3000);
  }
};