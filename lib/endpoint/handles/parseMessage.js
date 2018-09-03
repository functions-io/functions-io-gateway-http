"use strict";

const urlParse = require("url");
const querystringParse = require("querystring");

/* message interface
message.type
message.context
message.context.http
message.context.security
message.context.client
message.id
message.name
message.version
message.scope
message.stage
message.data
*/

module.exports = function(request){
    try {
        let message = {};
        
        message.type = "invoke";

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

        message.data = request.body;
        if (typeof(message.data) === "string" || message.data instanceof String){
            message.data = JSON.parse(message.data);
        }

        if ((message.data.jsonrpc) && (message.data.params) && (message.data.method)){
            //json rpc
            //example {"jsonrpc": "2.0", "method": "subtract", "params": [42, 23], "id": 1}
            message.id = message.data.params.id;
            message.name = message.data.method;
            message.version = message.data.version || null;
            message.scope = message.data.scope || null;
            message.stage = message.data.stage || null;
            message.data = message.data.params;
        }
        else{
            //command path
            let urlObj = urlParse.parse(request.url);
            let queryObj = querystringParse.parse(urlObj.query);
            message.id = queryObj.id || request.headers["x-request-id"] || null;
            message.name = urlObj.pathname.substring(urlObj.pathname.lastIndexOf("/") + 1);
            message.version = queryObj.version || null;
            message.scope = queryObj.scope || null;
            message.stage = queryObj.stage || null;
        }
        
        return message;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}