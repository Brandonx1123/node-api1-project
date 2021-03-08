// BUILD YOUR SERVER HERE
const express = require("express");
const User = require("./users/model");
const server = express();
server.use(express.json());

server.get("/api/users", (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then((users) => {
      console.log("getting this -->", users);
      if (!users) {
        res
          .status(404)
          .json({ message: `user with id${id} does not exist in db` });
      } else {
        res.json(users);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

server.post("/api/users", (req, res) => {
  const newUser = req.body;
  if (!newUser.name || !newUser.bio) {
    res.status(422).json({ message: "name and bio are required for post" });
  } else {
    User.insert(newUser)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  }
});

server.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  try {
    if (!changes.name || !changes.bio) {
      res.status(422).json({ message: "name and weight are require for PUT!" });
    } else {
      const updatedUser = await User.update(id, changes);
      if (!updatedUser) {
        res.status(404).json({
          message: "that user doesnt exist in database, find correct one!",
        });
      } else {
        res.json(updatedUser);
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

server.delete("/api/users/:id", async (req, res) => {
  try {
    const deleted = await User.remove(req.params.id);
    if (!deleted) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist" });
    } else {
      res.json(deleted);
    }
  } catch (err) {
    res.status(500).json("The user could not be removed");
  }
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
