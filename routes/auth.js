const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Verify Token
function verifyToken(_req, _res, next) {
  // GET auth header value
  const bearerHeader = _req.headers["authorization"];

  // Check if bearer is undefined
  if (typeof bearerHeader != "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");

    // Get token from array
    const bearerToken = bearer[1];

    // Set the token
    _req.token = bearerToken;

    // Call next middleware
    next();
  } else {
    //Forbidden
    _res.sendStatus(403);
  }
}

router.post("/signup", (_req, _res) => {
  const username = _req.body.username;
  const password = _req.body.password;
  const email = _req.body.email;
  const newUser = new User();

  User.findOne({ username: username }, (err, user) => {
    console.log(user);
    if (user == null) {
      bcrypt.hash(password, 10, function(err, hash) {
        if (err) {
          console.log(err);
          return _res.sendStatus(500);
        }
        newUser.password = hash;
        newUser.username = username;
        newUser.email = email;

        newUser.save((err, savedUser) => {
          if (err) {
            console.log(err);
            _res.sendStatus(500);
          } else {
            _res.json(savedUser);
          }
        });
      });
    } else {
      _res.json({ message: "username already taken" });
    }
  });
  _res.redirect("https://localhost:5500/frontend/");
});

router.post("/signin", (_req, _res) => {
  const username = _req.body.username;
  const password = _req.body.password;

  User.findOne({ username: username }, { _id: 0, __v: 0 }, (err, user) => {
    if (err) {
      console.log(err);
      return _res.statusCode(500);
    }
    if (user != null) {
      bcrypt.compare(password, user.password, function(err, result) {
        if (err) {
          console.log(err);
          return _res.statusCode(500);
        }
        if (result) {
          jwt.sign({ user }, "abc", { expiresIn: "3 days" }, (err, token) => {
            _res.status(200).json({ user, token });
          });
        } else {
          _res.json({
            message: "incorrect password"
          });
        }
      });
    } else {
      return _res.json({
        message: "user not found"
      });
    }
  });
});

router.post("/auth", verifyToken, (_req, _res) => {
  jwt.verify(_req.token, "abc", (err, authData) => {
    if (err) {
      _res.sendStatus(403);
    } else {
      _res.json({ authData });
    }
  });
});

module.exports = router;
