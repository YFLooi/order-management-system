import _ from 'lodash';

export enum NodeEnvironments {
  PROD = 'prod',
  DEVELOPMENT = 'development',
  LOCAL = 'local',
}

namespace ServerConfig {
  // * Database Connection
  const NODE_ENV: string = process.env.NODE_ENV
    ? process.env.NODE_ENV
    : 'local';

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

  export function getPaymentAppBaseUrl(): Readonly<string> {
    if (isProduction()) {
      return 'https://payment.app.com';
    } else if (isDevelopment()) {
      return 'https://payment.dev.app.com';
    }
    return 'http://localhost:3400';
  }

  export function getOrderAppBaseUrl(): Readonly<string> {
    if (isProduction()) {
      return 'https://orders.app.com';
    } else if (isDevelopment()) {
      return 'https://orders.dev.app.com';
    }
    return 'http://localhost:3200';
  }
}

export default ServerConfig;
