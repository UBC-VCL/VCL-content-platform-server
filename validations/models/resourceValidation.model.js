import * as yup from "yup";

const resourceValidationSchema = yup.object({
  title: yup.string().required(),
  description: yup.string(),
  category: yup.string().required(),
  owner: yup.string().required(),
  resource_link: yup.string().required(),
});

export default resourceValidationSchema;
