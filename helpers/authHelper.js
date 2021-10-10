import User from '../models/user.model.js';
import { USER_TYPES } from './types.js';

// Checks if access token is valid
// returns obj: {
//    userPermissions: "member" | "admin",
//    isValidToken: boolean
// }
export const checkAccessToken = async (access_token) => {
  let userPermissions = null;
  let isValidToken = false;

  const user = await User.findOne({ access_token });

  if (user) {
    userPermissions = user.permissions;
    isValidToken = true;
  }

  return {
    userPermissions,
    isValidToken,
  };
};

/**
 * Checks whether a given access token matches the specified permissions
 * @param {string} req - post request - must have authorization header!!
 * @param {USER_TYPES} userType - type of user to validate for
 * @returns true if the access token matches the given permissions for userType.
 *     e.g. if checking hasPermissions(token, USER_TYPES.ADMIN), this function will
 *          return true if the currently logged-in user is an admin
 */
export const hasPermissions = async (req, userType) => {
  const access = await checkAccessToken(req.headers.authorization);

  switch (userType) {
    case USER_TYPES.USER:
      return access.isValidToken;
    case USER_TYPES.ADMIN:
      return access.isValidToken && (user.permissions === "admin");
    default:
      return false;
  }
}