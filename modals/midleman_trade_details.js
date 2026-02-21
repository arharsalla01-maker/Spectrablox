const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
  customId: /^midleman_trade_details_(.+)$/,
  async execute(interaction, client) {
    const userBId = interaction.customId.split('_')[3];
    const userAOffers = interaction.fields.getTextInputValue('user_a_offers');
    const userBOffers = interaction.fields.getTextInputValue('user_b_offers');

    // Store trade details temporarily
    interaction.client.tempTradeData = interaction.client.tempTradeData || {};
    interaction.client.tempTradeData[interaction.user.id] = {
      userBId,
      userAOffers,
      userBOffers
    };

    // Create select menu for trade range
    const selectMenu = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('midleman_select_range')
          .setPlaceholder('Selecciona el rango del trade')
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel('MM BAJO')
              .setValue('mm_bajo')
              .setDescription('Trades de bajo valor')
              .setEmoji('🟢'),
            new StringSelectMenuOptionBuilder()
              .setLabel('MM MEDIO')
              .setValue('mm_medio')
              .setDescription('Trades de valor medio')
              .setEmoji('🟡'),
            new StringSelectMenuOptionBuilder()
              .setLabel('MM ALTO')
              .setValue('mm_alto')
              .setDescription('Trades de alto valor')
              .setEmoji('🔴')
          )
      );

    await interaction.reply({
      content: 'Selecciona el rango del trade:',
      components: [selectMenu],
      ephemeral: true
    });
  }
};