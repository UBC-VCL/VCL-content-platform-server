import SNAPSHOT_ERR from '../errors/snapshotErrors.js';
import { hasFrontendAPIKey } from '../helpers/authHelper.js';
import Snapshot from '../models/snapshot.model.js';
import User from '../models/user.model.js';

/**
 * 
 * @param Expected request body:
		  {
			author: ObjectId,
			title: String,
			project: String,
			date: String,
			categories: Array<String>,
			description: Array<String>,
			hyperlinks: Array<String>,
			contributors: Array<ObjectId>
		  }
   @param Expected HEADERS:
		  {
			authorization: string
		  }
 *
 * @param Responds with created object.
 */
export const createSnapshot = async (req, res) => {
	try {
		const isMember = await hasFrontendAPIKey(req.headers.authorization);

		if (!isMember) {
			res.status(400).json({
				message: 'Invalid access - must be a member to create a snapshot'
			});
			return;

		} else {
			const newSnapshot = new Snapshot({
				author: req.body.author,
				title: req.body.title,
				project: req.body.project,
				date: req.body.date,
				categories: req.body.categories,
				descriptions: req.body.descriptions,
				hyperlinks: req.body.hyperlinks,
				contributors: req.body.contributors,
			});

			await newSnapshot
				.save()
				.then((data) => {
					res.status(200).json({
						message: 'Successfully created timeline snapshot.',
						data: data,
					});
				})
				.catch((err) => {
					res.status(400).json({
						message: 'Error saving timeline snapshot to MongoDB',
						error: err,
					});
				});

			return;
		}
	} catch (err) {
		res.status(500).json({
			message: 'Internal server error while attempting to create snapshot',
			error: err,
			errCode: SNAPSHOT_ERR.SNAPSHOT001
		});

		return;
	}
};

/**
 * @param Expected request body: None, request query parameters (optional): project, categories, date, author
 * @param Responds with all timeline objects found in database if no query parameters specified, else filters timeline
 *                 objects based on query parameters
 */
export const getAllSnapshots = async (req, res) => {
	const isMember = await hasFrontendAPIKey(req.headers.authorization);

	if (!isMember) {
		res.status(400).json({
			message: 'Invalid access - must be a member to access all snapshots.'
		});
		return;

	} else {
		const filter = {};
		const validFilters = ['project', 'date', 'author', 'categories'];

		for (const [key, value] of Object.entries(req.query)) {
			if (validFilters.includes(key)) {
				filter[key] = value;
			}
		}

		await Snapshot.find(filter)
			.sort('-date')
			.exec()
			.then((data) => {
				res.status(200).json({
					message: 'Successfully retrieved all timeline snapshots',
					data: data,
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: 'Error getting all timeline snapshots from MongoDB',
					error: err,
					errCode: SNAPSHOT_ERR.SNAPSHOT002
				});
			});
	}
};

/**
 *
 * @param Expected request body: None, request url parameter: id - ID of the timeline snapshot to delete
 * @param Responds with a message saying deleted if successful, along with the deleted object, or an error message if unsuccessful
 */
export const deleteSnapshot = async (req, res) => {
	try {
		const isMember = await hasFrontendAPIKey(req.headers.authorization);

		if (!isMember) {
			res.status(400).json({
				message: 'Invalid access - must be a user to delete a snapshot'
			});
		} else {
			await Snapshot.findByIdAndDelete(req.params.id)
				.exec()
				.then((data) => {
					res.status(200).json({
						message: 'Successfully deleted timeline snapshot',
						data: data,
					});
				})
				.catch((err) => {
					res.status(400).json({
						message: 'Error deleting timeline snapshot from MongoDB',
						error: err,
					});
				});
		}
	} catch (err) {
		res.status(500).json({
			message: 'Internal server error while attempting to delete snapshot',
			error: err,
			errCode: SNAPSHOT_ERR.SNAPSHOT003
		});
	}
};

/**
 *
 * @param Expected request body: None, request url parameter: id - ID of the timeline snapshot to get
 * @param Responds with a message saying retrieved if successful, along with the retrieved object, or an error message if unsuccessful
 */

export const getSnapshot = async (req, res) => {
	const isMember = await hasFrontendAPIKey(req.headers.authorization);

	if (!isMember) {
		res.status(400).json({
			message: 'Invalid access - must be a member to access a snapshot.'
		});
		return;

	} else {
		let id = req.params.id;
		await Snapshot.findById(id)
			.exec()
			.then((data) => {
				res.status(200).json({
					message: 'Successfully retrieved timeline snapshot',
					data: data,
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: 'Error retrieving timeline snapshot from MongoDB',
					error: err,
					errCode: SNAPSHOT_ERR.SNAPSHOT004
				});
			});
	}
};

/**
@param Expected request body: subset of fields in ../models/snapshot.model.js - however, instead 
of recieving an array of user ObjectIDs in the contributor field, this endpoint expects an array of usernames
{
  ... (rest of the fields same as mentioned in ../models/snapshots.model.js)
  "contributers": [
	"username1", -- note: usernames are case insensitive, e.g "roBert", "ROBERT" both return the same results
	"username2",
	...
  ]
}
request url parameter: id - ID of the timeline snapshot to update
@param Responds with a message saying edit successful + updated snapshot, or an error if something went wrong
*/

export const updateSnapshot = async (req, res) => {
	try {
		const isMember = await hasFrontendAPIKey(req.headers.authorization);

		if (!isMember) {
			res.status(400).json({
				message: 'Invalid access - must be a user to update a snapshot'
			});
		} else {
			try {
				let newSnapshot = req.body;

				if (req.body.hasOwnProperty('contributors')) {
					let users = [];
					for (let user of req.body.contributors) {
						const lookup = await User.find({ 'username': new RegExp(`^${user}$`, 'i') });
						if (lookup.length) users.push(lookup[0]._id);
						else throw `User ${user} does not exist`;
					}
					newSnapshot['contributors'] = users;
				}

				const updatedSnapshot = await Snapshot.findByIdAndUpdate(req.params.id, newSnapshot, {
					new: true,
				});

				if (updatedSnapshot) {
					res.status(200).json({
						message: 'Successfully updated snapshot',
						data: updatedSnapshot,
					});
				} else {
					res.status(400).json({
						message: 'Could not update snapshot'
					});
				}

			} catch (error) {
				res.status(500).json({
					message: 'Internal server error while attempting to update snapshot',
					errCode: 'SNAPSHOT005',
					error,
				});
			}
		}
	} catch (error) {
		res.status(500).json({
			message: 'Internal server error while attempting to update snapshot',
			errCode: 'SNAPSHOT005',
			error,
		});
	}
}