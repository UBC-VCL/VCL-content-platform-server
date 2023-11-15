import dotenv from 'dotenv'; // .env for environment variables
import express from 'express'; // Express web server framework
import cors from 'cors'; // Allows for Cross Origin Resource Sharing
import mongoose from 'mongoose'; //Mongoose is a MongoDB library
import router from './router.js';
import https from 'https';
import fs from 'fs';

const app = express();

dotenv.config();
app.use(express.json());

const uri = process.env.ATLAS_URI;
const IS_WIP = process.env.IS_WIP === 'production';

mongoose.connect(uri, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
	console.log('MongoDB database connection established successfully');
});

// Create an HTTPS server
// const httpsServer = https.createServer({
// 	key: fs.readFileSync('key.pem','utf8' ),
// 	cert: fs.readFileSync('fullchain.pem', 'utf8')
// }, app);
// httpsServer.listen(port, () => {
// 	console.log(`App listening on port: ${port}`);
// });


if (IS_WIP) {
	const corsOptions = {
		origin: 'https://www.vcl.psych.ubc.ca',
	  };
	app.use(cors(corsOptions));

	app.use('/', router);
	const port = process.env.PORT || 4000;

	const httpsServer = https.createServer({
		key: fs.readFileSync('key.pem', 'utf8'),
		cert: fs.readFileSync('fullchain.pem', 'utf8')
	}, app);
	httpsServer.listen(port, () => {
		console.log(`App listening on port: ${port}`);
	});
} else {
	app.use(cors());
	app.use('/', router);
	const port = process.env.PORT || 4000;

	app.listen(port, () => {
		console.log(`App listening on port: ${port}`);
	});
}
