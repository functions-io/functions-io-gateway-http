"use strict";

const urlParse = require("url");
const querystringParse = require("querystring");

module.exports = function(request){
    try {
        let message = {};
        
        message.jsonrpc = "2.0";
        message.context = {};
        message.context.http = {};
        message.context.http.method = request.method;
        message.context.http.url = request.url;
        message.context.http.headers = request.headers;
        message.context.http.contentType = request.headers["content-type"] || null;

        message.context.security = {};

        /*
        https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication
        
        Basic (see RFC 7617, base64-encoded credentials. See below for more information.),
        Bearer (see RFC 6750, bearer tokens to access OAuth 2.0-protected resources),
        Digest (see RFC 7616, only md5 hashing is supported in Firefox, see bug 472823 for SHA encryption support),
        HOBA (see RFC 7486 (draft), HTTP Origin-Bound Authentication, digital-signature-based),
        Mutual (see draft-ietf-httpauth-mutual),
        AWS4-HMAC-SHA256 (see AWS docs).
        */

        if (request.security){
            message.context.security = request.security;
        }
        else{
            if (request.headers["authorization"]){
                let values = request.headers["authorization"].split(" ");
                message.context.security.type = values[0];
                message.context.security.credentials = values[1] || null;
            }
            else{
                message.context.security.type = null;
                message.context.security.credentials = "";
            }
        }
        message.context.client = {};
        message.context.client.ip = request.headers["x-forwarded-for"] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;

        message.id = request.headers["x-request-id"] || null;

        if ((request.body instanceof Object) && (request.body.jsonrpc) && (request.body.method)){
            //json rpc
            //example {"jsonrpc": "2.0", "method": "subtract", "params": [42, 23], "id": 1}
            if (request.body.id){
                message.id = request.body.id;
            }
            message.method = request.body.method;
            message.version = request.body.version || null;
            message.scope = request.body.scope || null;
            message.params = request.body.params || [];
        }
        else{
            message.method = null;
            message.version = null;
            message.scope = null;
            message.params = request.body;
        }
        
        return message;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}