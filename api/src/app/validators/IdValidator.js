import { celebrate, Segments, Joi } from 'celebrate';

export default celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  }),
});
