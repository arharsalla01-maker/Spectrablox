const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
  customId: 'roles_menu',
  async execute(interaction, client) {
    const selectMenu = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('roles_options')
          .setPlaceholder('Selecciona un rol')
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel('REAL')
              .setValue('real')
              .setDescription('Obtén el rol REAL iniciando sesión en la web')
              .setEmoji('💎'),
            new StringSelectMenuOptionBuilder()
              .setLabel('HELPER')
              .setValue('helper')
              .setDescription('Solicita el rol de Helper')
              .setEmoji('🛡️'),
            new StringSelectMenuOptionBuilder()
              .setLabel('MIDLEMAN')
              .setValue('midleman')
              .setDescription('Solicita el rol de Midleman')
              .setEmoji('🤝')
          )
      );

    await interaction.reply({
      content: 'Selecciona el rol que deseas solicitar:',
      components: [selectMenu],
      ephemeral: true
    });
  }
};