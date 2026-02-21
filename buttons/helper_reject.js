const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Ticket = require('../models/Ticket');

module.exports = {
  customId: /^helper_reject_(.+)$/,
  async execute(interaction, client) {
    const ticketId = interaction.customId.split('_')[2];
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
        content: '❌ Solo admins y owners pueden rechazar solicitudes de Helper.', 
        ephemeral: true 
      });
    }

    // Update ticket status
    ticket.status = 'closed';
    ticket.closedAt = new Date();
    await ticket.save();

    const embed = new EmbedBuilder()
      .setTitle('❌ Solicitud Rechazada')
      .setDescription(`Lo sentimos <@${ticket.userId}>, tu solicitud de Helper ha sido rechazada.`)
      .setColor('#FF0000')
      .setTimestamp();

    await interaction.update({
      embeds: [embed],
      components: []
    });

    // Close channel after 5 seconds
    setTimeout(async () => {
      await interaction.channel.delete('Solicitud rechazada');
    }, 5000);
  }
};