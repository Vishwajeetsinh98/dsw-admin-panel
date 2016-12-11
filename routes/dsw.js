var express = require('express');
var router = express.Router();
var util = require(require('path').join(__dirname, '../utils/util.js'));
var User = require(require('path').join(__dirname, '../models/user.js'));
var Event = require(require('path').join(__dirname, '../models/event.js'));

router.use(util.checkUserType(['dsw', 'superAdmin']));

router.post('/passevent', function(req, res, next){
    var query = {$push: {approvals: {by: req.session.user.role, approved: req.body.accept, when: new Date()}}};
    req.body.accept = req.body.accept === 'true';
    Event.findByIdAndUpdate(req.body.eventFor, query, function(err, event){
        if(err){
            next(util.sendError(500, 'Cant Approve Event'));
        } else{
            if(req.body.accept){
                User.update({"role": event.conductingBodyType + "Admin"}, {$push: {events: event._id}}, function(err){
                    if(err){
                        next(util.sendError(500, 'Cant Send To Admins'))
                    } else{
                        User.update({role: {$in: ['dsw', 'superAdmin']}}, {$pull: {'events': req.body.eventFor}, $push: {approvedEvents: req.body.eventFor}}, function(err){
                            req.session.user.events = req.session.user.events.indexOf(req.body.eventFor) == 0 ? req.session.user.events.splice(req.session.user.events.indexOf(req.body.eventFor), 0) : req.session.user.events.splice(req.session.user.events.indexOf(req.body.eventFor), 1);
                            res.send('Forwarded To Admins');
                        })
                    }
                })
            } else{
                User.findByIdAndUpdate(req.session.user._id, {$pull: {events: req.body.eventFor}}, function(err){
                    if(err){
                        console.log(err);
                        next(util.sendError(500, 'Cant Reject Event'));
                    } else{
                        req.session.user.events = req.session.user.events.indexOf(req.body.eventFor) == 0 ? req.session.user.events.splice(req.session.user.events.indexOf(req.body.eventFor), 0) : req.session.user.events.splice(req.session.user.events.indexOf(req.body.eventFor), 1);
                        res.send('Removed Successfully');
                    }
                })
            }
        }
    })
});

router.post('/approveOverall', function(req, res, next){
    Event.findByIdAndUpdate(req.body.eventFor, {$set: {approvalStatus: (req.body.accept === 'true')}}, function(err){
        if(err){
            next(util.sendError(500, 'Cant Approve / Reject Event'))
        } else{
            res.send(req.body.accept === 'true' ? 'Approved Successfully' : 'Rejected Successfully');
        }
    })
});

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
            res.send('Editted');
        }
    })
})

module.exports = router;