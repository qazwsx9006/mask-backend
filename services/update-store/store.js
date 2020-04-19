const https = require("https");

async function fetchStores() {
  const url =
    "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json";
  const data = await getData({ url });
  return data;
}

function getData(params = {}) {
  const url = params.url;
  return new Promise((resolve, reject) => {
    const request = https.get(url, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", async () => {
        const data = JSON.parse(body);
        resolve(data);
      });
    });
    request.on("error", (err) => reject(err));
  });
}

module.exports = {
  fetchStores,
  getData,
};
