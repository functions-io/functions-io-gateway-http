"use strict";

const ecstatic = require("ecstatic");
var ecstaticHandle = null;

module.exports = function(request, response, next) {
    if (request.configWeb && request.configWeb.enabled && request.configWeb.ecstatic){
        if (ecstaticHandle === null){
            ecstaticHandle = ecstatic(request.configWeb.ecstatic);
        }
        ecstaticHandle(request, response);
    }
    else{
        var html = "<html><body><h1>PAGE NOT FOUND</h1></body></html>";
        response.writeHead(404, {"Content-Type": "text/html; charset=utf-8"});
        response.write(html);
        response.end();
    }
}