const Application = require('./application');

/**
 * Create an application instance
 */
function createApp() {
    return new Application();
}

module.exports = createApp;
module.exports.Application = Application;
