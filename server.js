const express = require("express");
const app = express();
const uniqId = require("uniqid");
const port = 6969;

//fs
const fs = require("fs");
const data = fs.readFileSync("data.json");
const characters = JSON.parse(data);

let starTrekChars = characters;

app.use(express.json());
app.use(express.static("./public"));

//send placeholder array
app.get("/api/characters", (req, res) => {
  res.send(starTrekChars);
});

//post new object
app.post("/api/characters", (req, res) => {
  const incomingObject = req.body;
  incomingObject.id = uniqId.time();

  starTrekChars.push(incomingObject);
  const dataToWrite = JSON.stringify(starTrekChars, null, 2);
  fs.writeFile("data.json", dataToWrite, () => console.log("Written to DB"));

  res.status(201).json(incomingObject);
});

//update existing character
app.put("/api/characters/:id", (req, res) => {
  const indexOfChar = starTrekChars.findIndex((c) => c.id === req.params.id);
  console.log(indexOfChar);

  starTrekChars[indexOfChar].name = req.body.name;
  starTrekChars[indexOfChar].rank = req.body.rank;
  starTrekChars[indexOfChar].img = req.body.img;
});

//delete character from ID
app.delete("/api/characters/:id", (req, res) => {
  console.log(req.params.id);
  starTrekChars = starTrekChars.filter(({ id }) => id !== req.params.id);
});

// Get character from ID
app.get("/api/characters/:id", (req, res) => {
  const character = starTrekChars.find((c) => c.id === req.params.id);
  !character
    ? res.status(404).send("Sorry, this person doenst exist")
    : res.send(character);
});

//server listener
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
