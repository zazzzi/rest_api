const express = require("express");
const app = express();
const port = 6969;

app.use(express.static('./public'));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})