const bodyParser = require('body-parser');
const CORS = require('./middlewares/CORS');
const database = require('./config/database');
const errorHandler = require('./middlewares/error-handler');
const authRoutes = require('./routes/auth');

const routes = [authRoutes];

class Server {
  constructor(express) {
    this.express = express;
    this.app = this.express();
  }

  initDatabase() {
    return database.sync({ /* force: true */ });
  }

  setMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(CORS);
  }

  setRoutes() {
    routes.forEach((route) => this.app.use(route));
    this.app.use(errorHandler);
  }

  run() {
    this.app.listen(process.env.SERVER_PORT || 5000);
  }
}

module.exports = Server;
