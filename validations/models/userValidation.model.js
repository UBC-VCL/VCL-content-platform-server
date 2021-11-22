import * as yup from "yup";
import { USER_TYPES } from "../../helpers/types.js";

const userValidationSchema = yup.object({
  username: yup.string().required(),
  hash: yup.string().required(),
  permissions: yup.string().oneOf(Object.values(USER_TYPES)).required(),
  refresh_token: yup.string().required(),
  access_token: yup.string().required(),
});

export default userValidationSchema;
