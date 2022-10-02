const { format, parseISO } = require("date-fns");
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 0, checkperiod: 0 });

const options = ["Rock", "Paper", "Scissors"];

const RESULT = {
  USER: "user",
  BOT: "bot",
  TIE: "tie",
};

const combinations = {
  rock: { beats: "scissors" },
  paper: { beats: "rock" },
  scissors: { beats: "paper" },
};

/** Gets a Random Option for Rock, Papers, Scissors
 * @returns {String} returns one of rock, paper, scissors
 */
const getRandomOption = () => {
  const randomIndex = Math.floor(Math.random() * 3);
  return options[randomIndex];
};

/** Check if User Won
 * @param  {String} user - option user selected
 * @param  {String} bot - option bot chose
 * @returns {Boolean} returns boolean value for users win
 */
const checkIfUserWon = (user, bot) => {
  switch (user) {
    case "rock":
      return bot === "scissor";
    case "paper":
      return bot === "rock";
    case "scissors":
      return bot === "paper";
  }
};
/** Check who won
 * @param  {String} user - option user selected
 * @param  {String} bot - option bot chose
 * @returns {'user'|'bot'|'tie'} returns string for winner's value
 */
const checkWhoWon = (user, bot) => {
  if (user === bot) return RESULT.TIE;
  if (combinations[user].beats === bot) return RESULT.USER;
  return RESULT.BOT;
};
/** Stores Match Result in Cache
 * @param  {String} userId - discord user's User ID
 * @param  {'won'|'lost'|'tie'} result - match result
 * @param  {String} timestamp - time when match was played
 * @param {'user'|'bot'|'tie'} user - user's choice
 * @param {'user'|'bot'|'tie'} bot - bot's choice
 */
const storeResult = (userId, result, timestamp, user, bot) => {
  const userExists = myCache.get(userId);
  const resultObject = {
    result,
    timestamp,
    user,
    bot,
  };
  if (userExists) {
    console.log("user found in cache");
    userExists.matches = [...userExists.matches, resultObject];
    myCache.set(userId, userExists);
    console.log("new result added in table");
  } else {
    console.log("user not found in cachec");
    const newUserObject = {
      userId,
      matches: [resultObject],
    };
    myCache.set(userId, newUserObject);
    console.log("new user and result added in table");
  }
};
/** Function to Play a match and generate result reply for bot response
 * Also Stores result in cache
 * @param  {String} userId - discord user id to store result
 * @param  {'Rock'|'Paper'Scissors'} userChoice
 * @returns {String} returns a reply string for bot response
 */
const playMatch = (userId, userChoice) => {
  const botChoice = getRandomOption();

  const matchResult = checkWhoWon(userChoice.toLowerCase(), botChoice.toLowerCase());

  const isUserWinner = matchResult === RESULT.USER;

  const winner = isUserWinner ? "You" : "I";

  const result = [RESULT.USER, RESULT.BOT].includes(matchResult) ? `${winner} won this match.` : "This match was a Tie";

  const remark = !isUserWinner
    ? "Oh no, Let's try another time. You might win the next match."
    : "I want a REMATCH!. *please*";

  const reply = `You Chose ${userChoice}. I chose ${botChoice}.\n${result}\n${remark}`;

  const score = isUserWinner ? "won" : matchResult === RESULT.TIE ? "tie" : "lost";

  storeResult(userId, score, new Date().toISOString(), userChoice, botChoice);
  return reply;
};

/** Function to generate scoreboard as reply for bot response
 * @param  {String} userId - discord user id to store result
 * @returns {String} returns a reply string for bot response
 */
const viewMatchHistory = (userId) => {
  const userExists = myCache.get(userId);
  if (!userExists) return "We haven't played before have we?\nHow about a match right now!";
  const { matches } = userExists;
  let scoreboard = `These are the results of our previous matches`;

  const score = {
    won: 0,
    lost: 0,
    tie: 0,
  };
  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];
    const result = match.result !== "tie" ? `You ${match.result}` : `Ended in a Tie`;
    scoreboard += `\n\n${i + 1}\nPlayed At ${format(
      parseISO(match.timestamp),
      "PPPPpp"
    )}\nResult: ${result}\nYou Chose ${match.user}. I chose ${match.bot}.\n\n`;
    score[match.result] += 1;
  }

  scoreboard += `\nYou Won **${score.won}** times.\nYou Lost **${score.lost}** times\nMatch was a Tie **${score.tie}** times\n`;

  scoreboard += `\nYou can still Keep Playing with me.\nLet's expand this list.`;

  return scoreboard;
};

module.exports = {
  getRandomOption,
  checkIfUserWon,
  RESULT,
  checkWhoWon,
  storeResult,
  playMatch,
  options,
  viewMatchHistory,
};
