const express = require("express");
const mongoose = require("mongoose");
const { app, server } = require("./socket/socket.js");

require("dotenv").config();
const routes = require("./routes");

const admin = require('firebase-admin');

const serviceAccount = require('./xchat-f9259-firebase-adminsdk-l6e1s-1b81cf4cd0.json'); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(express.json());

app.use("/api", routes);
app.use("/api/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
