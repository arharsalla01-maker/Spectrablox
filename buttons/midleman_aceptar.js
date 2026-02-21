const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
  customId: 'midleman_aceptar',
  async execute(interaction, client) {
    // Get all members of the server
    const members = await interaction.guild.members.fetch();
    
    // Create select menu with users
    const selectMenu = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('midleman_select_user')
          .setPlaceholder('Selecciona con quién vas a tradear')
          .setMaxValues(1)
      );

    // Add first 25 users (Discord limit)
    let userCount = 0;
    for (const [id, member] of members) {
      if (userCount >= 25) break;
      if (!member.user.bot) {
        selectMenu.components[0].addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel(member.user.username)
            .setValue(member.user.id)
            .setDescription(`ID: ${member.user.id}`)
        );
        userCount++;
      }
    }

    await interaction.update({
      content: 'Selecciona el usuario con quien vas a tradear:',
      components: [selectMenu]
    });
  }
};