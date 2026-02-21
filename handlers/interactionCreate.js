module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(`Error executing ${interaction.commandName}:`, error);
        const errorReply = {
          content: '❌ Hubo un error al ejecutar este comando.',
          ephemeral: true
        };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorReply);
        } else {
          await interaction.reply(errorReply);
        }
      }
    }

    if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      if (!button) return;

      try {
        await button.execute(interaction, client);
      } catch (error) {
        console.error(`Error executing button ${interaction.customId}:`, error);
        const errorReply = {
          content: '❌ Hubo un error al ejecutar esta acción.',
          ephemeral: true
        };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorReply);
        } else {
          await interaction.reply(errorReply);
        }
      }
    }

    if (interaction.isModalSubmit()) {
      const modal = client.modals.get(interaction.customId);
      if (!modal) return;

      try {
        await modal.execute(interaction, client);
      } catch (error) {
        console.error(`Error executing modal ${interaction.customId}:`, error);
        const errorReply = {
          content: '❌ Hubo un error al procesar tu respuesta.',
          ephemeral: true
        };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorReply);
        } else {
          await interaction.reply(errorReply);
        }
      }
    }

    if (interaction.isStringSelectMenu()) {
      const selectMenu = client.selectMenus.get(interaction.customId);
      if (!selectMenu) return;

      try {
        await selectMenu.execute(interaction, client);
      } catch (error) {
        console.error(`Error executing select menu ${interaction.customId}:`, error);
        const errorReply = {
          content: '❌ Hubo un error al ejecutar esta acción.',
          ephemeral: true
        };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorReply);
        } else {
          await interaction.reply(errorReply);
        }
      }
    }
  });
};