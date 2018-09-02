"use strict";

const handleBody = require("./handles/handleBody");
const handleMessage = require("./handles/handleMessage");

var ProcessHTTP = function(){
    var self = this;

    this.listHandle = [];

    this.use = function(handleObj){
        this.listHandle.push(handleObj);
    }

    this.use(handleBody); //handleBody fist

    this.process = function(request, response) {
        let i = -1;

        function processNext(){
            i ++;
            let currentHandle = self.listHandle[i];
            if (currentHandle){
                currentHandle(request, response, processNext);
            }
            else{
                handleMessage(request, response);
            }
        }

        processNext();
    };
}

module.exports = ProcessHTTP;