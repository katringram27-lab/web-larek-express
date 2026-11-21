import { Joi } from '../middlewares/validation';

const createProductValidation = Joi.object({
  title: Joi.string()
    .min(2)
    .max(30)
    .required(),

  image: Joi.object({
    fileName: Joi.string().required(),
    originalName: Joi.string().required(),
  }).required(),

  category: Joi.string().required(),

  description: Joi.string()
    .allow('')
    .optional(),

  price: Joi.number()
    .allow(null)
    .optional(),
});

export default createProductValidation;
