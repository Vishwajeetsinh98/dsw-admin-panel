var express = require('express');
var router = express.Router();
var util = require(require('path').join(__dirname, '../utils/util.js'));
var User = require(require('path').join(__dirname, '../models/user.js'));
var Event = require(require('path').join(__dirname, '../models/event.js'));

router.use(util.checkUserType(['dsw', 'superAdmin']));

router.post('/approve', function(req, res, next){
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
                            res.session.message = 'Forwarded To Admins';
                            res.redirect('/home');
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
                        res.session.message = 'Removed Successfully';
                        res.redirect('/home');
                    }
                })
            }
        }
    })
});

router.post('/forward', function(req, res, next){
    User.update({role: {$in: req.body.roles.split(',')}}, {$push: {events: req.body.eventId}}, function(err){
        if(err){
            console.log(err);
            next(util.sendError(500, 'Can\'t Forward Event'));
        } else{
          res.session.message = 'Forwarded';
          res.redirect('/home');
        }
    })
})

router.post('/approveoverall', function(req, res, next){
    Event.findByIdAndUpdate(req.body.eventFor, {$set: {approvalStatus: (req.body.accept === 'true')}}, function(err){
        if(err){
            next(util.sendError(500, 'Cant Approve / Reject Event'))
        } else{
            User.update({role: {$in: ['dsw', 'superAdmin', 'clubAdmin', 'chapterAdmin']}}, {$push: {fullyApprovedEvents: req.body.eventFor}, $pull: {events: req.body.eventFor}}, function(err){
                if(err){
                    next(util.sendError(500,  'Cant Communicate To Admins'))
                } else{
                    req.session.message = req.body.accept === 'true' ? 'Approved Successfully' : 'Rejected Successfully';
                    res.redirect('/home');
                }
            })
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
    Event.findByIdAndUpdate(req.body.eventFor, query, function(err, event){
        if(err){
            next(util.sendError(500, 'Cant Update Event'));
        } else{
            User.update({role: {$in: [event.conductingBodyType + 'Admin']}}, {$push: {changedEvents: {by: req.session.user.role, event: req.body.eventFor}}}, function(err){
                if(err){
                    next(util.sendError(500, 'Cant Communicate Changes To Admins'))
                } else{
                  req.session.message = 'Editted';
                  res.redirect('/home');
                }
            })
        }
    })
})

module.exports = router;
