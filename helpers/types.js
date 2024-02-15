export const USER_TYPES = {
	DEFAULT_USER: 'default_user',
	ADMIN: 'admin',
};

export const USER_TYPE_NAMES = Object.values(USER_TYPES);

// TODO populate this constant with values when resource categories known
const RESOURCE_CATEGORIES = {
  // the different resource categories
};

// TODO add resource category name check to validator once RESOURCE_CATEGORIES is populated
export const RESOURCE_CATEGORIES_NAMES = Object.values(RESOURCE_CATEGORIES);
