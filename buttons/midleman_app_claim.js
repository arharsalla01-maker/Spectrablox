const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Ticket = require('../models/Ticket');

module.exports = {
  customId: /^midleman_app_claim_(.+)$/,
  async execute(interaction, client) {
    const ticketId = interaction.customId.split('_')[3];
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return interaction.reply({ content: '❌ Ticket no encontrado', ephemeral: true });
    }

    // Check if user has permission
    const member = interaction.member;
    const hasPermission = member.roles.cache.has(process.env.ADMIN_ROLE_ID) || 
                         member.roles.cache.has(process.env.OWNER_ROLE_ID);

    if (!hasPermission) {
      return interaction.reply({ 
        content: '❌ Solo admins y owners pueden reclamar solicitudes de Midleman.', 
        ephemeral: true 
      });
    }

    // Update ticket status
    ticket.status = 'claimed';
    ticket.claimedBy = interaction.user.id;
    ticket.claimedByUsername = interaction.user.username;
    await ticket.save();

    const embed = EmbedBuilder.from(interaction.message.embeds[0])
      .addFields({ name: '👤 Reclamado por', value: interaction.user.username });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`midleman_app_give_role_${ticket._id}`)
          .setLabel('DAR ROL')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`midleman_app_cancel_${ticket._id}`)
          .setLabel('CANCELAR')
          .setStyle(ButtonStyle.Danger)
      );

    await interaction.update({
      embeds: [embed],
      components: [row]
    });
  }
};