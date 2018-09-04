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
                let headerObj = {"Content-Type": "application/json"};
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
                        responseObj.error.code = -32000; //Server error
                        responseObj.error.message = errProcessEvent;
                    }
                }
                else{
                    responseObj = dataResponse;
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