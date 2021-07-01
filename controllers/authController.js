import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import User from "../models/user.model.js";

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
      message: "Successfully created user.",
      data,
    });

    return;
  } catch (error) {
    res.status(400).json({
      message: "Failed to create user.",
      error,
    });

    return;
  }
};

export const deleteUser = async (req, res) => {};

export const getUsers = async (req, res) => {};

export const authenticateUser = async (req, res) => {
  try {
    const user = await User.find({
      username: req.body.username,
    });

    res.status(200).json({
      message: "",
      data: user,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Authentication error on our end.",
      error,
    });
    return;
  }
};

export const changeUsername = async (req, res) => {};

export const changePassword = async (req, res) => {};
