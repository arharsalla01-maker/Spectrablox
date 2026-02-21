const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Ticket = require('../models/Ticket');

module.exports = {
  customId: 'roles_options',
  async execute(interaction, client) {
    const selectedOption = interaction.values[0];

    if (selectedOption === 'real') {
      const embed = new EmbedBuilder()
        .setTitle('💎 ROL REAL')
        .setDescription('El rol REAL se gana iniciando sesión con Discord en la página web oficial de SPECTRABLOX.\n\nUna vez que se detecte que has iniciado sesión, se te otorgará el rol automáticamente.')
        .setColor('#FFD700')
        .addFields({ 
          name: '🌐 Página Web', 
          value: 'Ve a la página web oficial e inicia sesión con Discord' 
        })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    } else if (selectedOption === 'helper') {
      // Check if there are available spots
      const helperSpots = interaction.client.helperSpots || 0;
      
      if (helperSpots <= 0) {
        const embed = new EmbedBuilder()
          .setTitle('❌ NO HAY PLAZAS DISPONIBLES')
          .setDescription('Lo sentimos, actualmente no hay plazas disponibles para el rol de Helper.\n\nVuelve a intentarlo más tarde.')
          .setColor('#FF0000')
          .setTimestamp();

        return interaction.reply({
          embeds: [embed],
          ephemeral: true
        });
      }

      // Create ticket for helper application
      const guild = interaction.guild;
      const category = guild.channels.cache.find(c => c.name === 'helper-applications' && c.type === 4);
      
      const ticketChannel = await guild.channels.create({
        name: `helper-${interaction.user.username}`,
        type: 0,
        parent: category?.id,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: ['ViewChannel']
          },
          {
            id: interaction.user.id,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
          },
          {
            id: process.env.ADMIN_ROLE_ID,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
          },
          {
            id: process.env.OWNER_ROLE_ID,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
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
        type: 'HELPER_APPLICATION',
        channelId: ticketChannel.id,
        status: 'open'
      });
      await ticket.save();

      await interaction.reply({
        content: `✅ Tu solicitud de Helper ha sido creada en ${ticketChannel}. Responde las preguntas que te haré a continuación.`,
        ephemeral: true
      });

      // Start interview with questions
      const questions = [
        '¿TIENES EXPERIENCIA SIENDO HELPER EN OTRO SERVIDOR? SI ES ASÍ, EN CUÁL',
        '¿CUÁNTOS AÑOS TIENES?',
        '¿DÓNDE TE RESIDES?',
        '¿QUÉ HARÍAS SI 2 USUARIOS SE ESTÁN PELEANDO EN UN CHAT GENERAL?',
        '¿Estás abierto a recibir críticas constructivas y sugerencias de mejora por parte de la Administración?',
        '¿ESTARÁS EN LAS BUENAS Y EN LAS MALAS?',
        '¿TE HAS LEÍDO LAS #normas?'
      ];

      // Store questions in ticket data
      ticket.data = { questions, currentQuestion: 0, answers: [] };
      await ticket.save();

      // Ask first question
      await ticketChannel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [
          new EmbedBuilder()
            .setTitle('📋 Entrevista para Helper')
            .setDescription(`**Pregunta 1/${questions.length}:**\n\n${questions[0]}`)
            .setColor('#FFD700')
            .setTimestamp()
        ]
      });
    } else if (selectedOption === 'midleman') {
      // Create ticket for midleman application
      const guild = interaction.guild;
      const category = guild.channels.cache.find(c => c.name === 'midleman-applications' && c.type === 4);
      
      const ticketChannel = await guild.channels.create({
        name: `midleman-app-${interaction.user.username}`,
        type: 0,
        parent: category?.id,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: ['ViewChannel']
          },
          {
            id: interaction.user.id,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
          },
          {
            id: process.env.ADMIN_ROLE_ID,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
          },
          {
            id: process.env.OWNER_ROLE_ID,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
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
        type: 'MIDLEMAN_APPLICATION',
        channelId: ticketChannel.id,
        status: 'open'
      });
      await ticket.save();

      const embed = new EmbedBuilder()
        .title('🤝 Solicitud de Midleman')
        .setDescription('Para obtener el rol de Midleman, debes dejar una fianza.\n\n**Opciones de fianza:**\n\n• **Brainrot + Rangos 20-50** → MM BAJO\n• **Brainrot + Rangos 50-100** → MM MEDIO\n• **Brainrot + Rangos +150** → MM ALTO\n\nPor favor espera a que un admin o owner recoja tu fianza.')
        .setColor('#FFD700')
        .setTimestamp();

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`midleman_app_claim_${ticket._id}`)
            .setLabel('RECLAMAR')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(`midleman_app_cancel_${ticket._id}`)
            .setLabel('CANCELAR')
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
        content: `✅ Tu solicitud de Midleman ha sido creada en ${ticketChannel}`,
        ephemeral: true
      });
    }
  }
};