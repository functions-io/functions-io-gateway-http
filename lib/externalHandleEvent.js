module.exports.handle = function(message, callBack){
    console.log(message);
    callBack("external handle not implemented");
}