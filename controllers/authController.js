import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import User from '../models/user.model.js';
import { checkAccessToken } from '../helpers/authHelper.js';

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
    if (!(req.body.username && req.body.password && req.body.permissions)) {
      res.status(400).json({
        message: 'Invalid request body.',
      });
      return;
    }

    // Generate 21 length tokens
    const access_token = nanoid();
    const refresh_token = nanoid();

    // Generate salted hash for password
    const hash = await bcrypt.hash(req.body.password, 10);

    // Create user document
    const newUser = new User({
      username: req.body.username,
      hash,
      permissions: req.body.permissions,
      refresh_token,
      access_token,
    });

    const data = await newUser.save();

    res.status(200).json({
      message: 'Successfully created user.',
      data,
    });

    return;
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create user.',
      error,
    });

    return;
  }
};

export const deleteUser = async (req, res) => {};

/**
 *
 * @param Expected request params:
 *        {
 *          access_token: string,
 *        }
 * @param Responds with array of users.
 */
export const getUsers = async (req, res) => {
  try {
    const access = await checkAccessToken(req.params.access_token);

    if (access.userPermissions !== 'admin') {
      res.status(400).json({
        message: 'Invalid access.',
      });

      return;
    } else {
      const users = await User.find();

      res.status(200).json({
        message: 'Successfully retrieved users.',
        data: users,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error.',
      error,
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
 * @param Responds with JWTs.
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
        // Create new access token
        const access_token = nanoid();
        const data = await User.findOneAndUpdate(
          { username: req.body.username },
          { $set: { access_token } }
        );

        res.status(200).json({
          message: 'Successfully authenticated user.',
          data: {
            username: data.username,
            access_token: data.access_token,
            refresh_roken: data.refresh_token,
          },
        });
      } else {
        res.status(400).json({
          message: 'Invalid password.',
        });
      }
    } else {
      res.status(400).json({
        message: 'Username does not exist.',
      });

      return;
    }

    return;
  } catch (error) {
    res.status(500).json({
      message: 'Authentication error on our end.',
      error,
    });

    return;
  }
};

/**
 *
 * @param Expected request params:
 *        {
 *          refresh_token: string,
 *        }
 * @param Responds with access_token.
 */
export const refreshToken = async (req, res) => {
  try {
    const access_token = nanoid();

    const user = await User.findOneAndUpdate(
      {
        refresh_token: req.params.refresh_token,
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
    });
  }
};

export const changeUsername = async (req, res) => {};

export const changePassword = async (req, res) => {};
