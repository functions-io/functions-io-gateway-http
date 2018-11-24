"use strict";

module.exports = function(request, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, PUT, DELETE, GET, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

    if (request.method === "OPTIONS"){
        response.statusCode = 200;
        response.end();
    }
    else{
        if (next){
            next();
        }
    }
}