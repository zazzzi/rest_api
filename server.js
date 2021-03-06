const express = require("express");
const app = express();
const uniqId = require("uniqid");
const fs = require("fs");
const port = 6969;

app.use(express.json());
app.use(express.static("./public"));

//get all characters
app.get("/api/characters", (req, res) => {
  const data = fs.readFileSync("data.json");
  const characters = JSON.parse(data);

  res.status(200).send(characters);
  console.log("Characters received from DB");
});

//post new object
app.post("/api/characters", (req, res) => {
  let incomingObject = req.body;
  const data = fs.readFileSync("data.json");
  const characters = JSON.parse(data);

  const filteredCharacters = characters.find(
    (c) => c.name.toLowerCase() === incomingObject.name.toLowerCase()
  );
  if (filteredCharacters) {
    res.status(409).json("Character already exists");
  } else {
    incomingObject.name = incomingObject.name.trim();
    incomingObject.id = uniqId.time();
    characters.push(incomingObject);
    const dataToWrite = JSON.stringify(characters, null, 2);
    fs.writeFile("data.json", dataToWrite, () => console.log("Written to DB"));

    res.status(201).json(incomingObject);
  }
});

//update existing character
app.put("/api/characters/:id", (req, res) => {
  const data = fs.readFileSync("data.json");
  const characters = JSON.parse(data);
  const indexOfChar = characters.findIndex((c) => c.id === req.params.id);
  console.log(indexOfChar);
  const updatedCharacter = req.body;

  if (indexOfChar !== -1) {
    characters[indexOfChar].name = updatedCharacter.name;
    characters[indexOfChar].rank = updatedCharacter.rank;
    characters[indexOfChar].img = updatedCharacter.img;
    fs.writeFile("data.json", JSON.stringify(characters, null, 2), () =>
      console.log("Updated character in DB")
    );

    res.status(200).json("Character updated.");
  } else {
    res.status(404).json("A character with that ID doesn't exist.")
  }
});

//delete character from ID
app.delete("/api/characters/:id", (req, res) => {
  const data = fs.readFileSync("data.json");
  let characters = JSON.parse(data);

  characters = characters.filter(({ id }) => id !== req.params.id);
  console.log(characters);
  fs.writeFile("data.json", JSON.stringify(characters, null, 2), () =>
    console.log("Deleted character from DB")
  );
  res.status(200).json("Character deleted from DB.");
});

// get specific character
app.get("/api/filtered-characters/:value", (req, res) => {
  const data = fs.readFileSync("data.json");
  const characters = JSON.parse(data);
  const incomingSearch = req.params.value;
  incomingSearch.replace(/&/, " ");

  const filteredCharacters = characters.find(
    (c) => c.name.toLowerCase() === incomingSearch.toLowerCase()
  );
  !filteredCharacters
    ? res.send("This character doesn't exist")
    : (res.status(200).send(filteredCharacters),
      console.log("Search completed"));
});

//server listener
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
