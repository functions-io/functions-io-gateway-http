"use strict";

const config = require("./config");
const ecstatic = require("ecstatic");

var ecstaticHandle = null;

module.exports.handle = function(request, response){
    if (config.publicDir){
        if (ecstaticHandle === null){
            ecstaticHandle = ecstatic({root: config.publicDir, showDir: true, autoIndex: true});
        }
        ecstaticHandle(request, response);
    }
    else{
        var html = "<html><body><h1>FUNCTIONS-IO GATEWAY HTTP</h1></body></html>";
        response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        response.write(html);
        response.end();
    }
}

module.exports.handleMessage = function(message, callBack){
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
    console.log(message);
    callBack("external handle JSON not implemented");
}