const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("rock-paper-scissors").setDescription("Starts a match of Rock Paper Scissors!"),
  async execute(interaction) {
    await interaction.reply(`Starting Rock Paper Scissors`);
  },
};
