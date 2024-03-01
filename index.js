const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const routes = require("./routes");
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
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
