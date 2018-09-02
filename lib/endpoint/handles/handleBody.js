"use strict";

module.exports = function(request, response, next) {
    let body = [];
        
    request.on("data", function(chunk) {
        body.push(chunk);
    }).on("end", function() {
        body = Buffer.concat(body);

        request.body = body;
        
        next();
    });
}