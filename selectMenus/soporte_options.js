const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Ticket = require('../models/Ticket');

module.exports = {
  customId: 'soporte_options',
  async execute(interaction, client) {
    const selectedOption = interaction.values[0];

    if (selectedOption === 'trade_secure') {
      const midlemanChannel = await client.channels.fetch(process.env.MIDLEMAN_CHANNEL_ID);
      
      const embed = new EmbedBuilder()
        .setTitle('🔒 TRADE SECURE')
        .setDescription('SI QUIERES USAR EL APARTADO DE TRADE SECURE VE A ESTE CANAL')
        .setColor('#FFD700')
        .addFields({ name: 'Canal', value: `<#${midlemanChannel.id}>` })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    } else if (selectedOption === 'quiero_roles') {
      const rolesChannel = await client.channels.fetch(process.env.ROLES_CHANNEL_ID);
      
      const embed = new EmbedBuilder()
        .setTitle('👑 QUIERO ROLES')
        .setDescription('ESE ES EL NUEVO CANAL PARA OBTENER ROLES')
        .setColor('#FFD700')
        .addFields({ name: 'Canal', value: `<#${rolesChannel.id}>` })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    } else {
      // Create ticket for other options
      const guild = interaction.guild;
      const category = guild.channels.cache.find(c => c.name === 'soporte-tickets' && c.type === 4);
      
      const ticketNames = {
        'reportar_estafa': `estafa-${interaction.user.username}`,
        'reclamar_premio': `premio-${interaction.user.username}`,
        'alianzas': `alianza-${interaction.user.username}`,
        'otros': `soporte-${interaction.user.username}`
      };

      const ticketChannel = await guild.channels.create({
        name: ticketNames[selectedOption],
        type: 0,
        parent: category?.id,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: ['ViewChannel']
          },
          {
            id: interaction.user.id,
            allow: ['ViewChannel', 'ReadMessageHistory']
          },
          {
            id: client.user.id,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageChannels']
          }
        ]
      });

      // Save ticket to database
      const ticket = new Ticket({
        userId: interaction.user.id,
        username: interaction.user.username,
        type: 'SOPORTE',
        subType: selectedOption,
        channelId: ticketChannel.id,
        status: 'open'
      });
      await ticket.save();

      const titles = {
        'reportar_estafa': '⚠️ REPORTAR ESTAFA',
        'reclamar_premio': '🎁 RECLAMAR PREMIO',
        'alianzas': '🤝 ALIANZAS',
        'otros': '❓ OTROS'
      };

      const embed = new EmbedBuilder()
        .setTitle(titles[selectedOption])
        .setDescription(`Bienvenido ${interaction.user}, tu ticket ha sido creado.\n\n⏳ Por favor espera a que un miembro del staff reclame tu ticket.`)
        .setColor('#FFD700')
        .setFooter({ text: `Ticket ID: ${ticket._id}` })
        .setTimestamp();

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`support_claim_${ticket._id}`)
            .setLabel('RECLAMAR')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(`support_close_${ticket._id}`)
            .setLabel('CERRAR')
            .setStyle(ButtonStyle.Danger)
        );

      const message = await ticketChannel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [embed],
        components: [row]
      });

      ticket.messageId = message.id;
      await ticket.save();

      await interaction.reply({
        content: `✅ Tu ticket ha sido creado en ${ticketChannel}`,
        ephemeral: true
      });

      // If it's reclamar_premio, show modal for Roblox ID
      if (selectedOption === 'reclamar_premio') {
        const modal = new ModalBuilder()
          .setCustomId(`premio_roblox_id_${ticket._id}`)
          .setTitle('ID de Roblox');

        const robloxIdInput = new TextInputBuilder()
          .setCustomId('roblox_id')
          .setLabel('Ingresa tu ID de Roblox')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setPlaceholder('Ejemplo: 123456789');

        const firstActionRow = new ActionRowBuilder().addComponents(robloxIdInput);
        modal.addComponents(firstActionRow);

        await interaction.user.send({ modal: modal }).catch(() => {});
      }
    }
  }
};