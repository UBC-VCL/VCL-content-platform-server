import * as yup from 'yup';
import { USER_TYPE_NAMES } from '../../helpers/types.js';

const MIN_PASSWORD_LENGTH = 8;
const MIN_USERNAME_LENGTH = 4;

/**
 * Schema verified against when creating a new User
 */
export const userCreationSchema = yup.object({
	username: yup
		.string()
		.min(
			MIN_USERNAME_LENGTH,
			`Minimum username length is ${MIN_USERNAME_LENGTH}`
		)
		.required('Username is required'),
	password: yup
		.string()
		.min(
			MIN_PASSWORD_LENGTH,
			`Minimum password length is ${MIN_PASSWORD_LENGTH}`
		)
		.required('Password is required'),
	permissions: yup
		.string()
		.oneOf(USER_TYPE_NAMES, 'User permission level provided does not exist')
		.required('User permission is required'),
	member: yup.string().required('Member ID is required'),
});
