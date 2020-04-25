const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const { getRouter } = require("./routes");
const { Store } = require("./models");
const app = new Koa();
const router = getRouter();

app.use(cors());
app.use(bodyParser());
app.use(router.routes());

const server = app.listen(3000, async () => {
  console.log(`Server listening on port ${3000}`);
});
