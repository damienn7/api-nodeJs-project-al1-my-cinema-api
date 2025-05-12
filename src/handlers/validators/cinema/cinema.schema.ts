import Joi from 'joi';

export const cinemaSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  image: Joi.string().uri().required(),
  type: Joi.string().valid('2D', '3D', 'IMAX').required(),
  capacity: Joi.number().integer().min(15).max(30).required(),
  isAccessible: Joi.boolean().required(),
});

export const cinemaUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().min(10).max(500),
  image: Joi.string().uri(),
  type: Joi.string().valid('2D', '3D', 'IMAX'),
  capacity: Joi.number().integer().min(15).max(30),
  isAccessible: Joi.boolean(),
  status: Joi.string().valid('AVAILABLE', 'MAINTENANCE')
});

export const scheduleQuerySchema = Joi.object({
  start: Joi.date().iso().required(),
  end: Joi.date().iso().required(),
});
