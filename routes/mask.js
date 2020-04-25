const MaskController = require("../controllers/mask");
const maskController = new MaskController();

module.exports = [
  {
    method: "get",
    path: "/v2/masks",
    handler: maskController.getMasks,
  },
];
