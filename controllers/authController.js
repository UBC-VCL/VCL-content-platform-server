import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import User from '../models/user.model.js';
import AUTH_ERR from '../errors/authErrors.js';
import {
	sendCreateUser,
} from '../helpers/authHelper.js';
import jwt from 'jsonwebtoken';
const { sign } = jwt;

/**
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
		const data = await sendCreateUser(req.body);
		res.status(200).json({
			message: 'Successfully created user.',
			data,
		});
	} catch (error) {
		res.status(500).json({
			message: 'Failed to create user.',
			error,
			errCode: AUTH_ERR.AUTH001,
		});
	}
};

/**
 * @param Expected request parameter:
 *        {
 *          username: string,
 *        }
 * @param Responds with status code and messsage.
 */
export const deleteUser = async (req, res) => {
	try {
			const response = await User.deleteOne({
				username: req.params.username,
			});

			res.status(200).json({
				message: `Successfully deleted ${response.n} user(s).`,
			});
	} catch (err) {
		res.status(500).json({
			message: 'Internal server error while attempting to delete user',
			error: err,
			errCode: AUTH_ERR.AUTH002,
		});
	}
};

/**
 * @param Responds with array of users.
 */
export const getUsers = async (req, res) => {
	try {
			const users = await User.find();

			res.status(200).json({
				message: 'Successfully retrieved users.',
				data: users,
			});
	} catch (error) {
		res.status(500).json({
			message: 'Internal server error while attempting to retrieve users',
			error,
			errCode: AUTH_ERR.AUTH003,
		});
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
				// Create new refresh token
				// const refresh_token = nanoid();

				// Creating new refresh token in db and associating it with user
				//await new RefreshTokens(refresh_token, user).save();

				// Creating new access token (formatted as jwt token)
				const access_token = sign({id: user._id, username: user.username, permissions: user.permissions}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});

				// Update user in db to hold new access_token --> will be changed to creating a new token document in a new token collection
				// await User.findOneAndUpdate(
				// 	{ username: req.body.username },
				// 	{ $set: { access_token } }
				// );

				// Storing refresh_token as a cookie that will last for 1 week
				// res.cookie('refresh_token', refresh_token, {httpOnly: true, maxAge: 60 * 60 * 24 * 7 });

				res.cookie('access_token', access_token, {httpOnly: true, maxAge: 3600000, sameSite: 'None', secure: true})
				res.status(200).json({
					message: 'Successfully authenticated user.',
					data: {
						username: user.username,
						permissions: user.permissions
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

// TODO fix after implementing refresh token
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
 * @param Responds with success/error message.
 */
export const logoutUser = async (req, res) => {
	try {
			// Deleting the refresh_token entry in the refresh_token collection
			// const data = await User.findOneAndUpdate(
			// 	{ access_token: req.headers.authorization },
			// 	{ $set: { access_token: '', refresh_token: '' } }
			// );

			res.clearCookie('access_token');
			// if (data) {
				res.status(200).json({
					message: 'Successfully logged out user.',
				});
			// }
	} catch (error) {
		res.status(500).json({
			message: 'Server error while attempting to logout user',
			error,
			errCode: AUTH_ERR.AUTH006,
		});
	}
};

/**
 * @param Expected request body:
 *        {
 *          username: string,
 *        }
 * @param Responds with status code and messsage.
 */
export const changeUsername = async (req, res) => {
	try {
			const username = req.body.username;

			const data = await User.findOneAndUpdate(
				{ username: req.user.username },
				{ $set: { username } }
			);

			if (data) {
				res.status(200).json({
					message: 'Successfully changed user name.',
				});
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
 * @param Expected request body:
 *        {
 *          password: string,
 *        }
 * @param Responds with status code and messsage.
 */
export const changePassword = async (req, res) => {
	try {
			const refresh_token = nanoid();
			const hash = await bcrypt.hash(req.body.password, 10);

			// TODO delete all refresh tokens associated with user --> possibly think about storing some sort of secret key in db 
			// or attached to user which when password changes gets reset to something else (secret key is same as the one used to verify JWT)

			const data = await User.findOneAndUpdate(
				{ username: req.user.username },
				{ $set: { hash } }
			);

			if (data) {
				res.status(200).json({
					message: 'Successfully changed password.',
				});
			}
	} catch (error) {
		res.status(500).json({
			message: 'Server error while attempting to change password',
			error,
			errCode: AUTH_ERR.AUTH009,
		});
	}
};
