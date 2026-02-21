const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('soporte')
    .setDescription('Abre el menú de soporte'),

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle('SISTEMA DE TICKETS- ELGRINGO')
      .setDescription('🎮|¿NECESITAS AYUDA?\n                                  ABRE UN TICKET PARA AYUDA 🎯')
      .setColor('#FFD700')
      .setThumbnail('https://cdn.discordapp.com/attachments/1470128567391224043/1474417196456349706/2EC218AD-AFED-4A33-9D87-1BC640B30A0D.png?ex=6999c584&is=69987404&hm=d431aa55ab1ecbecd622e268fb70db24f14969779b32dcee47219fd6682956f8&')
      .setFooter({ text: 'SISTEMA DE TICKETS|ELGRINGO' })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('soporte_menu')
          .setLabel('SOPORTE')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('🎮')
      );

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};