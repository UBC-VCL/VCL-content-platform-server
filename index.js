import dotenv from 'dotenv'; // .env for environment variables
import express from 'express'; // Express web server framework
import cors from 'cors'; // Allows for Cross Origin Resource Sharing
import mongoose from 'mongoose'; //Mongoose is a MongoDB library
import router from './router.js';

let app = express();

dotenv.config();

//Use CORS and allow JSON requests/responses
app.use(cors());
app.use(express.json());

//Get uri from environment variables
const uri = process.env.ATLAS_URI;

//Start MongoDB connection
mongoose.connect(uri, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
	console.log('MongoDB database connection established successfully');
});

//Make the the root url the base of the routes for the backend
app.use('/', router);

const port = process.env.PORT || 4000;

app.listen(port, () => {
	console.log(`App listening on port: ${port}`);
});