const cogmq = require('cogmq').default;
const assert = require('assert');

module.exports = class Application {
  constructor(options) {
    this.options = options;
    if (typeof options === 'string') {
      this.options = { queue: options };
      return ;
    }

    this.server = new cogmq.Server(this.options);
    assert(typeof options === 'object');
  }

  attachWorkers() {
    let workerCount = this.options.workerCount || 1;
    while(workerCount--) {
      this.server.addWorker((msg) => {
        const action = msg.action;
        if (!this[action]) {
          throw new Error(`No ${action} method found in ${this.constructor.name}.`);
        }
        return this[action](msg.content);
      });
    }
  }

  stop() {
    this.server.stop();
  }
};