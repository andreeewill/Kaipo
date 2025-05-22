import * as Joi from 'joi';

export default Joi.object({
  // Database
  DB_TYPE: Joi.string().valid('mysql', 'postgres').required(),
  DB_HOST: Joi.string().hostname().required(),
  DB_PORT: Joi.number().port().required(),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),

  // Auth0
  AUTH0_BASE_URL: Joi.string().uri().required(),
  AUTH0_CLIENT_ID: Joi.string().required(),
  AUTH0_CLIENT_SECRET: Joi.string().required(),
  AUTH0_REDIRECT_URI: Joi.string().required(),

  // Resend
  RESEND_API_KEY: Joi.string().required(),
  RESEND_FROM: Joi.string().required(),
});
