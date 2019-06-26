const EventEmitter = require('events');
const Debug = require('debug');
const Router = require('koa-router');

const app = require('./app');

/**
 * Abstract class of api-module interface
 * Method mount should be defined
 *
 * @abstract
 */
class Module extends EventEmitter {
  /**
   * Get instance of api-module
   *
   * This method uses name of api-module for
   * getting of unique instance of this api-module.
   *
   * Unique instances of api-modules stores
   * in application instance.
   *
   * @returns {Module}
   */
  static instance () {
    const { modules } = app;
    const { name } = this;
    const module = modules[name];

    if (!module) {
      throw new Error('The module is not yet initialized.');
    }

    return modules[name];
  }

  /**
   * Get application instance.
   *
   * @returns {Application}
   */
  static get app () {
    return app;
  }

  /**
   * Get api-endpoint.
   *
   * For example:
   * For module named 'Example' this method returns '/example'.
   * It means final endpoint for this module will '/api/v1/example'
   *
   * @returns {string}
   */
  static get endpoint () {
    const name = this.name.toLowerCase();
    return `/${name}`;
  }

  /**
   * Creates and initializes new api-module instance.
   *
   * If instance of this api-module instance
   * already exists in the system throws Error.
   *
   * @throws Error
   *
   * @constructor
   */
  constructor () {
    super();
    const { name, endpoint } = this.constructor;
    const { modules } = app;

    const module = modules[name];

    if (module instanceof this.constructor) {
      throw new Error('The module has already been initialized.');
    }

    this.router = new Router({ prefix: endpoint });
    this.debug = Debug(name);

    this.middleware();
    this.mount();

    this.debug('The module was successfully initialized.');
  }

  /**
   * Mount module-specified middleware.
   */
  middleware () {
    const { debug } = this;

    this.router.use(async (ctx, next) => {
      ctx.debug = debug;
      await next();
    });
  }

  /**
   * Wrapper for koa-router method.
   * Read koa-router documentation for more.
   *
   * @returns {Function}
   */
  routes () {
    return this.router.routes();
  }

  /**
   * Method should contains mounting of routes or middleware
   * what api-module requires.
   *
   * Should be realized in child-classes.
   *
   * @abstract
   */
  mount () {
    const name = this.constructor.name;
    const error = `Abstract method 'mount' from class Module is not implemented in class ${name}`;
    throw new Error(error);
  }

}

module.exports = Module;
