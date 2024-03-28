import { CAREER_WORKSHOPS_SUBCATEGORIES_NAMES, RESOURCE_CATEGORIES, RESOURCE_CATEGORIES_NAMES, RESOURCE_CATEGORIES_WITH_SUBCATEGORIES, SKILLS_WORKSHOPS_SUBCATEGORIES_NAMES } from '../../helpers/types.js';
import * as yup from 'yup';

const resourceValidationSchema = yup.object({
	title: yup.string().required(),
	description: yup.string(),
	category: yup.object().shape({
		main: yup.string().oneOf(RESOURCE_CATEGORIES_NAMES).required(),
		sub: yup.string().when('main', {
			is: main => RESOURCE_CATEGORIES_WITH_SUBCATEGORIES.includes(main),
			then: yup.string().when('main', {
				is: main => main === RESOURCE_CATEGORIES.CAREER_WORKSHOPS,
				then: yup.string().oneOf(CAREER_WORKSHOPS_SUBCATEGORIES_NAMES).required(),
				otherwise: yup.string().oneOf(SKILLS_WORKSHOPS_SUBCATEGORIES_NAMES).required(),
			}),
			otherwise: yup.string().transform(value => (!value ? new Date().getFullYear().toString() : value)),
		}).required(),
	}),
	author: yup.string().required(),
	resource_link: yup.string()
		.matches(/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/)
		.required(),
});

export default resourceValidationSchema;
