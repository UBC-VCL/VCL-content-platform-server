import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();
jest.setTimeout(70000);
beforeAll( (done)=> {
	const uri = process.env.ATLAS_URI;
	//Start MongoDB connection
	mongoose.connect(uri, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	}).then(() => {
		console.log('MongoDB database connection established successfully');
		done();
	}).catch((error) => {
		console.error('Error establishing MongoDB database connection:', error);
		done(error);
	});

});
afterAll((done)=>{
	mongoose.connection.close();
	done();
});

//mock hasAdminPermissions for the authController Test
jest.mock('../../../helpers/authHelper.js', () => {
	const originalModule = jest.requireActual('../../../helpers/authHelper.js');
	return {
		...originalModule,
		hasAdminPermissions: jest.fn().mockImplementation(()=> {
			return Promise.resolve(true);
		}), 
	};
}
);




import memberControllerTest from './memberControllerTest.js';
import authControllerTest from './authControllerTest.js';
import projectControllerTest from './projectControllerTest.js';
import snapshotControllerTest from './snapshotControllerTest.js';

memberControllerTest();
authControllerTest();
projectControllerTest();
snapshotControllerTest();