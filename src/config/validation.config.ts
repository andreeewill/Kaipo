import * as Joi from 'joi';

export default Joi.object({
  // Auth0
  AUTH0_BASE_URL: Joi.string().uri().required(),
  AUTH0_CLIENT_ID: Joi.string().required(),
  AUTH0_CLIENT_SECRET: Joi.string().required(),
  AUTH0_REDIRECT_URI: Joi.string().required(),
});
