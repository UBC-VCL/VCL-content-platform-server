import * as yup from 'yup';
import { sendCreateMember } from '../helpers/memberHelper.js';
import MEMBER_ERR from '../errors/memberErrors.js';
import Member from '../models/member.model.js';
import {
	hasFrontendAPIKey
} from '../helpers/authHelper.js';

/**
 *
 * @param Expected request body -> see models/member.model.js
 * @param Responds with created user.
 */
export const createMember = async (req, res) => {
	const isMember = await hasFrontendAPIKey(req.headers.authorization);

	if (!isMember) {
		res.status(400).json({
			message: 'Invalid access - must be a member to create another member.',
		});

		return;
	} else {
		try {
			const schema = yup.object().shape({
				name: yup.object().shape({
					firstname: yup.string().trim().required('Firstname is required!'),
					lastname: yup.string().trim().required('Lastname is required!'),
				}),
				project: yup.string().required('Project is required!'),
				position: yup.string().required('Position is required！'),
				contact: yup.object().shape({
					phoneNumber: yup.string().notRequired(),
					linkedIn: yup.string().notRequired(),
					email: yup.string().notRequired(),
				}).required(),
				blurb: yup.string().notRequired(),
				isAlumni: yup.boolean().default(false).required(),
			});


			await schema.validate(req.body);
		} catch (err) {
			res.status(400).json({
				message: 'Request error: wrong schema in request body',
				error: err,
				errCode: MEMBER_ERR.MEMBER001,
			});

			return;
		}

		try {
			const member = await sendCreateMember(req.body);
			res.status(200).json({
				message: 'Successfully created lab member',
				data: member,
			});

			return;
		} catch (error) {
			res.status(500).json({
				message: 'Failed to create lab member.',
				error,
				errCode: MEMBER_ERR.MEMBER002,
			});

			return;
		}
	}
};

/**
 * @param Responds all members apart of lab.
 */
export const getMember = async (req, res) => {
	try {
		const members = await Member.find();

		res.status(200).json({
			message: 'Successfully retrieved members.',
			data: members,
		});

		return;
	} catch (error) {
		res.status(500).json({
			message: 'Internal server error while attempting to retrieve members',
			error,
			errCode: MEMBER_ERR.MEMBER003,
		});
		return;
	}
};

/**
 *
 * @param Expected request parameters:
 *        {
 *          project: string,
 *        }
 * @param Responds all members apart of project.
 */
export const getProjectMembers = async (req, res) => {
	try {
		const members = await Member.find({'project': req.params.project});

		res.status(200).json({
			message: `Successfully retrieved ${req.headers.project} team members.`,
			data: members,
		});

		return;
	} catch (error) {
		res.status(500).json({
			message: `Internal server error while attempting to retrieve ${req.headers.project} team members`,
			error,
			errCode: MEMBER_ERR.MEMBER004,
		});
		return;
	}
}
