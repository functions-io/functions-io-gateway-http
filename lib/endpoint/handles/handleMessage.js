"use strict";

const externalHandleEvent = require("../../externalHandleEvent");
const parseMessage = require("./parseMessage");

module.exports = function(request, response) {
    let message;
    let contentType = request.headers["content-type"];

    if ((contentType) && (contentType === "application/json")){
        message = parseMessage(request);
    }
    
    if (message){
        externalHandleEvent.handleMessage(message, function(errProcessEvent, dataResponse){
            //{"jsonrpc": "2.0", "result": 19, "id": 1}
            //{"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null}
            try {
                let statusCode = 200;
                let headerObj = {"Content-Type": "application/json", "Cache-Control": "no-store", "Pragma": "no-cache"};
                let responseObj;

                if (errProcessEvent){
                    responseObj = {};
                    responseObj.jsonrpc = "2.0";
                    responseObj.id = message.id || null;
                    if (errProcessEvent instanceof Object){
                        responseObj.error = errProcessEvent;
                    }
                    else{
                        responseObj.error = {};
                        responseObj.error.code = -32000; //Internal error
                        responseObj.error.message = errProcessEvent;
                    }
                }
                else{
                    responseObj = dataResponse;
                }

                if (responseObj instanceof Object){
                    if ((responseObj.jsonrpc) && (responseObj.method)){
                        //json rpc
                        if ((responseObj.error) && (responseObj.error.code)){
                            if (responseObj.error.code === -32600){ //Invalid Request
                                statusCode = 400;
                            }
                            else if (responseObj.error.code === -32601){ //Method not found
                                statusCode = 404;
                            }
                            else if (responseObj.error.code === -32602){ //Invalid params
                                statusCode = 400;
                            }
                            else if (responseObj.error.code === -32603){ //Internal error
                                statusCode = 500;
                            }
                            else if ((responseObj.error.code >= -32000) && (responseObj.error.code >= -32099)){ //Server error
                                statusCode = 500;
                            }
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
                response.writeHead(500, {"Content-Type": "application/json"});
                response.write(JSON.stringify(responseObj));
                response.end();
            }
        });
    }
    else{
        externalHandleEvent.handle(request, response);
    }
}