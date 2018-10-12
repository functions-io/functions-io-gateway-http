"use strict";

module.exports = function(request, response, next) {
    let body = [];
        
    request.on("data", function(chunk) {
        body.push(chunk);
    }).on("end", function() {
        try {
            body = Buffer.concat(body);

            let contentType = request.headers["content-type"] || null;
            
            if ((contentType) && (contentType === "application/json")){
                try {
                    body = JSON.parse(body);
                }
                catch (errTryParse) {
                    response.writeHead(400, {"Content-Type": "text/plain"});
                    response.write("Parse error");
                    response.end();
                    return;
                }
            }
    
            request.contentType = contentType;
            request.body = body;
            
            next();            
        }
        catch (errTry) {
            try {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(errTry.message);
                response.end();
            }
            catch (errTry2) {
                console.error(errTry2);
            }
        }
    });
}