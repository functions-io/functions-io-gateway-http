"use strict";

const path = require("path");
const fs = require("fs");

const http = require("http");
const https = require("https");

var EndPointHTTP = function(p_handleMessage, p_config, p_configWeb, p_listMiddlewareHTTP){
    var self = this;

    this.config = p_config;
    this.configWeb = p_configWeb;
    this.listMiddlewareHTTP = p_listMiddlewareHTTP;
    this.server = null;
    this.handleMessage = p_handleMessage;
    this.listHandle = [];

    this.use = function(handleObj){
        this.listHandle.push(handleObj);
    }

    this.process = function(request, response) {
        let i = -1;

        request.config = this.config;
        request.configWeb = this.configWeb;
        request.handleMessage = this.handleMessage;

        function processNext(){
            i ++;
            let currentHandle = self.listHandle[i];
            if (currentHandle){
                currentHandle(request, response, processNext);
            }
        }

        processNext();
    };

    
    this.start = function(handleProcessEvent){
        let flag_isHTTPS = false;

        //load middleware
        if (this.listMiddlewareHTTP){
            for (var i = 0; i < this.listMiddlewareHTTP.length; i++){
                let newMiddlewareHTTP;
                let moduleOrModuleName = this.listMiddlewareHTTP[i];
                if (typeof(moduleOrModuleName) === "string"){
                    newMiddlewareHTTP = require(moduleOrModuleName);
                }
                else{
                    newMiddlewareHTTP = moduleOrModuleName;
                }
                this.use(newMiddlewareHTTP);
            }
        }

        if ((this.config.key) && (this.config.cert)){
            let folderSSL
            let fileKeyPath;
            let fileCertPath;
            
            flag_isHTTPS = true;

            folderSSL = path.join(path.dirname(require.main.filename), "ssl");
            if (fs.existsSync(folderSSL) === false){
                folderSSL = path.join(__dirname, "ssl");
            }

            if (this.config.key.indexOf("/") === -1){
                fileKeyPath = path.join(folderSSL, this.config.key)
            }
            else{
                fileKeyPath = this.config.key;
            }

            if (this.config.cert.indexOf("/") === -1){
                fileCertPath = path.join(folderSSL, this.config.cert)
            }
            else{
                fileCertPath = this.config.cert;
            }

            this.config.key = fs.readFileSync(fileKeyPath);
            this.config.cert = fs.readFileSync(fileCertPath);

            this.server = https.createServer(this.config, function(request, response) {
                self.process(request, response);
            });
        }
        else{
            this.server = http.createServer(this.config, function(request, response) {
                self.process(request, response);
            });
        }

        this.server.listen(this.config.port);

        if (flag_isHTTPS){
            console.log("endPointHTTPS listen in " + this.config.port);
        }
        else{
            console.log("endPointHTTP listen in " + this.config.port);
        }
    };

    this.stop = function(){
        try {
            if (this.server){
                this.server.close();
            }            
        }
        catch (errTry) {
            console.error(errTry);
        }
    };
}

module.exports = EndPointHTTP;