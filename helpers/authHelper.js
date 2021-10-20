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
 * Helper functions to check if a user has member or admin privileges based on their access token.
 * @param authHeader - the access token to check (likely from req.headers.authorization)
 */
export const isMember = async (authHeader) => {
  const access = await checkAccessToken(authHeader);
  return access.isValidToken;
}

export const isAdmin = async (authHeader) => {
  const access = await checkAccessToken(authHeader);
  return access.isValidToken && user.permissions === USER_TYPES.ADMIN;
}