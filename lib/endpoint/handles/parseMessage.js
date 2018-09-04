"use strict";

const urlParse = require("url");
const querystringParse = require("querystring");

module.exports = function(request){
    try {
        let message = {};
        
        message.jsonrpc = "2.0";
        message.context = {};
        message.context.http = {};
        message.context.http.method = request.method;
        message.context.http.headers = request.headers;
        message.context.security = {};
        if (request.headers["Authorization"]){
            message.context.security.acessToken = request.headers["Authorization"].split(" ")[1];
        }
        else{
            message.context.security.acessToken = "";
        }
        message.context.client = {};
        message.context.client.ip = request.headers["x-forwarded-for"] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;

        if ((request.body instanceof Object) && (request.body.jsonrpc) && (request.body.params) && (request.body.method)){
            //json rpc
            //example {"jsonrpc": "2.0", "method": "subtract", "params": [42, 23], "id": 1}
            message.id = request.body.id;
            message.method = request.body.method;
            message.version = request.body.version || null;
            message.scope = request.body.scope || null;
            message.params = request.body.params;
        }
        else{
            //command path
            let urlObj = urlParse.parse(request.url);
            let queryObj = querystringParse.parse(urlObj.query);
            message.id = queryObj.id || request.headers["x-request-id"] || null;
            message.method = urlObj.pathname.substring(urlObj.pathname.lastIndexOf("/") + 1);
            message.version = queryObj.version || null;
            message.scope = queryObj.scope || null;
            message.params = request.body;
        }
        
        return message;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}