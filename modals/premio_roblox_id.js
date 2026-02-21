const { EmbedBuilder } = require('discord.js');
const Ticket = require('../models/Ticket');

module.exports = {
  customId: /^premio_roblox_id_(.+)$/,
  async execute(interaction, client) {
    const ticketId = interaction.customId.split('_')[3];
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return interaction.reply({ content: '❌ Ticket no encontrado', ephemeral: true });
    }

    const robloxId = interaction.fields.getTextInputValue('roblox_id');

    // Update ticket with Roblox ID
    ticket.data = ticket.data || {};
    ticket.data.robloxId = robloxId;
    await ticket.save();

    // Send message to ticket channel
    const ticketChannel = await client.channels.fetch(ticket.channelId);
    
    const embed = new EmbedBuilder()
      .setTitle('📋 ID de Roblox')
      .setDescription(`El usuario ha proporcionado su ID de Roblox: ${robloxId}`)
      .setColor('#FFD700')
      .setTimestamp();

    await ticketChannel.send({ embeds: [embed] });

    await interaction.reply({
      content: '✅ Tu ID de Roblox ha sido guardado en el ticket.',
      ephemeral: true
    });
  }
};