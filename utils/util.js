module.exports.checkUserType = function(types){
    return function(req, res, next){
        if(req.session.user && types.lastIndexOf(req.session.user.role) != -1){
            next();
        } else{
            var error = new Error('Unauthorized User Type');
            error.status = 403;
            next(error);
        }
    }
}

module.exports.sendError = function(statusCode, message){
    var error = new Error(message);
    error.status = statusCode;
    return error;
}