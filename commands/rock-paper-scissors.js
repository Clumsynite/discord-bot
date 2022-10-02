const { SlashCommandBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;

const { options, playMatch, viewMatchHistory } = require("../games/rock-paper-scissors");

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
          { name: "View Match History", value: "history" }
        )
    ),
  async execute(interaction) {
    const userChoice = interaction.options.getString("choice");
    const userId = interaction.user.id;

    console.log(`User chose "${userChoice}"`);

    if (options.includes(userChoice)) {
      const reply = playMatch(userId, userChoice);
      await interaction.reply({ content: reply, ephemeral: true });
    } else if (userChoice === "history") {
      const reply = viewMatchHistory(userId);
      await interaction.reply({ content: "Generating Match History...", ephemeral: true });
      await wait(2000);
      await interaction.editReply({ content: reply, ephemeral: true });
    } else {
      await interaction.reply("Choice not handled");
    }
  },
};
