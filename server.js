const net = require('net');
const assert = require('assert');

module.exports = class Server {
  constructor(applications = [], portOnStart = false) {
    this.applications = applications;
    this.onStart = () => undefined;

    if (portOnStart) {
      assert(typeof portOnStart === 'number');
      this.onStart = () => {
        // create a server instance, once there is a connection being made to this port
        // close it directly
        const server = net.createServer(socket => {
          socket.write('pong');
          socket.destroy();
          setImmediate(() => server.close());
        });
        server.listen(portOnStart);
      }
    }
  }

  addApplication(application) {
    this.applications.push(application);
  }

  start() {
    this.applications.forEach(application => application.attachWorkers());
    this.onStart();
  }

  stop() {
    return Promise.all(this.applications.map(application => application.stop()));
  }

};
