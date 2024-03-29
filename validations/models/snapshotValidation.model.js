import * as yup from 'yup';
import { parse, isValid } from 'date-fns';

/**
 * Date format YYYY-MM-DD
 * Accepted date range 2000-01-01 to 2099-12-31
 * YYYY-MM-DD must be seperated by [-]
 * @example "2022-01-12" is valid but "2022/01/12" is not
 * Dates must be valid
 * @example "2022-02-31", "2022-04-31" are not valid dates
 */
const snapshotValidationSchema = yup.object({
	date: yup
		.string()
		.required('Date is required')
		.trim()
		.matches(/^20\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/, 'Date must be YYYY-MM-DD')
		.test('valid-date', 'Date must be valid', function(date) {
			return isValid(parse(date, 'yyyy-MM-dd', new Date()));
		})
})

export default snapshotValidationSchema;