   
const Joi = require('joi');

const ErrorService = require('../../services/error');

const paginationSchema = {
  page: Joi.number().required(),
  size: Joi.number().required(),
};

const getProductListScheme = {
  ...paginationSchema,
  atcCode: Joi.string().optional(),
  groupId: Joi.number().optional(),
};

const getDocumentsListScheme = {
  ...paginationSchema,
  productId: Joi.number().optional(),
};

const validateParams = (ctx, schema) => {
  const { error } = Joi.validate(ctx.query, schema);
  if (error) {
    ErrorService.throw(400, error.details.map(element => element.message));
  }
};

const validatePaginationSchema = async (ctx, next) => {
  validateParams(ctx, paginationSchema);
  await next();
};

const validateGetProductListSchema = async (ctx, next) => {
  validateParams(ctx, getProductListScheme);
  await next();
};

const validateGetDocumentsListSchema = async (ctx, next) => {
  validateParams(ctx, getDocumentsListScheme);
  await next();
};

module.exports = {
  validatePaginationSchema,
  validateGetProductListSchema,
  validateGetDocumentsListSchema,
};