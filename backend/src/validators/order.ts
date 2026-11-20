import { Joi } from '../middlewares/validation';

const createOrderValidation = Joi.object({
  payment: Joi.string()
    .valid('card', 'online')
    .required(),

  email: Joi.string()
    .email()
    .required(),

  phone: Joi.string()
    .pattern(/^\+?[0-9\s\-()]{10,20}$/)
    .required(),

  address: Joi.string()
    .min(5)
    .required(),

  total: Joi.number()
    .min(0)
    .required(),

  items: Joi.array()
    .items(
      Joi.string().hex().length(24),
    )
    .min(1)
    .required(),
});

export default createOrderValidation;
