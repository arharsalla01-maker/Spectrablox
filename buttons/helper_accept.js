const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Ticket = require('../models/Ticket');

module.exports = {
  customId: /^helper_accept_(.+)$/,
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
        content: '❌ Solo admins y owners pueden aceptar solicitudes de Helper.', 
        ephemeral: true 
      });
    }

    // Give helper role
    const guild = interaction.guild;
    const memberToPromote = await guild.members.fetch(ticket.userId);
    await memberToPromote.roles.add(process.env.HELPER_ROLE_ID);

    // Update ticket status
    ticket.status = 'closed';
    ticket.closedAt = new Date();
    await ticket.save();

    const embed = new EmbedBuilder()
      .setTitle('✅ Solicitud Aceptada')
      .setDescription(`¡Felicidades <@${ticket.userId}>! Tu solicitud de Helper ha sido aceptada.`)
      .setColor('#00FF00')
      .setTimestamp();

    await interaction.update({
      embeds: [embed],
      components: []
    });

    // Close channel after 5 seconds
    setTimeout(async () => {
      await interaction.channel.delete('Solicitud aceptada');
    }, 5000);
  }
};