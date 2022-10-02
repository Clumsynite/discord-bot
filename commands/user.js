const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("user").setDescription("Replies with User Information!"),
  async execute(interaction) {
    await interaction.reply(`User info. ${JSON.stringify(interaction.user, null, 2)}`);
  },
};
