// const myCache = require("./../utils/cache");
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
 */
const storeResult = (userId, result, timestamp) => {
  const userExists = myCache.get(userId);
  if (userExists) {
    console.log("user found in cache");
    userExists.matches = [...userExists.matches, { result, timestamp }];
    myCache.set(userId, userExists);
    console.log("new result added in table");
  } else {
    console.log("user not found in cachec");
    const newUserObject = {
      userId,
      matches: [{ result, timestamp }],
    };
    myCache.set(userId, newUserObject);
    console.log("new user and result added in table");
  }
};

module.exports = {
  getRandomOption,
  checkIfUserWon,
  RESULT,
  checkWhoWon,
  storeResult,
};
