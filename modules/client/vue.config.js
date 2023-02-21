const path = require("path");
const clientNodeModules = path.resolve(__dirname, "./node_modules");
const sharedNodeModules = path.resolve(__dirname, "../shared/node_modules");

const clientSrc = path.resolve(__dirname, "src");
const sharedSrc = path.resolve(__dirname, "../shared/src");

module.exports = {
  configureWebpack: {
    resolve: {
      modules: [clientNodeModules, sharedNodeModules],
      alias: {
        "@shared": sharedSrc,
        "@client": clientSrc,
      },
    },
  },
};
