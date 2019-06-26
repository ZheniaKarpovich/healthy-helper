const Error400 = require('./errors/400');

const errors = {
  400: Error400,
};

class ErrorService {
  static handle() {
    return async (ctx, next) => {
      try {
        await next();
      } catch (error) {
        const status = error.statusCode || error.status || 500;
        console.error(status, error.message, error);

        ctx.status = status;
        ctx.body = Array.isArray(error.message) ? { error: error.message } : { error: ctx.i18n.__(error.message) };
      }
    };
  }

  static throw(code, message = 'Entity was not found.') {
    if (errors[code]) {
      throw new errors[code](message);
    } else {
      throw new Error(message);
    }
  }
}

module.exports = ErrorService;
