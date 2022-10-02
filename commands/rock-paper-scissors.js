const { SlashCommandBuilder } = require("discord.js");

const { options, playMatch } = require("../games/rock-paper-scissors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rock-paper-scissors")
    .setDescription("Starts a match of Rock Paper Scissors!")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("What do you want, Rock, Paper or Scissors?")
        .setRequired(true)
        .addChoices(
          { name: "Rock", value: "Rock" },
          { name: "Paper", value: "Paper" },
          { name: "Scissors", value: "Scissors" },
          { name: "View Match History", value: "score" }
        )
    ),
  async execute(interaction) {
    const userChoice = interaction.options.getString("choice");

    if (options.includes(userChoice)) {
      const reply = playMatch(userChoice);
      await interaction.reply(reply);
    }
  },
};
