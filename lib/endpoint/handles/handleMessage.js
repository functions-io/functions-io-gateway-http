"use strict";

const externalHandleEvent = require("../../externalHandleEvent");
const parseMessage = require("./parseMessage");

module.exports = function(request, response) {
    let message = parseMessage(request);

    if (message){
        externalHandleEvent.handle(message, function(errProcessEvent, dataResponse){
            try {
                if (errProcessEvent){
                    if (errProcessEvent instanceof Object){
                        //errProcessEvent.code
                        response.writeHead(500, {"Content-Type": "application/json"});
                        response.write(JSON.stringify(errProcessEvent));
                    }
                    else{
                        let responseError = {};
                        responseError.message = errProcessEvent;
                        response.writeHead(500, {"Content-Type": "application/json"});
                        response.write(JSON.stringify(errProcessEvent));
                    }
                }
                else{
                    if (dataResponse){
                        if (Buffer.isBuffer(dataResponse)){
                            let headerObj = {"Content-Type": "application/octet-stream", "Content-Length":dataResponse.length};
                            response.writeHead(200, headerObj);
                            response.write(dataResponse, "binary");
                        }
                        else{
                            if (dataResponse instanceof Object){
                                let statusCode = 200;
                                let headerObj = {"Content-Type": "application/json"};
                                
                                if (dataResponse.http){
                                    if (dataResponse.http.statusCode){
                                        statusCode = dataResponse.statusCode;
                                    }

                                    if (dataResponse.http.headers){
                                        headerObj = dataResponse.headers;
                                    }
                                }
                                
                                response.writeHead(statusCode, headerObj);

                                response.write(JSON.stringify(dataResponse));
                            }
                            else{
                                response.writeHead(200, {"Content-Type": "text/plain"});
                                response.write(dataResponse);
                            }
                        }
                    }
                    else{
                        response.write("{}");
                    }
                }
                response.end();
            }
            catch (errorTry) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(errorTry.toString());
                response.end();
            }
        });
    }
    else{
        response.writeHead(400, {"Content-Type": "text/plain"});
        response.write("Bad Request");
        response.end();
    }
}