const fs = require("fs");
const neatCsv = require("neat-csv");
const https = require("https");

async function getData() {
  const url = "https://data.nhi.gov.tw/resource/mask/maskdata.csv";
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream("./maskdata.csv");
    https.get(url, (response) => {
      let stream = response.pipe(file);

      stream.on("finish", async function () {
        const r = fs.readFileSync("./maskdata.csv");
        const data = await neatCsv(r);
        resolve(data);
      });
    });
  });
}

module.exports = {
  getData,
};
