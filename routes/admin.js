var express = require('express');
var router = express.Router();
var util = require(require('path').join(__dirname, '../utils/util.js'));
var User = require(require('path').join(__dirname, '../models/user.js'));
var Event = require(require('path').join(__dirname, '../models/event.js'));

router.use(util.checkUserType(['clubAdmin', 'chapterAdmin']));

router.get('/passevent', function(req, res, next){
    
})

router.post('/editevent', function(req, res, next){
    var query = {};
    for(var i = 0;i<req.body.length; i++){
        var changeField = req.body['field' + (i+1)];
        var changeValue = req.body['value' + (i+1)];
        if(changeField!=undefined)
        query[changeField] = changeValue;
    }
    Event.findByIdAndUpdate(req.body.eventFor, query, function(req, res, next){
        if(err){
            next(util.sendError(500, 'Cant Update Event'));
        } else{
            User.update({role: {$in: ['dsw', 'superAdmin']}}, {$push: {changedEvents: {by: req.session.user.role, event: req.body.eventFor}}}, function(err){
                if(err){
                    console.log(err)
                    next(util.sendError(500, 'Cant Send To DSW'));
                } else{
                    res.send('Sent To DSW');
                }
            })
            res.send('Editted');
        }
    })
});

module.exports = router;
