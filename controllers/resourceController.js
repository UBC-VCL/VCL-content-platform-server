import Resource from '../models/resource.model.js';
import RESOURCE_ERR from '../errors/resourceErrors.js';
import User from '../models/user.model.js';
import { isResourceOwner, separateSubCategories } from '../helpers/resourceHelper.js';
import { USER_TYPES } from '../helpers/types.js';

/**
 * @param Expected request body:
 *        {
 *          title: string,
 *          description: string,
 *          category: {
 * 						main: string,
 * 						sub: string,
 * 					},
 * 					author: string,
 *          resource_link: string,
 *        }
 * @param Responds with status code and messsage.
 */
export const createResource = async (req, res) => {
	try {
		const { title, description, category, author, resource_link } = req.body;
		const ownerUser = await User.findOne({ username: req.user.username });
		if (!ownerUser) {
			throw 'logged in user could not be found, when it should have been.';
		}

		const owner = ownerUser._id;
		const newResource = new Resource({
			title,
			description,
			category,
			author,
			owner,
			resource_link,
		});

		await newResource.save().then(async (data) => {
			await data.populate('owner', 'username').execPopulate();
			res.status(200).json({
				message: 'Successfully created new resource',
				data,
			});
		});
	} catch (error) {
		res.status(500).json({
			message: 'Internal server error while attempting to create resource',
			error,
			errCode: RESOURCE_ERR.RESOURCE001,
		});
	}
};

/**
 * @param Expected request parameter:
 *        {
 *          category: string,
 *        }
 * @param Responds with array of resources.
 */
export const getResourcesInCategory = async (req, res) => {
	await Resource.find({ 'category.main': req.params.category })
		.sort('-category.sub -createdAt')
		.populate({ path: 'owner', select: 'username' })
		.exec()
		.then((data) => {
			const formatedData = separateSubCategories(data);
			res.status(200).json({
				message: 'Successfully retrieved all Resources in category',
				data: formatedData,
			});
		})
		.catch((error) => {
			res.status(500).json({
				message: 'Error while getting all Resources in category from MongoDB',
				error,
				errCode: RESOURCE_ERR.RESOURCE002,
			});
		});
};

/**
 * @param Expected request parameter:
 *        {
 *          id: mongoose.ObjectId (id of resource),
 *        }
 * @param Responds with resource
 */
export const getResource = async (req, res) => {
	const id = req.params.id;
	await Resource.findOne({ _id: id })
		.populate({ path: 'owner', select: 'username' })
		.exec()
		.then((data) => {
			if (data) {
				res.status(200).json({
					message: `Successfully retrieved Resource with id <${id}>`,
					data,
				});
			} else {
				res.status(404).json({
					message: `Couldn't find Resource with id <${id}>`,
				});
			}
		})
		.catch((error) => {
			res.status(500).json({
				message: `Error while getting Resource with id <${id}> from MongoDB`,
				error,
				errCode: RESOURCE_ERR.RESOURCE003,
			});
		});
};

/**
 * @param Expected request parameter:
 *        {
 *          id: mongoose.ObjectId (id of resource),
 *        }
 * @param Expected request body:
 *        {
 *          title: string,
 *          description: string,
 *          category: {
 * 						main: string,
 * 						sub: string,
 * 					},
 * 					author: string,
 *          resource_link: string,
 *        }
 * @param Responds with status code and messsage.
 */
export const updateResource = async (req, res) => {
	try {
		const id = req.params.id;
		try {
			const isOwner = await isResourceOwner(id, req.user.username);
			if (!isOwner && req.user.permissions !== USER_TYPES.ADMIN) {
				res.status(400).json({
					message:
            'Invalid access - must be either owner of resource or an admin to update a resource',
				});
				return;
			}
		} catch (error) {
			if (error === 'resource not found') {
				res.status(404).json({
					message: `Could not find resource with id ${id} to update`,
				});
				return;
			} else {
				throw error;
			}
		}

		const { title, description, category, author, resource_link } = req.body;
		const updatedResource = await Resource.findOneAndUpdate(
			{ _id: id },
			{ title, description, category, author, resource_link },
			{ new: true }
		).populate({ path: 'owner', select: 'username' });
		if (updatedResource) {
			res.status(200).json({
				message: 'Successfully updated resource',
				data: updatedResource,
			});
		} else {
			res.status(400).json({
				message: 'Could not update resource',
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'Internal server error while attempting to update resource',
			errCode: RESOURCE_ERR.RESOURCE004,
			error,
		});
	}
};

/**
 * @param Expected request parameter:
 *        {
 *          id: mongoose.ObjectId (id of resource),
 *        }
 * @param Responds with status code and messsage.
 */
export const deleteResource = async (req, res) => {
	try {
		const id = req.params.id;
		
		try {
			const isOwner = await isResourceOwner(id, req.user.username);
			if (!isOwner && req.user.permissions !== USER_TYPES.ADMIN) {
				res.status(400).json({
					message:
            'Invalid access - must be either owner of resource or an admin to delete a resource',
				});
				return;
			}
		} catch (error) {
			if (error === 'resource not found') {
				res.status(404).json({
					message: `Could not find resource with id ${id} to delete`,
				});
				return;
			} else {
				throw error;
			}
		}

		const { deletedCount } = await Resource.deleteOne({ _id: id });
		if (deletedCount === 0) {
			throw `Resource with id <${id}> not found, when it should have been`;
		} else {
			res.status(200).json({
				message: 'Successfully deleted resource',
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'Internal server error while attempting to delete resource',
			errCode: RESOURCE_ERR.RESOURCE005,
			error,
		});
	}
};
