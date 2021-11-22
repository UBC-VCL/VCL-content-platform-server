import User from "../models/user.model.js";
import { USER_TYPES, USER_TYPE_NAMES } from "./types.js";

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

export const hasMemberPermissions = (permissions) => {
  return USER_TYPE_NAMES.includes(permissions);
};

export const hasAdminPermissions = (permissions) => {
  return permissions === USER_TYPES.ADMIN;
};
