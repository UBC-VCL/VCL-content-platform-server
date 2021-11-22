import * as yup from "yup";
import userValidationSchema from "./userValidation.model.js";

const projectValidationSchema = yup.object({
  name: yup.string().required(),
  description: yup.string(),
  members: yup.array().of(userValidationSchema),
  isActive: yup.boolean(),
});

export default projectValidationSchema;
