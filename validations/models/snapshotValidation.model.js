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
    .required("Date is required")
    .trim()
    .matches(/^20\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/, 'Invalid date')
    .test('valid-date', 'Invalid date', function(date) {
        const year = date.substring(0, 4);
        const month = date.substring(5, 7);
        const day = date.substring(8, 10);
        const parsed = parse(`${day}.${month}.${year}`, "dd.MM.yyyy", new Date());

        return isValid(parsed);
    })
})

export default snapshotValidationSchema;