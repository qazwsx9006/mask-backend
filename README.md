# 口罩幫手 - 後端 api server

2/6 政府開放口罩 api 後，便嘗試撰寫一個口罩地圖服務除了練習相關技術外。更希望在自己能力所及的範圍上，能夠對社會產生幫助。

### 使用到的技術

#### server 語言

使用 nodejs 並使用 koa 框架開發 api-server 。資料庫使用 MongoDB Atlas 的免費方案。透過 mongoose ODM 來操作 mongoDB 。 Server 選擇架設在 Vultr VPS 上。因為 Vultr 最便宜的的主機只需要 $2.5鎂/月。(現在最便宜似乎只有 $3.5 鎂)。伺服器部署採用 pm2 以及 nginx。SSL 憑證使用 [Let’s Encrypt](https://letsencrypt.org/zh-tw/)。

#### 資料庫

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free plan.
- [mongoose](https://mongoosejs.com/)

#### deploy

- [Vultr](https://www.vultr.com/) 歡迎透過我的[邀請連結註冊](https://www.vultr.com/?ref=6847159) ，讓我省下 3 個月的伺服器費用！

#### ssl certificate

- [Let’s Encrypt](https://letsencrypt.org/)

### 口罩幫手前端 web 專案參考

- [https://github.com/qazwsx9006/mask](https://github.com/qazwsx9006/mask)

資料來源

- [特約藥局與成人、兒童口罩庫存數量查詢系統](https://www.nhi.gov.tw/Content_List.aspx?n=395F52D193F3B5C7&topn=787128DAD5F71B1A)
- [藥局+衛生所即時庫存 geojson by kiang](https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json)

**#臺灣加油**
