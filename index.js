const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Importing Routes
const authRoute = require("./routes/auth");

const app = express();

app.use(bodyparser.json());

let urlencodeParser = bodyparser.urlencoded({ extended: false });

app.use(cors());
app.use('/user', urlencodeParser)
app.use("/user", authRoute);

app.post("/", urlencodeParser, (req, res) => {
  res.send("Sad");
});

// mongoose
//   .connect(
//     "mongodb+srv://manager:nXC6Tk42KKnCdTTx@cluster0-cimnw.mongodb.net/taskmanager?retryWrites=true&w=majority",
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     () => {
//       console.log("Connected to DB!");
//     }
//   )
//   .catch(err => console.log(err));

mongoose.connect(
  "mongodb://127.0.0.1:27017/taskmanager",
  { useNewUrlParser: true, useUnifiedTopology: true },
  console.log("connected")
);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Connected to Port ${PORT}`);
});
