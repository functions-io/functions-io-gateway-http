var server = require("../");

server.handleMessage = function(message, callBack){
    console.log("message", message);
    callBack(null, {});
};

server.start();