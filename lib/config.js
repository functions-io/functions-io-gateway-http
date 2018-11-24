"use strict";

const config = {};

config.web = {};
config.web.enabled = true;
config.web.ecstatic = {};
config.web.ecstatic.root = "html";
config.web.ecstatic.showDir = true;
config.web.ecstatic.autoIndex = true;
config.web.folder = "html";
config.http = {};
config.http.enabled = true;
config.http.port = 8080;
config.https = {};
config.https.enabled = true;
config.https.port = 8443;
config.https.key = "key.pem";
config.https.cert = "cert.pem";
config.https.passphrase = "1234";
config.listMiddlewareHTTP = ["./handles/handleCORS", "./handles/handleBody", "./handles/handleMessage", "./handles/handleHTML"];
config.headers = {};

//config.headers["Access-Control-Allow-Headers"] = "Content-Type, api_key, Authorization, x-requested-with, Total-Count, Total-Pages, Error-Message";
//config.headers["Access-Control-Allow-Methods"] = "POST, GET, DELETE, PUT, OPTIONS";
//config.headers["Access-Control-Allow-Origin"] = origin;

module.exports = config;