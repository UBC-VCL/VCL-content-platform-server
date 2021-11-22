import * as yup from "yup";
import { USER_TYPE_NAMES } from "../../helpers/types.js";

const userValidationSchema = yup.object({
  username: yup.string().required(),
  hash: yup.string().required(),
  permissions: yup.string().oneOf(USER_TYPE_NAMES).required(),
  refresh_token: yup.string().required(),
  access_token: yup.string().required(),
});

export default userValidationSchema;
