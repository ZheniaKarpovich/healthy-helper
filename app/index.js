const app = require('./core/app');
const auth = require('./modules/auth');
const medicines = require('./modules/medicines');

const modules = [ auth, medicines ];

try {
  app.register(modules).listen();
} catch (e) {
  app.logger.error(e);
}
