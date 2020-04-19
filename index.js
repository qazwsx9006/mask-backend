const { process } = require("./services/get-mask-data/index.js");

async function foo() {
  await process();
}
foo();
