const { Store } = require("../models");

class MaskController {
  async getMasks(ctx) {
    const { lat, lng, distance = 2 } = ctx.query;
    console.log({ lat, lng, distance });
    const stores = await Store.getStore({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      distance,
    });
    const response = stores.map((store) => store.responseFormatV2());
    ctx.body = response;
  }
}

module.exports = MaskController;
