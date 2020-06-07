const bodyParser = require('body-parser');
const CORS = require('./middlewares/CORS');
const database = require('./config/database');

const errorHandler = require('./middlewares/error-handler');
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
    this.app.use('/auth', authRoutes);
    this.app.use(errorHandler);
  }

  run(port) {
    this.app.listen(port);
  }
}

module.exports = Server;
