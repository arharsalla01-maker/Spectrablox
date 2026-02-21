const { EmbedBuilder } = require('discord.js');
const Ticket = require('../models/Ticket');

module.exports = {
  customId: /^midleman_select_rank_(.+)$/,
  async execute(interaction, client) {
    const ticketId = interaction.customId.split('_')[3];
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return interaction.reply({ content: '❌ Ticket no encontrado', ephemeral: true });
    }

    const rank = interaction.values[0];

    // Get role ID based on rank
    const rankRoles = {
      'mm_bajo': process.env.MM_BAJO_ROLE_ID,
      'mm_medio': process.env.MM_MEDIO_ROLE_ID,
      'mm_alto': process.env.MM_ALTO_ROLE_ID
    };

    const rankLabels = {
      'mm_bajo': 'MM BAJO',
      'mm_medio': 'MM MEDIO',
      'mm_alto': 'MM ALTO'
    };

    // Give the role
    const guild = interaction.guild;
    const member = await guild.members.fetch(ticket.userId);
    await member.roles.add(rankRoles[rank]);

    // Update ticket status
    ticket.status = 'closed';
    ticket.closedAt = new Date();
    ticket.data = ticket.data || {};
    ticket.data.rank = rank;
    await ticket.save();

    const embed = new EmbedBuilder()
      .setTitle('✅ Rol de Midleman Otorgado')
      .setDescription(`¡Felicidades <@${ticket.userId}>! Has recibido el rol de ${rankLabels[rank]}.`)
      .setColor('#00FF00')
      .setTimestamp();

    await interaction.update({
      content: '✅ Rol otorgado exitosamente.',
      ephemeral: true
    });

    // Update the ticket message
    const ticketChannel = await client.channels.fetch(ticket.channelId);
    const originalMessage = await ticketChannel.messages.fetch(ticket.messageId);
    
    await originalMessage.edit({
      embeds: [embed],
      components: []
    });

    // Close channel after 5 seconds
    setTimeout(async () => {
      await ticketChannel.delete('Rol otorgado');
    }, 5000);
  }
};