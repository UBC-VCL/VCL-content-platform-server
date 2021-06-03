require("dotenv").config(); // .env for environment variables
const express = require("express"); // Express web server framework
const cors = require("cors"); // Allows for Cross Origin Resource Sharing
const path = require("path"); // Useful for path manipulation
const mongoose = require("mongoose"); //Mongoose is a MongoDB library
const router = require("./router.js");

let app = express();

//Use CORS and allow JSON requests/responses
app.use(cors());
app.use(express.json());

//Serve client build files on root url (required for heroku deployment)
app.use(express.static(path.join(__dirname, "/../client/build")));

//Get uri from environment variables
const uri = process.env.ATLAS_URI;

//Start MongoDB connection
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

//Make the the root url the base of the routes for the backend
app.use("/", router);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
