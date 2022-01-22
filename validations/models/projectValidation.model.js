import * as yup from "yup";

const projectValidationSchema = yup.object({
  name: yup.string().required(),
  description: yup.string(),
  members: yup.array().of(yup.string()),
  isActive: yup.boolean(),
});

export default projectValidationSchema;
