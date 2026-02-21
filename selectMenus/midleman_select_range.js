const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Ticket = require('../models/Ticket');

module.exports = {
  customId: 'midleman_select_range',
  async execute(interaction, client) {
    const range = interaction.values[0];
    const tradeData = interaction.client.tempTradeData[interaction.user.id];

    if (!tradeData) {
      return interaction.reply({ 
        content: '❌ Error: No se encontraron los datos del trade. Por favor intenta de nuevo.', 
        ephemeral: true 
      });
    }

    // Create temporary confirmation ticket
    const guild = interaction.guild;
    const category = guild.channels.cache.find(c => c.name === 'tickets-temporales' && c.type === 4);
    
    const tempChannel = await guild.channels.create({
      name: `temp-midleman-${interaction.user.username}`,
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
          id: tradeData.userBId,
          allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
        },
        {
          id: client.user.id,
          allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageChannels']
        }
      ]
    });

    const rangeLabels = {
      'mm_bajo': 'MM BAJO',
      'mm_medio': 'MM MEDIO',
      'mm_alto': 'MM ALTO'
    };

    const embed = new EmbedBuilder()
      .setTitle('🤝 CONFIRMACIÓN DE MIDLEMAN')
      .setDescription('Por favor confirma los detalles del trade:')
      .setColor('#FFD700')
      .addFields(
        { name: '👤 Usuario A', value: `<@${interaction.user.id}>` },
        { name: '👤 Usuario B', value: `<@${tradeData.userBId}>` },
        { name: '📦 Ofrece Usuario A', value: tradeData.userAOffers },
        { name: '📦 Ofrece Usuario B', value: tradeData.userBOffers },
        { name: '🎯 Rango', value: rangeLabels[range] }
      )
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`midleman_confirm_${interaction.user.id}_${tradeData.userBId}_${range}`)
          .setLabel('ACEPTAR')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`midleman_cancel_${interaction.user.id}`)
          .setLabel('RECHAZAR')
          .setStyle(ButtonStyle.Danger)
      );

    await tempChannel.send({
      content: `<@${interaction.user.id}> <@${tradeData.userBId}>`,
      embeds: [embed],
      components: [row]
    });

    await interaction.reply({
      content: `✅ Se ha creado un ticket temporal en ${tempChannel}. Espera a que el otro usuario confirme.`,
      ephemeral: true
    });
  }
};