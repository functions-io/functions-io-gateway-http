const path = require("path");
const config = {};

config.cert = {};
config.cert.key = path.resolve(__dirname, "../data", "key.pem");
config.cert.pub = path.resolve(__dirname, "../data", "cert.pem");
config.cert.passphrase = "1234";
config.endPoint = {};
config.endPoint.http = {};
config.endPoint.http.port = 8080;
config.endPoint.http.enable = true;
config.endPoint.https = {};
config.endPoint.https.port = 8443;
config.endPoint.https.enable = true;

module.exports = config;