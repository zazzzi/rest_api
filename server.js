const express = require("express");
const app = express();
const uniqId = require("uniqid");
const port = 6969;

let starTrekChars = [
  {
    name: "Jean-Luc Picard",
    rank: "Captain",
    img: "placeholder.jpg",
    id: `${uniqId.time()}`,
  },
];

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
  console.log(incomingObject);
  starTrekChars.push(incomingObject);
  res.status(201).json(incomingObject);
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
