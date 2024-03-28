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
