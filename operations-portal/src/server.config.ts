export enum NodeEnvironments {
  PROD = "prod",
  DEVELOPMENT = "development",
  LOCAL = "local",
}

namespace ServerConfig {
  // * Database Connection
  const ENV: string = process.env.ENV ? process.env.ENV : "local";
  const DB_NAME = "order-management-app";

  // * Check is production
  export function isProduction(): Readonly<boolean> {
    return ENV === "prod";
  }

  export function isDevelopment(): Readonly<boolean> {
    return ENV === "development";
  }

  // * Check is local
  export function isLocal(): Readonly<boolean> {
    return ENV === "local";
  }

  export function getPaymentAppBaseUrl(): Readonly<string> {
    if (isProduction()) {
      return "https://orders.app.com";
    } else if (isDevelopment()) {
      return "https://orders.dev.app.com";
    }
    return "http://localhost:3200";
  }

  export function getOrderAppBaseUrl(env: NodeEnvironments): Readonly<string> {
    if (isProduction()) {
      return "https://orders.app.com";
    } else if (isDevelopment()) {
      return "https://orders.dev.app.com";
    }
    return "http://localhost:3200";
  }
}

export default ServerConfig;
