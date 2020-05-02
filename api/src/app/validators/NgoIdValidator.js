import { celebrate, Segments, Joi } from 'celebrate';

export default celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    ngo_id: Joi.string().required(),
  }),
});
