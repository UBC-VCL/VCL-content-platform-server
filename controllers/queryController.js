
import User from '../models/user.model.js';
import Member from '../models/member.model.js';
import Project from '../models/project.model.js';
import Snapshot from '../models/snapshot.model.js';
/**
 * 
 * @param Expected request body:
          {
            collection: string
            conditions: ArrayofJson
          }
 *
 * @param Responds with created object.
 */
export const postQuery = async (req, res) => {
    
	const {collection, conditions} = req.body;
	if (!collection) {
		res.status(400).json({
			message: 'The database to query on is missing!'
		});
	}
	console.log(conditions);
	switch (collection) {
	case 'user':
		User
			.aggregate(conditions)
			.exec()
			.then((data)=>{
				res.status(200).json({
					message: 'Successfully executed the query.',
					data
				});
			}).catch((err)=> {
				res.status(400).json({
					message: 'Error executing the query',
					error: err
				})
			});
		break;
	case 'member':
		Member
			.aggregate(conditions)
			.exec()
			.then((data)=>{
				res.status(200).json({
					message: 'Successfully executed the query.',
					data
				});
			}).catch((err)=> {
				res.status(400).json({
					message: 'Error executing the query',
					error: err
				})
			});
		break;
	case 'project':
		Project
			.aggregate(conditions)
			.exec()
			.then((data)=>{
				res.status(200).json({
					message: 'Successfully executed the query.',
					data
				});
			}).catch((err)=> {
				res.status(400).json({
					message: 'Error executing the query',
					error: err
				})
			});
		break;
	case 'snapshot':
		Snapshot
			.aggregate(conditions)
			.exec()
			.then((data)=>{
				res.status(200).json({
					message: 'Successfully executed the query.',
					data
				});
			}).catch((err)=> {
				res.status(400).json({
					message: 'Error executing the query',
					error: err
				})
			});
		break;
	default:
		res.status(400).json({
			message: 'The collection does not exist in the database.'
		});
        
	}

};
