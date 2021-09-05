import ServerConfig from '@src/config/server.config';
import * as mongoose from 'mongoose';

namespace Database {
  // * Init Database connection
  export function init() {
    const mongoConnectionString = ServerConfig.constructMongoConnection({});
    mongoose.connect(mongoConnectionString, {
      readPreference: 'primaryPreferred',
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      connectTimeoutMS: 600000,
      socketTimeoutMS: 600000,
      useUnifiedTopology: true,
    });

    console.log('Connected to ' + mongoConnectionString);
    if (!ServerConfig.isProduction()) {
      mongoose.set('debug', true);
    }
  }

  const db = mongoose.connection;

  // Bind connection to error event (to get notification of connection errors)
  // db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.on('error', () => console.error('MongoDB connection error'));
  db.on('reconnectFailed', () => console.error('Failed to reconnect to DB.'));
  db.on('connecting', function () {
    console.log('Connecting to MongoDB...');
  });

  db.on('error', function (error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
  });
  db.on('connected', function () {
    console.error('MongoDB connected!');
  });
  db.once('open', function () {
    console.error('MongoDB connection opened!');
  });
  db.on('reconnected', function () {
    console.error('MongoDB reconnected!');
  });
  db.on('disconnected', function () {
    console.error('MongoDB disconnected!');
    init();
  });
}

export default Database;
