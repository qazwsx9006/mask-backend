const { fetchStores } = require("./store");
const { Store } = require("../../models");

async function process() {
  console.log(`[${new Date()}] start update store.`);
  const { features } = await fetchStores();

  for (let feature of features) {
    await updateStore(feature);
  }
  console.log(`[${new Date()}] finish update store.`);
}

async function updateStore(feature) {
  const { type, properties, geometry } = feature;
  const {
    id,
    name,
    phone,
    address,
    available,
    note,
    custom_note,
    service_periods,
  } = properties;
  const { coordinates } = geometry;
  const [lng, lat] = coordinates;

  let store = await Store.findById(id);
  if (!store) store = new Store({ _id: id });
  if (!store.name) store.name = name;
  if (
    !store.location ||
    !store.location.coordinates ||
    !store.location.coordinates[0]
  )
    store.location = { type: "Point", coordinates: [lng, lat] };

  store.condition = getCondition({ note, custom_note });
  store.address = address;
  store.openTime = available;
  store.servicePeriods = service_periods;

  if (store.validateSync()) return console.log("error", feature);

  return store.save();
}

function getCondition({ note, custom_note }) {
  const condition = note || custom_note;
  if (!condition || condition === "-") return {};

  let key = "common";
  if (note.match(/號碼/) && !note.match(/沒有?發?放?號碼/)) key = "number";
  return { [key]: condition };
}

module.exports = {
  process,
};
