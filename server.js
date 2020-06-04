const bodyParser = require('body-parser');
const CORS = require('./middlewares/CORS');
const errorHandler = require('./middlewares/error-handler');

const database = require('./config/database');
const authRoutes = require('./routes/auth');

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
    this.app.use(authRoutes);
    this.app.use(errorHandler);
  }

  run() {
    this.app.listen(process.env.SERVER_PORT || 5000);
  }
}

module.exports = Server;
