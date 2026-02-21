const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
  customId: 'soporte_menu',
  async execute(interaction, client) {
    const selectMenu = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('soporte_options')
          .setPlaceholder('Selecciona una opción')
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel('TRADE SECURE')
              .setValue('trade_secure')
              .setDescription('Ve al canal de trade secure')
              .setEmoji('🔒'),
            new StringSelectMenuOptionBuilder()
              .setLabel('REPORTAR ESTAFA')
              .setValue('reportar_estafa')
              .setDescription('Reporta una estafa')
              .setEmoji('⚠️'),
            new StringSelectMenuOptionBuilder()
              .setLabel('RECLAMAR PREMIO')
              .setValue('reclamar_premio')
              .setDescription('Reclama un premio')
              .setEmoji('🎁'),
            new StringSelectMenuOptionBuilder()
              .setLabel('QUIERO ROLES')
              .setValue('quiero_roles')
              .setDescription('Ve al canal de roles')
              .setEmoji('👑'),
            new StringSelectMenuOptionBuilder()
              .setLabel('ALIANZAS')
              .setValue('alianzas')
              .setDescription('Solicita una alianza')
              .setEmoji('🤝'),
            new StringSelectMenuOptionBuilder()
              .setLabel('OTROS')
              .setValue('otros')
              .setDescription('Otras consultas')
              .setEmoji('❓')
          )
      );

    await interaction.reply({
      content: 'Selecciona una opción del menú:',
      components: [selectMenu],
      ephemeral: true
    });
  }
};