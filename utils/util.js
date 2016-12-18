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

module.exports.getOptions = function(userType){
    var options = [];
    if(userType == 'chapter' || userType == 'fc'){
        options.push({
            heading: 'See Events Of Your Chapter',
            link: '/events'
        });
    } else{
        options.push({
            heading: 'See All Events',
            link: '/events/all'
        });
        options.push({
            heading: 'See Events Sent To You',
            'link': '/events'
        });
        options.push({
            heading: 'Export Events Excel',
            'link': '/events/excel'
        });
    }
    return options;
}