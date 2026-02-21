const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Ticket = require('../models/Ticket');

module.exports = {
  customId: /^midleman_confirm_(.+)_(.+)_(.+)$/,
  async execute(interaction, client) {
    const userAId = interaction.customId.split('_')[2];
    const userBId = interaction.customId.split('_')[3];
    const range = interaction.customId.split('_')[4];

    // Only user B can confirm
    if (interaction.user.id !== userBId) {
      return interaction.reply({ 
        content: '❌ Solo el Usuario B puede confirmar este trade.', 
        ephemeral: true 
      });
    }

    // Delete temporary channel
    await interaction.channel.delete('Confirmación aceptada');

    // Create final ticket
    const guild = interaction.guild;
    const category = guild.channels.cache.find(c => c.name === 'midleman-tickets' && c.type === 4);
    
    // Get role based on range
    const rangeRoles = {
      'mm_bajo': process.env.MM_BAJO_ROLE_ID,
      'mm_medio': process.env.MM_MEDIO_ROLE_ID,
      'mm_alto': process.env.MM_ALTO_ROLE_ID
    };

    const ticketChannel = await guild.channels.create({
      name: `mm-${range}-${interaction.user.username}`,
      type: 0,
      parent: category?.id,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: ['ViewChannel']
        },
        {
          id: userAId,
          allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
        },
        {
          id: userBId,
          allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
        },
        {
          id: rangeRoles[range],
          allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
        },
        {
          id: process.env.OWNER_ROLE_ID,
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
      userId: userAId,
      username: interaction.guild.members.cache.get(userAId)?.user?.username || 'Unknown',
      type: 'MIDLEMAN',
      subType: range,
      channelId: ticketChannel.id,
      status: 'open',
      participants: [userAId, userBId],
      data: {
        range: range,
        userBId: userBId
      }
    });
    await ticket.save();

    // Create modal for Roblox ID
    const modal = new ModalBuilder()
      .setCustomId(`midleman_roblox_id_${ticket._id}`)
      .setTitle('ID de Roblox');

    const robloxIdInput = new TextInputBuilder()
      .setCustomId('roblox_id')
      .setLabel('Ingresa tu ID de Roblox')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setPlaceholder('Ejemplo: 123456789');

    const firstActionRow = new ActionRowBuilder().addComponents(robloxIdInput);
    modal.addComponents(firstActionRow);

    // Send modal to both users
    await interaction.user.send({ modal: modal }).catch(() => {});
    await client.users.fetch(userAId).then(user => {
      user.send({ modal: modal }).catch(() => {});
    }).catch(() => {});

    // Create embed in ticket
    const rangeLabels = {
      'mm_bajo': 'MM BAJO',
      'mm_medio': 'MM MEDIO',
      'mm_alto': 'MM ALTO'
    };

    const embed = new EmbedBuilder()
      .setTitle('🤝 TICKET DE MIDLEMAN')
      .setDescription('Bienvenido a tu ticket de midleman.')
      .setColor('#FFD700')
      .addFields(
        { name: '👤 Usuario A', value: `<@${userAId}>` },
        { name: '👤 Usuario B', value: `<@${userBId}>` },
        { name: '🎯 Rango', value: rangeLabels[range] }
      )
      .setFooter({ text: `Ticket ID: ${ticket._id}` })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`mm_claim_${ticket._id}`)
          .setLabel('RECLAMAR')
          .setStyle(ButtonStyle.Primary),
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

    const message = await ticketChannel.send({
      content: `<@${userAId}> <@${userBId}>`,
      embeds: [embed],
      components: [row]
    });

    // Update ticket with message ID
    ticket.messageId = message.id;
    await ticket.save();
  }
};