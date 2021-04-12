const express = require("express");
const app = express();
const uniqId = require("uniqid");
const port = 6969;

//fs
const fs = require("fs");

app.use(express.json());
app.use(express.static("./public"));

//get all characters
app.get("/api/characters", (req, res) => {
  const data = fs.readFileSync("data.json");
  const characters = JSON.parse(data);

  res.send(characters);
});

//post new object
app.post("/api/characters", (req, res) => {
  const incomingObject = req.body;
  incomingObject.id = uniqId.time();
  const data = fs.readFileSync("data.json");
  const characters = JSON.parse(data);

  characters.push(incomingObject);
  const dataToWrite = JSON.stringify(characters, null, 2);
  fs.writeFile("data.json", dataToWrite, () => console.log("Written to DB"));

  res.status(201).json(incomingObject);
});

//update existing character
app.put("/api/characters/:id", (req, res) => {
  const data = fs.readFileSync("data.json");
  const characters = JSON.parse(data);
  const indexOfChar = characters.findIndex((c) => c.id === req.params.id);
  console.log(indexOfChar);

  const updatedCharacter = req.body;
  characters[indexOfChar].name = updatedCharacter.name;
  characters[indexOfChar].rank = updatedCharacter.rank;
  characters[indexOfChar].img = updatedCharacter.img;
  fs.writeFile("data.json", JSON.stringify(characters, null, 2), () =>
    console.log("Written to DB")
  );

  res.status(200);
});

//delete character from ID
app.delete("/api/characters/:id", (req, res) => {
  const data = fs.readFileSync("data.json");
  let characters = JSON.parse(data);
  console.log(req.params.id);
  characters = characters.filter(({ id }) => id !== req.params.id);
  fs.writeFile("data.json", JSON.stringify(characters, null, 2), () =>
    console.log("Written to DB")
  );
});

// Get character from ID
app.get("/api/characters/:id", (req, res) => {
  const data = fs.readFileSync("data.json");
  const characters = JSON.parse(data);
  const character = characters.find((c) => c.id === req.params.id);
  !character
    ? res.status(404).send("Sorry, this person doenst exist")
    : res.send(character);
});

//server listener
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
