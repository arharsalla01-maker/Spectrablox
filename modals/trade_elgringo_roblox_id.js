const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const Ticket = require('../models/Ticket');

module.exports = {
  customId: 'trade_elgringo_roblox_id',
  async execute(interaction, client) {
    const robloxId = interaction.fields.getTextInputValue('roblox_id');

    // Create ticket channel
    const guild = interaction.guild;
    const category = guild.channels.cache.find(c => c.name === 'tickets' && c.type === 4);
    
    const ticketChannel = await guild.channels.create({
      name: `trade-${interaction.user.username}`,
      type: 0,
      parent: category?.id,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: ['ViewChannel']
        },
        {
          id: interaction.user.id,
          allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
        },
        {
          id: client.user.id,
          allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageChannels']
        }
      ]
    });

    // Save ticket to database
    const ticket = new Ticket({
      userId: interaction.user.id,
      username: interaction.user.username,
      type: 'TRADE_ELGRINGO',
      channelId: ticketChannel.id,
      status: 'open',
      data: {
        robloxId: robloxId
      }
    });
    await ticket.save();

    // Create embed with instructions
    const embed = new EmbedBuilder()
      .setTitle('🔒 TRADE ELGRINGO')
      .setDescription(`Bienvenido ${interaction.user}, tu ticket ha sido creado.`)
      .setColor('#FFD700')
      .addFields(
        { name: '📋 ID de Roblox', value: robloxId },
        { name: '🌐 Siguiente paso', value: 'Ve a la página web oficial del server y publica tus brainrots ahí, luego manda el enlace de tu perfil aquí.' }
      )
      .setFooter({ text: `Ticket ID: ${ticket._id}` })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`trade_claim_${ticket._id}`)
          .setLabel('RECLAMAR')
          .setStyle(ButtonStyle.Primary),
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

    await ticketChannel.send({
      content: `<@${interaction.user.id}>`,
      embeds: [embed],
      components: [row]
    });

    await interaction.reply({
      content: `✅ Tu ticket ha sido creado en ${ticketChannel}`,
      ephemeral: true
    });
  }
};