import Resource from '../models/resource.model';
import User from '../models/user.model';

export const isValidResourceCategory = () => {
	// TODO verify valid resource category
};

export const isResourceOwner = async (id, user) => {
	const resource = await Resource.findOne({ _id: id });
	const currUser = await User.findOne({ username: user });

	if (!resource) {
		throw 'resource not found';
	}

	if (!currUser) {
		throw `user with username ${user} was not found when it should have`;
	}

	return resource.owner.toString() === currUser.member.toString();
};
