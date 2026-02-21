const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Ticket = require('../models/Ticket');

module.exports = {
  customId: /^trade_claim_(.+)$/,
  async execute(interaction, client) {
    const ticketId = interaction.customId.split('_')[2];
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return interaction.reply({ content: '❌ Ticket no encontrado', ephemeral: true });
    }

    // Check if user has permission to claim
    const member = interaction.member;
    const hasPermission = member.roles.cache.some(role => 
      ['mod', 'admin', 'owner'].some(name => role.name.toLowerCase().includes(name))
    );

    if (!hasPermission) {
      return interaction.reply({ 
        content: '❌ No tienes permiso para reclamar este ticket. Solo mods, admins y owners pueden reclamar.', 
        ephemeral: true 
      });
    }

    if (ticket.status !== 'open') {
      return interaction.reply({ 
        content: '❌ Este ticket ya ha sido reclamado o cerrado.', 
        ephemeral: true 
      });
    }

    // Update ticket status
    ticket.status = 'claimed';
    ticket.claimedBy = interaction.user.id;
    ticket.claimedByUsername = interaction.user.username;
    await ticket.save();

    // Update embed
    const originalMessage = await interaction.channel.messages.fetch(ticket.messageId);
    const embed = EmbedBuilder.from(originalMessage.embeds[0])
      .addFields({ name: '👤 Reclamado por', value: interaction.user.username });

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
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(`trade_scam_${ticket._id}`)
          .setLabel('FUI ESTAFADO')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(`trade_complete_${ticket._id}`)
          .setLabel('TRADE COMPLETADO')
          .setStyle(ButtonStyle.Success)
      );

    await originalMessage.edit({ embeds: [embed], components: [row] });

    await interaction.reply({
      content: `✅ Ticket reclamado por ${interaction.user.username}`,
      ephemeral: false
    });
  }
};