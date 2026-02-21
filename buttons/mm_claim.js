const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Ticket = require('../models/Ticket');

module.exports = {
  customId: /^mm_claim_(.+)$/,
  async execute(interaction, client) {
    const ticketId = interaction.customId.split('_')[2];
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return interaction.reply({ content: '❌ Ticket no encontrado', ephemeral: true });
    }

    // Check if user has permission to claim based on range
    const member = interaction.member;
    const rangeRoles = {
      'mm_bajo': process.env.MM_BAJO_ROLE_ID,
      'mm_medio': process.env.MM_MEDIO_ROLE_ID,
      'mm_alto': process.env.MM_ALTO_ROLE_ID
    };

    const hasPermission = member.roles.cache.has(rangeRoles[ticket.subType]) || 
                         member.roles.cache.has(process.env.OWNER_ROLE_ID);

    if (!hasPermission) {
      return interaction.reply({ 
        content: `❌ No tienes permiso para reclamar este ticket. Solo midlemans de rango ${ticket.subType.toUpperCase()} y el owner pueden reclamar.`, 
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
          .setCustomId(`mm_claim_${ticket._id}`)
          .setLabel('RECLAMAR')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId(`mm_close_${ticket._id}`)
          .setLabel('CERRAR')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(`mm_scam_${ticket._id}`)
          .setLabel('FUI ESTAFADO')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(`mm_complete_${ticket._id}`)
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