const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Ticket = require('../models/Ticket');

module.exports = {
  customId: 'tradesecure_options',
  async execute(interaction, client) {
    const selectedOption = interaction.values[0];

    if (selectedOption === 'trade_elgringo') {
      // Create rules ticket
      const embed = new EmbedBuilder()
        .setTitle('TRADE ELGRINGO')
        .setDescription('TRADE ELGRINGO ES UN TRADE 100% SEGURO DONDE TRADEARAS CON EL EQUIPO DEL SERVER')
        .setColor('#FFD700')
        .addFields(
          { name: '📃 ANTES DE SEGUIR CON EL TRADE TIENES QUE LEER NUESTRAS NORMAS Y ACEPTARLAS:', value: '\n1. Todos los trades se hacen en nuestro server privado\n2. Nosotros cojemos primero todo y después cojes tú\n3. Si aceptas estas condiciones dale al botón de ACEPTO gracias.' }
        )
        .setTimestamp();

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('trade_elgringo_acepto')
            .setLabel('ACEPTO ESTAS CONDICIONES')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('trade_elgringo_no_acepto')
            .setLabel('NO ACEPTO')
            .setStyle(ButtonStyle.Danger)
        );

      await interaction.reply({
        content: '📋 Por favor lee las normas cuidadosamente:',
        embeds: [embed],
        components: [row],
        ephemeral: true
      });
    } else if (selectedOption === 'solicitar_midleman') {
      // Show midleman info embed
      const embed = new EmbedBuilder()
        .setTitle('¿NECESITAS UN MIDLEMAN?')
        .setDescription('UN MIDLEMAN TE AYUDARÁ A HACER TRADES CON OTROS USUARIOS SIN PROBLEMA')
        .setColor('#FFD700')
        .addFields(
          { name: 'TEN ESTA INFORMACIÓN A MANO:', value: '• Usuario con quien tradearas\n• Información del trade\n• Rango del trade' }
        )
        .setTimestamp();

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('midleman_aceptar')
            .setLabel('ACEPTAR')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('midleman_rechazar')
            .setLabel('RECHAZAR')
            .setStyle(ButtonStyle.Danger)
        );

      await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true
      });
    }
  }
};