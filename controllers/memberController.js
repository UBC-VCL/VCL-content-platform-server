
import * as yup from "yup";
import { sendCreateMember } from "../helpers/memberHelper.js";
import MEMBER_ERR from "../errors/memberErrors.js";
import Member from "../models/member.model.js";
import {
  hasMemberPermissions
} from "../helpers/authHelper.js";

/**
 *
 * @param Expected request body -> see models/member.model.js
 * @param Responds with created user.
 */
export const createMember = async (req, res) => {
	try {
		const schema = yup.object().shape({
			firstName: yup
				.string()
				.required('First name is required'),
			lastName: yup
				.string()
				.required('Last name is required'),
			projects: yup
				.array()
				.of(yup.string())
				.required('Projects ID array is required'),
			isActive: yup.boolean().required('isActive is required'),
		});


    await schema.validate(req.body);
  } catch (err) {
    res.status(400).json({
      message: `Request error: wrong shema in request body`,
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
};

export const getMember = async (req, res) => {
  try {
      const members = await Member.find();

      res.status(200).json({
        message: "Successfully retrieved members.",
        data: members,
      });

      return;
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while attempting to retrieve members",
      error,
      errCode: AUTH_ERR.AUTH003,
    });

    return;
  }
};
