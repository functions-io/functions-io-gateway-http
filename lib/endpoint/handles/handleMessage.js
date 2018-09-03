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
                let responseObj = {};
                let statusCode = 200;
                let headerObj = {"Content-Type": "application/json"};

                responseObj.jsonrpc = "2.0";
                responseObj.id = message.id || null;
                if (errProcessEvent){
                    if (errProcessEvent instanceof Object){
                        responseObj.error = errProcessEvent;
                    }
                    else{
                        responseObj.error = {};
                        responseObj.error.code = -32000; //Server error
                        responseObj.error.message = errProcessEvent;
                    }
                }
                else{
                    if (dataResponse){
                        if (Buffer.isBuffer(dataResponse)){
                            headerObj = {"Content-Type": "application/octet-stream", "Content-Length":dataResponse.length};
                            response.writeHead(200, headerObj);
                            response.write(dataResponse, "binary");
                            return;
                        }
                        else{
                            if (dataResponse instanceof Object){
                                if (dataResponse._http){
                                    if (dataResponse._http.statusCode){
                                        statusCode = dataResponse._http.statusCode;
                                    }

                                    if (dataResponse._http.headers){
                                        headerObj = dataResponse._http.headers;
                                    }
                                }
                                responseObj.result = dataResponse;
                            }
                            else{
                                responseObj.result = dataResponse;
                            }
                        }
                    }
                    else{
                        responseObj.result = null;
                    }
                }
                response.writeHead(statusCode, headerObj);
                response.write(JSON.stringify(responseObj));
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
        externalHandleEvent.handle(request, response);
    }
}