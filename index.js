import dotenv from "dotenv"; // .env for environment variables
import express from "express"; // Express web server framework
import cors from "cors"; // Allows for Cross Origin Resource Sharing
import path from "path"; // Useful for path manipulation
import mongoose from "mongoose"; //Mongoose is a MongoDB library
import router from "./router.js";
import https from "https";
import fs from "fs";
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});



app.use("/", router);

const port = process.env.PORT || 5000;

// Create an HTTPS server
const httpsServer = https.createServer({
  key: fs.readFileSync("key.pem",'utf8' ),
  cert: fs.readFileSync("cert.pem", 'utf8')
}, app);

httpsServer.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});