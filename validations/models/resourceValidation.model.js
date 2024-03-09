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
	username: yup.string().required(),
	resource_link: yup.string()
		.matches(/^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm)
		.required(),
});

export default resourceValidationSchema;
