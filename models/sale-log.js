const _ = require("lodash");
const mongoose = require("mongoose");

const getModels = function() {
  const definition = {
    store: { type: String, require: true, ref: "Store" },
    saleLog: { type: Object, default: {} },
    addLog: { type: Object, default: {} },
    month: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now }
  };
  let schema = new mongoose.Schema(definition);

  return mongoose.model("SaleLog", schema, "saleLogs");
};

module.exports = getModels;
