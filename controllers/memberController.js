import * as yup from 'yup';
import { sendCreateMember } from '../helpers/memberHelper.js';
import MEMBER_ERR from '../errors/memberErrors.js';
import AUTH_ERR from '../errors/authErrors.js';
import Member from '../models/member.model.js';

/**
 * @param Expected request body -> see models/member.model.js
 * @param Responds with created user.
 */
export const createMember = async (req, res) => {
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
			message: yup.string().notRequired(),
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
	} catch (error) {
		res.status(500).json({
			message: 'Failed to create lab member.',
			error,
			errCode: MEMBER_ERR.MEMBER002,
		});
	}
};

export const getMember = async (req, res) => {
	try {
		const members = await Member.find();

		res.status(200).json({
			message: 'Successfully retrieved members.',
			data: members,
		});
	} catch (error) {
		res.status(500).json({
			message: 'Internal server error while attempting to retrieve members',
			error,
			errCode: AUTH_ERR.AUTH003,
		});
	}
};
