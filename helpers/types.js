export const USER_TYPES = {
	DEFAULT_USER: 'default_user',
	ADMIN: 'admin',
};

export const USER_TYPE_NAMES = Object.values(USER_TYPES);

// TODO populate this constant with values when resource categories known
export const RESOURCE_CATEGORIES = {
	SKILLS_WORKSHOPS: 'Skills Workshops',
	CAREER_WORKSHOPS: 'Career Workshops',
	COGS_402_PROJECTS: 'COGS 402',
	RESEARCH_PROJECT_PRESENTATIONS: 'Research Project',
};

const SKILLS_WORKSHOPS_SUBCATEGORIES = {
	CODING: 'Coding',
	STORYTELLING: 'Storytelling',
	DATA_SCIENCE: 'Data Science',
	PRESENTATION_SKILLS: 'Presentation Skills',
	DIVERSITY: 'Diversity'
}

const CAREER_WORKSHOPS_SUBCATEGORIES = {
	MANAGEMENT_SKILLS: 'Management Skills',
	INTERVIEW_SKILLS: 'Interview Skills',
	RESUME_BUILDING: 'Resume Building',
	NETWORKING: 'Networking',
	GRAD_SCHOOL: 'Grad School'
}

// TODO add resource category name check to validator once RESOURCE_CATEGORIES is populated
export const RESOURCE_CATEGORIES_NAMES = Object.values(RESOURCE_CATEGORIES);
export const RESOURCE_CATEGORIES_WITH_SUBCATEGORIES = Object.values(RESOURCE_CATEGORIES)
	.filter((category) => category != "COGS 402 Projects");
export const SKILLS_WORKSHOPS_SUBCATEGORIES_NAMES = Object.values(SKILLS_WORKSHOPS_SUBCATEGORIES);
export const CAREER_WORKSHOPS_SUBCATEGORIES_NAMES = Object.values(CAREER_WORKSHOPS_SUBCATEGORIES);

