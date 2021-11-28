/**
 * Validates a request body to match a given Yup schema
 * @param {Yup Schema} schema
 */
const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export default validate;
