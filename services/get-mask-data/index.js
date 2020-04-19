const _ = require("lodash");
const { getData } = require("./mask");
const { Store } = require("../../models");

let nowDate = getTaipeiDate().getDate();

async function process() {
  const {
    currentDate,
    currentHour,
    currentWeekDay,
    todayDate,
  } = currentDateInfo();
  console.log({ nowDate, todayDate, currentHour });
  if (nowDate !== todayDate) {
    nowDate = todayDate;
    await saleLogUpdate(currentDate);
  }
  if (currentHour < 23 && currentHour >= 7) {
    await updateMaskInfo({
      currentDate,
      currentHour,
      currentWeekDay,
      todayDate,
    });
  }
  setTimeout(process, 300000);
}

async function updateMaskInfo({
  currentDate,
  currentHour,
  currentWeekDay,
  todayDate,
}) {
  const maskInfos = await getData();
  const maskChunks = _.chunk(maskInfos, 20);
  for (const maskChunk of maskChunks) {
    await updateMasks(maskChunk, {
      currentDate,
      currentHour,
      currentWeekDay,
      todayDate,
    });
  }
}

async function updateMasks(
  masks,
  { currentDate, currentHour, currentWeekDay, todayDate }
) {
  const result = masks.map((mask) =>
    updateMask(mask, { currentDate, currentHour, currentWeekDay, todayDate })
  );
  return Promise.all(result);
}

async function updateMask(
  mask,
  { currentDate, currentHour, currentWeekDay, todayDate }
) {
  const [
    code,
    name,
    address,
    _phone,
    maskAdult,
    maskChild,
    updatedAt,
  ] = _.values(mask);
  let store = await Store.findById(code);
  if (!store) store = new Store({ _id: code });
  if (!store.name) store.name = name;
  if (!store.address) store.address = address;

  if (store.maskAdult > maskAdult) {
    store.saleLog[currentWeekDay] = store.saleLog[currentWeekDay] || {};
    store.saleLog[currentWeekDay][currentHour] =
      store.saleLog[currentWeekDay][currentHour] || 0;
    store.saleLog[currentWeekDay][currentHour] += store.maskAdult - maskAdult;
    store.saleLog["near"] = {
      time: new Date().getTime(),
      number: store.maskAdult - maskAdult,
    };
    if (maskAdult == 0) store.saleLog[currentWeekDay]["soldOut"] = currentHour;
    store.markModified("saleLog");
  }

  if (maskAdult > store.maskAdult) {
    store.saleLog[currentWeekDay] = store.saleLog[currentWeekDay] || {};
    store.saleLog[currentWeekDay]["add"] = {
      currentHour,
      number: maskAdult - store.maskAdult,
    };

    store.addLog[currentWeekDay] = store.addLog[currentWeekDay] || {};
    store.addLog[currentWeekDay][currentHour] =
      store.addLog[currentWeekDay][currentHour] || 0;
    store.addLog[currentWeekDay][currentHour] += maskAdult - store.maskAdult;

    store.markModified("saleLog");
    store.markModified("addLog");
  }

  store.maskAdult = maskAdult;
  store.maskChild = maskChild;
  store.updatedAt = new Date(`${updatedAt} +0800`);

  if (store.validateSync()) return console.log("error", mask);
  return store.save();
}

function currentDateInfo() {
  const currentDate = getTaipeiDate();
  const currentHour = currentDate.getHours();
  const currentWeekDay = currentDate.getDay();
  const todayDate = currentDate.getDate();
  return { currentDate, todayDate, currentHour, currentWeekDay };
}

function getTaipeiDate() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Taipei" })
  );
}

async function saleLogUpdate(currentDate) {
  console.log(`${new Date()}: start update saleLog`);
  const stores = await Store.find();
  let yesterday = new Date();
  yesterday.setDate(currentDate.getDate() - 1);
  const yesterdayWeekDay = yesterday.getDay();
  const month = yesterday.getMonth() + 1;
  for (const store of stores) {
    const query = { store: store._id, month };
    const log = (await SaleLog.findOne(query)) || new SaleLog(query);
    if (!_.isEmpty(store.saleLog[yesterdayWeekDay])) {
      log.saleLog[yesterday.getDate()] = store.saleLog[yesterdayWeekDay] || {};
      log.markModified("saleLog");
    }
    if (!_.isEmpty(store.addLog[yesterdayWeekDay])) {
      log.addLog[yesterday.getDate()] = store.addLog[yesterdayWeekDay] || {};
      log.markModified("addLog");
    }
    await log.save();
    store.saleLog[yesterdayWeekDay] = {};
    store.addLog[yesterdayWeekDay] = {};
    store.markModified("saleLog");
    store.markModified("addLog");
    await store.save();
  }
  console.log(`${new Date()}: done update saleLog`);
}

module.exports = {
  process,
};
