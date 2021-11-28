import * as yup from "yup";
import { USER_TYPE_NAMES } from "../../helpers/types.js";

const MIN_PASSWORD_LENGTH = 8;
const MIN_USERNAME_LENGTH = 4;

/**
 * Schema verified against when creating a new User
 */
export const userCreationSchema = yup.object({
  username: yup.string().min(MIN_USERNAME_LENGTH).required(),
  password: yup.string().min(MIN_PASSWORD_LENGTH).required(),
  permissions: yup.string().oneOf(USER_TYPE_NAMES).required()
})

/**
 * Schema validated against when performing other actions involving Users
 * e.g. updating username/password/permissions, referencing user in a Project, etc
 */
export const userValidationSchema = yup.object({
  _id: yup.string().required(),
  username: yup.string().min(MIN_USERNAME_LENGTH),
  password: yup.string().min(MIN_PASSWORD_LENGTH),
  permissions: yup.string().oneOf(USER_TYPE_NAMES)
});