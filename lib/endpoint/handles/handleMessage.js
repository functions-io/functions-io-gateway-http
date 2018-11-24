"use strict";

const parseMessage = require("./parseMessage");

module.exports = function(request, response, next) {
    try {
        let message;
        let contentType = request.headers["content-type"];
    
        if ((contentType) && (contentType === "application/json")){
            message = parseMessage(request);
        }
        
        if (message && request.handleMessage){
            request.handleMessage(message, function(errProcessEvent, dataResponse){
                //{"jsonrpc": "2.0", "result": 19, "id": 1}
                //{"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null}
                try {
                    let statusCode = 200;
                    let headerObj = {"Content-Type": "application/json", "Cache-Control": "no-store", "Pragma": "no-cache"};
                    let responseObj = null;
    
                    if (errProcessEvent){
                        responseObj = {};
                        responseObj.jsonrpc = "2.0";
                        responseObj.id = message.id || null;
                        responseObj.error = errProcessEvent;
                    }
                    else{
                        responseObj = dataResponse;
                    }

                    if (responseObj instanceof Object){
                        if (responseObj.jsonrpc){
                            //json rpc
                            if (responseObj.error && responseObj.error.stack && responseObj.error.message){
                                let tmpObj = responseObj.error;
                                responseObj.error = {};
                                responseObj.error.code = -32000;
                                responseObj.error.message = tmpObj.message;
                            }
    
                            response.writeHead(statusCode, headerObj);
                            response.write(JSON.stringify(responseObj));
                            response.end();
                        }
                        else{
                            if (responseObj.headers){
                                headerObj = responseObj.headers;
                            }
                            if (responseObj.statusCode){
                                statusCode = responseObj.statusCode;
                            }
    
                            response.writeHead(statusCode, headerObj);
                            if (responseObj.body){
                                if (Buffer.isBuffer(responseObj.body)){
                                    response.write(responseObj.body, "binary");
                                }
                                else{
                                    response.write(responseObj.body);
                                }
                            }
                            else{
                                response.write(JSON.stringify(responseObj));
                            }
                            response.end();
                        }
                    }
                    else{
                        if (Buffer.isBuffer(responseObj)){
                            let headerObj = {"Content-Type": "application/octet-stream", "Content-Length":responseObj.length};
                            response.writeHead(200, headerObj);
                            response.write(responseObj, "binary");
                        }
                        else{
                            response.writeHead(statusCode, headerObj);
                            response.write(responseObj);
                            response.end();
                        }
                    }
                }
                catch (errorTry) {
                    let responseObj = {};
                    responseObj.jsonrpc = "2.0";
                    responseObj.id = message.id || null;
                    responseObj.error = {};
                    responseObj.error.code = -32603; //Internal error
                    responseObj.error.message = errorTry.message;
                    response.writeHead(200, {"Content-Type": "application/json"});
                    response.write(JSON.stringify(responseObj));
                    response.end();
                }
            });
        }
        else{
            next();
        }
    }
    catch (errTry) {
        try {
            let responseObj = {};
            responseObj.jsonrpc = "2.0";
            responseObj.id = message.id || null;
            responseObj.error = {};
            responseObj.error.code = -32603; //Internal error
            responseObj.error.message = errorTry.message;
            response.writeHead(200, {"Content-Type": "application/json"});
            response.write(JSON.stringify(responseObj));
            response.end();
        }
        catch (errTry2) {
            console.error(errTry2);
        }
    }
}