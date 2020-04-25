const _ = require("lodash");
const fs = require("fs");
const Router = require("@koa/router");

const getRoutes = () => {
  const routes = fs
    .readdirSync(__dirname)
    .filter((file) => !/^(index|test)/.test(file))
    .map((file) => require(`./${file}`));

  return _.flatten(routes);
};

const getRouter = () => {
  const router = new Router();
  const routes = getRoutes();
  routes.map((route) => {
    const { method, path, handler } = route;
    router[method](path, handler);
  });
  return router;
};
getRouter();

module.exports = {
  getRoutes,
  getRouter,
};
