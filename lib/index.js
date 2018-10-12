"use strict";

const config = require("./config");
const EndPointHTTP = require("./endpoint/EndPointHTTP");

var Server = function(){
    var self = this;

    this.config = config;
    this.handleMessage = null;
    this.listEndPoint = [];

    //init
    this.start = function(callBack){
        if (this.listEndPoint.length === 0){
            if (this.config.http && this.config.http.enabled){
                this.listEndPoint.push(new EndPointHTTP(this.handleMessage, this.config.http, this.config.web, this.config.listMiddlewareHTTP));
            }

            if (this.config.http && this.config.https.enabled){
                this.listEndPoint.push(new EndPointHTTP(this.handleMessage, this.config.https, this.config.web, this.config.listMiddlewareHTTP));
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