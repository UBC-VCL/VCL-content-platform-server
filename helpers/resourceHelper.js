import Resource from '../models/resource.model.js';
import User from '../models/user.model.js';

export const isResourceOwner = async (id, user) => {
	const resource = await Resource.findOne({ _id: id });
	const currUser = await User.findOne({ username: user });

	if (!resource) {
		throw 'resource not found';
	}

	if (!currUser) {
		throw `user with username ${user} was not found when it should have`;
	}

	return resource.owner.toString() === currUser._id.toString();
};

export const separateSubCategories = (data) => {
	var subCategorySeparated = [];
	var currSubCategory = null;
	var currIndex = -1;
	data.forEach((resource) => {
		const subCategory = resource.category.sub;
		if (currSubCategory !== subCategory) {
			currIndex++;
			currSubCategory = subCategory;
			subCategorySeparated.push([]);
		}
		subCategorySeparated[currIndex].push(resource);
	})
	return subCategorySeparated;
}
