class Error400 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.status = 400;
    this.message = message || 'Parameters are missing or invalid.';
  }

  get name() {
    return 'Error400';
  }
}

module.exports = Error400;
