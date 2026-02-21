const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  customId: 'tradesecure_menu',
  async execute(interaction, client) {
    const selectMenu = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('tradesecure_options')
          .setPlaceholder('Selecciona una opción')
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel('TRADE ELGRINGO')
              .setValue('trade_elgringo')
              .setDescription('Trade seguro con el equipo del server')
              .setEmoji('🔒'),
            new StringSelectMenuOptionBuilder()
              .setLabel('SOLICITAR MIDLEMAN')
              .setValue('solicitar_midleman')
              .setDescription('Obtén ayuda para hacer trades con otros usuarios')
              .setEmoji('🤝')
          )
      );

    await interaction.reply({
      content: 'Selecciona una opción del menú:',
      components: [selectMenu],
      ephemeral: true
    });
  }
};