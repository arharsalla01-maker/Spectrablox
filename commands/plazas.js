const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('plazas')
    .setDescription('Gestiona las plazas disponibles para Helper')
    .addSubcommand(subcommand =>
      subcommand
        .setName('añadir')
        .setDescription('Añade plazas para Helper')
        .addIntegerOption(option =>
          option.setName('cantidad')
            .setDescription('Cantidad de plazas a añadir')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('quitar')
        .setDescription('Quita plazas para Helper')
        .addIntegerOption(option =>
          option.setName('cantidad')
            .setDescription('Cantidad de plazas a quitar')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('ver')
        .setDescription('Ver las plazas disponibles para Helper')
    ),

  async execute(interaction, client) {
    // Check if user has permission
    const member = interaction.member;
    const hasPermission = member.roles.cache.has(process.env.ADMIN_ROLE_ID) || 
                         member.roles.cache.has(process.env.OWNER_ROLE_ID);

    if (!hasPermission) {
      return interaction.reply({ 
        content: '❌ Solo admins y owners pueden gestionar las plazas.', 
        ephemeral: true 
      });
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'añadir') {
      const cantidad = interaction.options.getInteger('cantidad');
      client.helperSpots = (client.helperSpots || 0) + cantidad;

      const embed = new EmbedBuilder()
        .setTitle('✅ Plazas Añadidas')
        .setDescription(`Se han añadido ${cantidad} plazas para Helper.\n\nTotal de plazas disponibles: ${client.helperSpots}`)
        .setColor('#00FF00')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'quitar') {
      const cantidad = interaction.options.getInteger('cantidad');
      client.helperSpots = Math.max(0, (client.helperSpots || 0) - cantidad);

      const embed = new EmbedBuilder()
        .setTitle('✅ Plazas Quitadas')
        .setDescription(`Se han quitado ${cantidad} plazas para Helper.\n\nTotal de plazas disponibles: ${client.helperSpots}`)
        .setColor('#00FF00')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'ver') {
      const embed = new EmbedBuilder()
        .setTitle('📊 Plazas Disponibles')
        .setDescription(`Total de plazas disponibles para Helper: ${client.helperSpots || 0}`)
        .setColor('#FFD700')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }
  }
};