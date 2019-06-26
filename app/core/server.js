const https = require('https');
const fs = require('fs');
const { Url, format } = require('url');

/**
 * Extended HTTPS-server
 * It uses env-data for self-configuration.
 *
 * process.env should contains:
 * HTTP_PORT - port number
 * HTTP_HOST - host name
 * HTTPS_CERT - path to SSL-certificate
 * HTTPS_KEY - path to SSL-key
 */
class Server extends https.Server {
  /**
   * Build and run new server instance.
   *
   * @param {Function} handler - request handler
   * @param {{error: Function, log: Function}} logger - logger instance.
   * @returns {Server}
   */
  static buildAndRun (handler, logger) {
    const server = new Server(handler);

    server.on('error', logger.error);

    server.listen(() => {
      const address = server.getAddressString();
      logger.log(`Server listen ${address}`);
    });

    return server;
  }

  /**
   * This constructor reads SSL-certificates and creates
   * new HTTP-server instance.
   *
   * @constructor
   * @param {Function} callback - request handling function.
   */
  constructor (callback) {
    const { HTTPS_CERT, HTTPS_KEY } = process.env;

    const options = {
      cert: fs.readFileSync(HTTPS_CERT),
      key: fs.readFileSync(HTTPS_KEY),
    };

    super(options, callback);
  }

  /**
   * Connect server to port and host from env.
   * The callback function will be called after connection.
   *
   * @param {Function} callback - callback function.
   */
  listen (callback) {
    const { HTTPS_HOST, HTTPS_PORT } = process.env;
    super.listen(HTTPS_PORT, HTTPS_HOST, callback);
  }

  /**
   * Get server address as string
   *
   * @returns {String}
   */
  getAddressString () {
    const { address: hostname, port } = this.address();

    const url = new Url();
    url.protocol = 'https';
    url.hostname = hostname;
    url.port = port;

    return format(url);
  }

}

module.exports = Server;
