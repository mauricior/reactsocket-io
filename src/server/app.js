const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

const getApiAndEmit = async socket => {
  try {
    const res = await axios.get("https://api.darksky.net/forecast/800e4c451f1a06e837a14bb3b4fa7cc6/37.8267,-122.4233");
    socket.emit("FromAPI", res.data.currently.temperature); // Emiting a new message. It wil be consumed by the client
  } catch(error) {
    console.error(`Error: ${error.code}`);
  }
};

let interval;

io.on("connection", socket => {
  console.log("New client connected");
  setInterval(() => getApiAndEmit(socket), 10000);
  socket.on("disconnect", () => {
    console.log("Client disconnected")
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
