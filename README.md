# cron-job-font

> A Vue.js project

## Installation

``` bash
# Git Clone Project
git clone https://github.com/zesani/iot-cronjob.git

# Cd project
cd iot-cronjob

# Create config/prod.env.js
module.exports = {
  NODE_ENV: '"production"',
  FIREBASE_APIKEY: '"{Firebase api key}"',
  SPEECH_APIKEY: '"{Google SPEECH api key}"',
  NETPIE_APPID: '"{NETPIE APPID}"',
  NETPIE_APPKEY: '"{NETPIE APPKEY}"',
  NETPIE_APPSECRET: '"{NETPIE APPSECRET}"'
}

# install dependencies
npm install || yarn

# serve with hot reload at localhost:8080
npm run dev || yarn dev

# build for production with minification
npm run build || yarn build

# server Cron Job
cd iot-cronjob/server

# install dependencies
npm install || yarn

# Download service.json setup firebase
https://firebase.google.com/docs/admin/setup

# start server
node index.js
```
