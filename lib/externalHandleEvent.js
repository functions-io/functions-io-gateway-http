module.exports.handle = function(request, response){
    var html = "<html><body><h1>FUNCTIONS-IO GATEWAY HTTP</h1></body></html>";
    response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    response.write(html);
}

module.exports.handleMessage = function(message, callBack){
    console.log(message);
    callBack("external handle JSON not implemented");
}