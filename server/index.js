const express = require("express");
const cors = require("cors")

const PORT = process.env.PORT || 3001

const app = express();
app.use(cors());

let games = [];
let lastFreeIndex = 0;

let knownPlayers = {};

app.listen(PORT, () => {
console.log(`Server is listening on port ${PORT}`)
});

app.post("/join", (req, res) => {
  const playerId = req.query.userId;
  const gameId = req.query.gameId;
  let joined;
  if (games[gameId].status === 'lobby') {
    knownPlayers[playerId].gameId = gameId;
    knownPlayers[playerId].gameUserId = games[gameId].players;
    games[gameId].players ++;
    joined = true;
  }
  if (games[gameId].players === 4) {
    games[gameId].status = 'full-lobby';
  }
  let response = games[gameId]
  Object.assign(response, {joined: joined})
  res.json(
    response,
  )
});

app.post("/player", (req, res) => {
  const id = req.query.userId;
  let response = {};
  if (knownPlayers[id] !== null && knownPlayers[id] !== undefined) {
    if (games[knownPlayers[id].gameId] != null) {
      response = games[knownPlayers[id].gameId];
    }
  }
  else {
    knownPlayers[id] = {
      gameId: null,
      userId: id,
      gameUserId: null,
    }
  }
  Object.assign(response, {joined: knownPlayers[id].gameId != null})
  res.json(
    response,
  )
});

app.get("/game", (req, res) => {
  let foundGame = null;
  for (let i = 0; i < games.length; i ++) {
    if (games[i].status === 'lobby') {
      foundGame = games[i];
    }
  }
  if (foundGame !== null) {
    res.json(foundGame);
  }
  else {
    games[lastFreeIndex] = {
      id: lastFreeIndex,
      status: 'lobby',
      players: 0,
      maxPlayers: 4,
    }
    res.json(games[lastFreeIndex]);
    lastFreeIndex++;
  }
});
