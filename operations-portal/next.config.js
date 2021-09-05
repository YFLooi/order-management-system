module.exports = {
  // Note on env variables in Nextjs: They are populated only at build time
  // Hence, save it in a variable if you wanna reuse it later
  env: {
    // NODE_ENV is reserved by Nextjs. Hence, use ENV instead
    // 3 possible ENV values: local, development, prod
    // Ref: https://nextjs.org/docs/api-reference/next.config.js/environment-variables
    ENV: process.env.ENV,
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: "empty",
      };
    }

    return config;
  },
};
