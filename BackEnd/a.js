const express = require("express");

const app = express();
app.use(express.json());
const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server port: ", PORT);
});

app.get("/status", (req, res) => {
  const status = {
    Status: "Rugd",
  };

  res.send(status);
});
