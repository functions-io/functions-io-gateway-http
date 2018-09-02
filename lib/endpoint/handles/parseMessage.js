"use strict";

const urlParse = require("url");
const querystringParse = require("querystring");

module.exports = function(request){
    try {
        let message = {};
        let urlObj = urlParse.parse(request.url);
        let queryObj = querystringParse.parse(urlObj.query);
        
        message.type = "invoke";
        message.context = {};
        message.context.http = {};
        message.context.http.method = request.method;
        message.context.http.headers = request.headers;
        message.data = request.body;

        message.name = urlObj.pathname.substring(urlObj.pathname.lastIndexOf("/") + 1);
        message.version = queryObj.version || null;
        message.scope = queryObj.scope || null;

        return message;
    }
    catch (error) {
        return null;
    }
}