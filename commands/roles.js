const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roles')
    .setDescription('Abre el menú de roles'),

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle('👑 ROLES')
      .setDescription('**ROL:REAL:** Tiene ventajas en el server y se sabe que eres confiable\n\n**ROL:HELPER:** Mod de prueba ayudas en el server y controlas en el server cosas mínimas\n\n**ROL:MIDLEMAN:** Controla tickets de midleman depende de que fianza dejes se te dará un rol.')
      .setColor('#FFD700')
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('roles_menu')
          .setLabel('👑 SOLICITAR ROLES')
          .setStyle(ButtonStyle.Primary)
      );

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};