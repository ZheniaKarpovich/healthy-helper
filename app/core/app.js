require('dotenv').config();

const http = require('http');

const Koa = require('koa');
const Router = require('koa-router');
const passport = require('koa-passport');
const bodyParser = require('koa-bodyparser');

const connection =require('./db');
// const Server = require('./server');

const {
  extendContext,
  requestLogger,
  copyBody,
} = require('./middleware');

/**
 * Root application class.
 * Describes base architectural layer of application core.
 * Wraps Koa and realizes module-based architecture.
 */
class Application extends Koa {

  /**
   * Creates and initializes new instance of application.
   * Mounts core middleware
   *
   * @constructor
   */
  constructor () {
    const { API_ROOT } = process.env;

    super();

    connection();

    this.router = new Router({ prefix: API_ROOT });
    this.modules = {};
    this.logger = console;
    this.server = null;

    this.coreMiddleware();
  }

  /**
   * Registration of modules in application.
   *
   * Creates and initialises single instance for every api-module.
   * Mounts routes of modules to api-root endpoint.
   *
   * @param {[Module]} modules - api-module classes for registration.
   * @returns {Application}
   */
  register (modules = []) {
    for (let Module of modules) {
      const { name } = Module;
      const module = new Module();
      const routes = module.routes();

      this.router.use(routes);
      this.modules[name] = module;
    }

    return this;
  }

  /**
   * Mounts core middleware
   *
   * @returns {Application}
   */
  coreMiddleware () {
    const { logger, router } = this;
    const withLogger = extendContext({ logger });

    router.use(bodyParser());
    router.use(copyBody);
    router.use(withLogger);
    router.use(requestLogger);
    router.use(passport.initialize());

    return this;
  }

  /**
   * Create and run HTTPS-server
   *
   * Mounts koa-router ta application,
   * creates new HTTPS-server and runs it.
   *
   * @returns {Application}
   */
  listen () {
    const { router, logger } = this;
    const { PORT } = process.env;
    const routes = router.routes();
    const allowedMethods = router.allowedMethods();
    const handler = this.callback();

    this.use(routes);
    this.use(allowedMethods);

    const server = http.createServer(handler);

    server.on('error', logger.error);

    server.listen(PORT, () => {
      console.log(`Server started on ${PORT}`);
    });

    this.server = server;

    return this;
  }

}

module.exports = new Application;
