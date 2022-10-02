const { SlashCommandBuilder } = require("discord.js");

const { getRandomOption, checkWhoWon, RESULT, storeResult } = require("../games/rock-paper-scissors");

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
          { name: "Scissors", value: "Scissors" }
        )
    ),
  async execute(interaction) {
    const userChoice = interaction.options.getString("choice");
    const botChoice = getRandomOption();

    const matchResult = checkWhoWon(userChoice.toLowerCase(), botChoice.toLowerCase());

    const isUserWinner = matchResult === RESULT.USER;

    const winner = isUserWinner ? "You" : "I";

    const result = [RESULT.USER, RESULT.BOT].includes(matchResult)
      ? `${winner} won this match.`
      : "This match was a Tie";

    const remark = !isUserWinner
      ? "Oh no, Let's try another time. You might win the next match."
      : "I want a REMATCH!. *please*";

    const reply = `You Chose ${userChoice}. I chose ${botChoice}.\n${result}\n${remark}`;

    const userId = interaction.user.id;

    const score = isUserWinner ? "won" : matchResult === RESULT.TIE ? "tie" : "lost";

    storeResult(userId, score, new Date().toISOString());

    await interaction.reply(reply);
  },
};
