"use strict";

const config = require("./config");
const externalHandleEvent = require("./externalHandleEvent");

var Server = function(){
    var self = this;

    this.config = config;
    this.externalHandleEvent = externalHandleEvent;
    this.listEndPoint = [];

    //init
    this.start = function(callBack){
        if (this.listEndPoint.length === 0){
            if (config.endPoint.http.enable){
                let configEndPoint = {};
                configEndPoint.port = config.endPoint.http.port;
                
                let EndPoint = require("./endpoint/EndPointHTTP");
                this.listEndPoint.push(new EndPoint(configEndPoint));
            }
            

            if (config.endPoint.https.enable){
                let configEndPoint = {};
                configEndPoint.port = config.endPoint.https.port;
                configEndPoint.key = config.cert.key;
                configEndPoint.cert = config.cert.pub;
                configEndPoint.passphrase = config.cert.passphrase;

                let EndPoint = require("./endpoint/EndPointHTTP");
                this.listEndPoint.push(new EndPoint(configEndPoint));
            }
        }
        
        this.listEndPoint.forEach(function(item){
            item.start();
        })

        if (callBack){
            callBack(null);
        }
    };
}

module.exports = new Server();