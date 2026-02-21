const Ticket = require('../models/Ticket');

module.exports = (client) => {
  client.on('messageCreate', async (message) => {
    // Ignore bot messages
    if (message.author.bot) return;

    // Check if message is in a helper application ticket
    const ticket = await Ticket.findOne({
      channelId: message.channel.id,
      type: 'HELPER_APPLICATION',
      status: 'open'
    });

    if (ticket && ticket.data && ticket.data.questions) {
      // Only accept messages from the ticket creator
      if (message.author.id !== ticket.userId) return;

      const { questions, currentQuestion, answers } = ticket.data;

      // Save the answer
      answers.push(message.content);
      ticket.data.answers = answers;
      ticket.data.currentQuestion = currentQuestion + 1;

      // Check if all questions have been answered
      if (currentQuestion + 1 >= questions.length) {
        // Generate final embed with all answers
        const embed = new EmbedBuilder()
          .setTitle('📋 Resumen de Entrevista - Helper')
          .setColor('#FFD700')
          .addFields({ name: '👤 Candidato', value: `<@${ticket.userId}>` });

        questions.forEach((question, index) => {
          embed.addFields({
            name: `Pregunta ${index + 1}`,
            value: `**${question}**\n\n${answers[index]}`
          });
        });

        embed.setTimestamp();

        const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`helper_accept_${ticket._id}`)
              .setLabel('✅ Aceptar')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId(`helper_reject_${ticket._id}`)
              .setLabel('❌ Rechazar')
              .setStyle(ButtonStyle.Danger)
          );

        await message.channel.send({
          content: '<@&admin> <@&owner>',
          embeds: [embed],
          components: [row]
        });

        ticket.status = 'pending_review';
        await ticket.save();
      } else {
        // Ask next question
        await message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle('📋 Entrevista para Helper')
              .setDescription(`**Pregunta ${currentQuestion + 2}/${questions.length}:**\n\n${questions[currentQuestion + 1]}`)
              .setColor('#FFD700')
              .setTimestamp()
          ]
        });

        await ticket.save();
      }
    }
  });
};