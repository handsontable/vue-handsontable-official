/**
 * Custom environment, made specially to work around a bug of the `cssstyle` package, described in https://github.com/jsakas/CSSStyleDeclaration/issues/63.
 *
 * @type {JSDOMEnvironment}
 */
const JSDOMEnvironment = require('jest-environment-jsdom');

class CustomEnvironment extends JSDOMEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();

    Number.prototype.toLowerCase = function() {};
    Number.prototype.split = function() {
      return [];
    };
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = CustomEnvironment;
