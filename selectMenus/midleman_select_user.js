const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  customId: 'midleman_select_user',
  async execute(interaction, client) {
    const selectedUserId = interaction.values[0];
    const selectedUser = await client.users.fetch(selectedUserId);

    // Create modal for trade details
    const modal = new ModalBuilder()
      .setCustomId(`midleman_trade_details_${selectedUserId}`)
      .setTitle('Detalles del Trade');

    const userAInput = new TextInputBuilder()
      .setCustomId('user_a_offers')
      .setLabel('¿Qué da el usuario A (tú)?')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setPlaceholder('Describe qué vas a dar en el trade');

    const userBInput = new TextInputBuilder()
      .setCustomId('user_b_offers')
      .setLabel(`¿Qué da ${selectedUser.username}?`)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setPlaceholder('Describe qué va a dar el otro usuario');

    const firstActionRow = new ActionRowBuilder().addComponents(userAInput);
    const secondActionRow = new ActionRowBuilder().addComponents(userBInput);
    
    modal.addComponents(firstActionRow, secondActionRow);

    await interaction.showModal(modal);
  }
};