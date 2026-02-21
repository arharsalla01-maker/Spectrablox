const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const Ticket = require('../models/Ticket');

module.exports = {
  customId: /^midleman_app_give_role_(.+)$/,
  async execute(interaction, client) {
    const ticketId = interaction.customId.split('_')[4];
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return interaction.reply({ content: '❌ Ticket no encontrado', ephemeral: true });
    }

    // Check if user has permission
    const member = interaction.member;
    const hasPermission = member.roles.cache.has(process.env.ADMIN_ROLE_ID) || 
                         member.roles.cache.has(process.env.OWNER_ROLE_ID);

    if (!hasPermission) {
      return interaction.reply({ 
        content: '❌ Solo admins y owners pueden dar el rol de Midleman.', 
        ephemeral: true 
      });
    }

    // Show select menu for midleman rank
    const selectMenu = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`midleman_select_rank_${ticketId}`)
          .setPlaceholder('Selecciona el rango de Midleman')
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel('MM BAJO')
              .setValue('mm_bajo')
              .setDescription('Midleman de rango bajo')
              .setEmoji('🟢'),
            new StringSelectMenuOptionBuilder()
              .setLabel('MM MEDIO')
              .setValue('mm_medio')
              .setDescription('Midleman de rango medio')
              .setEmoji('🟡'),
            new StringSelectMenuOptionBuilder()
              .setLabel('MM ALTO')
              .setValue('mm_alto')
              .setDescription('Midleman de rango alto')
              .setEmoji('🔴')
          )
      );

    await interaction.reply({
      content: 'Selecciona el rango de Midleman que deseas dar:',
      components: [selectMenu],
      ephemeral: true
    });
  }
};