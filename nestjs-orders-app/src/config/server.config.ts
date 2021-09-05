import _ from 'lodash';

export enum NodeEnvironments {
  PROD = 'prod',
  DEVELOPMENT = 'development',
  LOCAL = 'local',
}

let mongoCredentialsFromKeyFile: { username: string; password: string };
try {
  mongoCredentialsFromKeyFile = require('../../keys/mongo.json');
} catch (err) {
  console.error('could not read mongo key file');
}

namespace ServerConfig {
  // * Database Connection
  const NODE_ENV: string = process.env.NODE_ENV
    ? process.env.NODE_ENV
    : 'local';
  const DB_NAME = 'order-management-app';

  // * Check is production
  export function isProduction(): Readonly<boolean> {
    return NODE_ENV === 'prod';
  }

  export function isDevelopment(): Readonly<boolean> {
    return NODE_ENV === 'development';
  }

  // * Check is local
  export function isLocal(): Readonly<boolean> {
    return NODE_ENV === 'local';
  }

  // * Get Database Connection
  export function constructMongoConnection({
    dbUserName = mongoCredentialsFromKeyFile.username,
    dbPassword = mongoCredentialsFromKeyFile.password,
    dbName = DB_NAME,
  }: {
    dbUserName?: string;
    dbPassword?: string;
    dbName?: string;
  }): Readonly<string> {
    return `mongodb+srv://${dbUserName}:${dbPassword}@sandbox.9xeet.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  }

  export function getPaymentAppBaseUrl(): Readonly<string> {
    if (isProduction()) {
      return 'https://orders.app.com';
    } else if (isDevelopment()) {
      return 'https://orders.dev.app.com';
    }
    return 'http://localhost:3200';
  }

  export function getOrderAppBaseUrl(env: NodeEnvironments): Readonly<string> {
    if (isProduction()) {
      return 'https://orders.app.com';
    } else if (isDevelopment()) {
      return 'https://orders.dev.app.com';
    }
    return 'http://localhost:3200';
  }
}

export default ServerConfig;
