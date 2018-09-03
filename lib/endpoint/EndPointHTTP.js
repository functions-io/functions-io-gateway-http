"use strict";

const http = require("http");
const https = require("https");
const fs = require("fs");
const ProcessHTTP = require("./ProcessHTTP");

var EndPointHTTP = function(p_config){
    this.config = p_config;
    this.server = null;

    const processHTTP = new ProcessHTTP();

    /*
    function appendCORSHeaders(headers, origin){
        if ((headers === undefined) || (headers === null)){
            headers = {};
        }
        if ((origin === undefined) || (origin === null)){
            origin = "*";
        }
        headers["Access-Control-Allow-Headers"] = "Content-Type, api_key, Authorization, x-requested-with, Total-Count, Total-Pages, Error-Message";
        headers["Access-Control-Allow-Methods"] = "POST, GET, DELETE, PUT, OPTIONS";
        headers["Access-Control-Allow-Origin"] = origin;
        return headers;
    }
    */
    
    this.start = function(handleProcessEvent){
        let flag_isHTTPS = false;

        if ((this.config.key) && (this.config.cert)){
            flag_isHTTPS = true;

            this.config.key = fs.readFileSync(this.config.key);
            this.config.cert = fs.readFileSync(this.config.cert);
            
            this.server = https.createServer(this.config, function(request, response) {
                processHTTP.process(request, response);
            });
        }
        else{
            this.server = http.createServer(this.config, function(request, response) {
                processHTTP.process(request, response);
            });
        }

        this.server.listen(this.config.port);

        if (flag_isHTTPS){processHTTP
            console.log("endPointHTTPS listen in " + this.config.port);
        }
        else{
            console.log("endPointHTTP listen in " + this.config.port);
        }
    }
}

module.exports = EndPointHTTP;