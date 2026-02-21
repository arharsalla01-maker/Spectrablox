const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tradesecure')
    .setDescription('Abre el menú de Trade Secure'),

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle('SISTEMA DE TRADES ELGRINGO')
      .setDescription('TRADE ELGRINGO\n\nSOLICITAR MIDLEMAN')
      .setColor('#FFD700')
      .setFooter({ text: 'SISTEMA DE TRADES SEGURO' })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('tradesecure_menu')
          .setLabel('TRADE SECURE')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('🔒')
      );

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};