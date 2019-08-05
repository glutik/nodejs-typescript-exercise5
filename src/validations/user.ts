import joi from 'joi';

export const userSchema = joi.object().keys({
  name: joi.string().min(3).required(),
});
