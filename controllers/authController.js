import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import User from '../models/user.model.js';
import AUTH_ERR from '../errors/authErrors.js';
import {
	hasAdminPermissions,
	hasMemberPermissions,
	sendCreateUser,
} from '../helpers/authHelper.js';

/**
 *
 * @param Expected request body:
 *        {
 *          username: string,
 *          password: string,
 *          permissions: string,
 *        }
 * @param Responds with created user.
 */
export const createUser = async (req, res) => {
	try {
		const isAdmin = await hasAdminPermissions(req.headers.authorization);

		if (!isAdmin) {
			res.status(400).json({
				message: 'Must be an admin to create a new user.',
			});
			return;
		}
		//console.log(req.body);
		const data = await sendCreateUser(req.body);
		res.status(200).json({
			message: 'Successfully created user.',
			data,
		});

		return;
	} catch (error) {
		res.status(500).json({
			message: 'Failed to create user.',
			error,
			errCode: AUTH_ERR.AUTH001,
		});

		return;
	}
};

/**
 *
 * @param Expected request parameter:
 *        {
 *          username: string,
 *        }
 * @param Expected HEADERS:
 *        {
 *          authorization: string,
 *        }
 * @param Responds with status code and messsage.
 */

export const deleteUser = async (req, res) => {
	try {
		const isAdmin = await hasAdminPermissions(req.headers.authorization);

		if (!isAdmin) {
			res.status(400).json({
				message: 'Invalid access - only admins can delete users',
			});

			return;
		} else {
			const response = await User.deleteOne({
				username: req.params.username,
			});

			res.status(200).json({
				message: `Successfully deleted ${response.n} user(s).`,
				data: true,
			});

			return;
		}
	} catch (err) {
		res.status(500).json({
			message: 'Internal server error while attempting to delete user',
			error: err,
			errCode: AUTH_ERR.AUTH002,
		});

		return;
	}
};

/**
 * Requires Admin user access
 * @param Expected HEADERS:
 *        {
 *          authorization: string,
 *        }
 * @param Responds with array of users.
 */
export const getUsers = async (req, res) => {
	try {
		const isAdmin = await hasAdminPermissions(req.headers.authorization);

		if (!isAdmin) {
			res.status(400).json({
				message: 'Invalid access - only an admin can access all users',
			});

			return;
		} else {
			const users = await User.find();

			res.status(200).json({
				message: 'Successfully retrieved users.',
				data: users,
			});

			return;
		}
	} catch (error) {
		res.status(500).json({
			message: 'Internal server error while attempting to retrieve users',
			error,
			errCode: AUTH_ERR.AUTH003,
		});

		return;
	}
};

/**
 *
 * @param Expected request body:
 *        {
 *          username: string,
 *          password: string,
 *        }
 * @param Responds with JWTs, username, and permissions.
 */
export const loginUser = async (req, res) => {
	try {
		if (!(req.body.username && req.body.password)) {
			res.status(400).json({
				message: 'Invalid request body.',
			});
			return;
		}

		const user = await User.findOne({
			username: req.body.username,
		});

		if (user) {
			const match = await bcrypt.compare(req.body.password, user.hash);

			// If user's hash matches request password, authenticate by responding with JWTs
			if (match) {
				// Create new access token and refresh token
				const access_token = nanoid();

				const data = await User.findOneAndUpdate(
					{ username: req.body.username },
					{ $set: { access_token } }
				);

				res.status(200).json({
					message: 'Successfully authenticated user.',
					data: {
						username: data.username,
						access_token: access_token,
						refresh_token: data.refresh_token,
						permissions: data.permissions,
					},
				});
			} else {
				res.status(400).json({
					message: 'Invalid username or password.',
				});
			}
		} else {
			res.status(400).json({
				message: 'Invalid username or password.',
			});

			return;
		}

		return;
	} catch (error) {
		res.status(500).json({
			message: 'Authentication error on our end.',
			error,
			errCode: AUTH_ERR.AUTH004,
		});

		return;
	}
};

/**
 *
 * @param Expected HEADER:
 *        {
 *          authorization: string,
 *        }
 * @param Responds with access_token.
 */
export const refreshToken = async (req, res) => {
	try {
		const access_token = nanoid();

		const user = await User.findOneAndUpdate(
			{
				refresh_token: req.headers.authorization,
			},
			{
				access_token,
			}
		);

		if (user) {
			res.status(200).json({
				message: 'Successfully refreshed token.',
				data: {
					access_token,
				},
			});
		} else {
			res.status(400).json({
				message: 'Invalid refresh token.',
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'Server error on our end.',
			error,
			errCode: AUTH_ERR.AUTH005,
		});
	}
};

/**
 *
 * @param Expected HEADER:
 *        {
 *          authorization: string,
 *        }
 * @param Responds with success/error message.
 */
export const logoutUser = async (req, res) => {
	try {
		const isMember = await hasMemberPermissions(req.headers.authorization);

		if (!isMember) {
			res.status(400).json({
				message: 'Invalid access - user must be logged in to log out',
			});
		} else {
			const refresh_token = nanoid();
			const access_token = nanoid();

			const data = await User.findOneAndUpdate(
				{ access_token: req.headers.authorization },
				{ $set: { access_token, refresh_token } }
			);

			if (data) {
				res.status(200).json({
					message: 'Successfully logged out user.',
					data: true,
				});
			}
		}
	} catch (error) {
		res.status(500).json({
			message: 'Server error while attempting to logout user',
			error,
			errCode: AUTH_ERR.AUTH006,
		});
	}
};

/**
 *
 * @param Expected request body:
 *        {
 *          username: string,
 *        }
 * @param Expected HEADERS:
 *        {
 *          authorization: string,
 *        }
 * @param Responds with status code and messsage.
 */
export const changeUsername = async (req, res) => {
	try {
		const isMember = await hasMemberPermissions(req.headers.authorization);

		if (!isMember) {
			res.status(400).json({
				message: 'Invalid access - user must be logged in to change username',
			});
		} else {
			const username = req.body.username;

			const data = await User.findOneAndUpdate(
				{ access_token: req.headers.authorization },
				{ $set: { username } }
			);

			//TODO: why true is sent?
			if (data) {
				res.status(200).json({
					message: 'Successfully changed user name.',
					data: true,
				});
			}
		}
	} catch (error) {
		res.status(500).json({
			message: 'Server error while attempting to change username',
			error,
			errCode: AUTH_ERR.AUTH008,
		});
	}
};

/**
 *
 * @param Expected request body:
 *        {
 *          username: string,
 *        }
 * @param Expected HEADERS:
 *        {
 *          authorization: string,
 *        }
 * @param Responds with status code and messsage.
 */
export const changePassword = async (req, res) => {
	try {
		const isMember = await hasMemberPermissions(req.headers.authorization);

		if (!isMember) {
			res.status(400).json({
				message: 'Invalid access - user must be logged in to change password',
			});
		} else {
			const access_token = nanoid();
			const refresh_token = nanoid();
			const hash = await bcrypt.hash(req.body.password, 10);

			const data = await User.findOneAndUpdate(
				{ access_token: req.headers.authorization },
				{ $set: { access_token, refresh_token, hash } }
			);

			if (data) {
				res.status(200).json({
					message: 'Successfully changed password.',
					data: true,
				});
			}
		}
	} catch (error) {
		res.status(500).json({
			message: 'Server error while attempting to change password',
			error,
			errCode: AUTH_ERR.AUTH009,
		});
	}
};
