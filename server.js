
module.exports = class Server {
  constructor(applications = []) {
    this.applications = applications;
  }

  addApplication(application) {
    this.applications.push(application);
  }

  start() {
    this.applications.forEach(application => application.attachWorkers());
  }

  stop() {
    return Promise.all(this.applications.map(application => application.stop()));
  }

};
