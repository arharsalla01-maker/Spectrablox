const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Ticket = require('../models/Ticket');

module.exports = {
  customId: 'trade_elgringo_acepto',
  async execute(interaction, client) {
    // Create modal for Roblox ID
    const modal = new ModalBuilder()
      .setCustomId('trade_elgringo_roblox_id')
      .setTitle('ID de Roblox');

    const robloxIdInput = new TextInputBuilder()
      .setCustomId('roblox_id')
      .setLabel('Ingresa tu ID de Roblox')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setPlaceholder('Ejemplo: 123456789');

    const firstActionRow = new ActionRowBuilder().addComponents(robloxIdInput);
    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
  }
};