/**
 * Extends context with custom field.
 *
 * @param {*} fields - custom fields object.
 * @returns {Function}
 */
function extendContext (fields) {
  return async function (ctx, next) {
    Object.assign(ctx, fields);
    await next();
  };
}

/**
 * Api requests logger
 *
 * @param {*} ctx - koa context
 * @param {Function} next - next handler
 * @returns {Promise<void>}
 */
async function requestLogger (ctx, next) {
  const { method, url, logger } = ctx;
  logger.log(`Request ${method} ${url}`);
  await next();
}

/**
 * Extends context with parsed request body.
 *
 * @param {*} ctx - koa context
 * @param {Function} next - next handler
 * @returns {Promise<void>}
 */
async function copyBody (ctx, next) {
  const { body } = ctx.request;

  ctx.body = body;

  await next();
}

module.exports = {
  extendContext,
  requestLogger,
  copyBody,
};
