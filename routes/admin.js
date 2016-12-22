var express = require('express');
var router = express.Router();
var util = require(require('path').join(__dirname, '../utils/util.js'));
var User = require(require('path').join(__dirname, '../models/user.js'));
var Event = require(require('path').join(__dirname, '../models/event.js'));

router.use(util.checkUserType(['clubAdmin', 'chapterAdmin']));

router.post('/approve', function(req, res, next){
    console.log(req.body.accept);
    Event.findByIdAndUpdate(req.body.eventFor, {$set: {approvalStatus: (req.body.accept === 'true')}, $push:  {approvals: {by: req.session.user.role, approved: req.body.accept, when: new Date()}}}, function(err){
        if(err){
            next(util.sendError(500, 'Cant Approve / Reject'));
        } else{
            User.update({role: {$in: ['dsw', 'clubAdmin', 'chapterAdmin', 'superAdmin']}}, {$push: {fullyApprovedEvents: req.body.eventFor}, $pull: {events: req.body.eventFor}}, function(err){
                if(err){
                    next(util.sendError(500, 'Cant Remove From Pending of Other Users'))
                } else{
                    req.session.user.events = req.session.user.events.indexOf(req.body.eventFor) == 0 ? req.session.user.events.splice(req.session.user.events.indexOf(req.body.eventFor), 0) : req.session.user.events.splice(req.session.user.events.indexOf(req.body.eventFor), 1);
                    req.session['message'] = 'Event Has Been ' + (req.body.accept == 'true' ? 'Accepted' : 'Rejected');
                    res.redirect('/home');
                }
            })
        }
    })
});

router.post('/forward', function(req, res, next){
    User.update({role: {$in: req.body.roles.split(',')}}, {$push: {events: req.body.eventId}}, function(err){
        if(err){
            console.log(err);
            next(util.sendError(500, 'Can\'t Forward Event'));
        } else{
            req.session['message'] = 'Forwarded';
            res.redirect('/home');
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
    Event.findByIdAndUpdate(req.body.eventFor, query, function(err){
        if(err){
            next(util.sendError(500, 'Cant Update Event'));
        } else{
            User.update({role: {$in: ['dsw', 'superAdmin']}}, {$push: {changedEvents: {by: req.session.user.role, event: req.body.eventFor}}}, function(err){
                if(err){
                    console.log(err)
                    next(util.sendError(500, 'Cant Send To DSW'));
                } else{
                    req.session['message'] = 'Editted. Sent To DSW For Rechecking';
                    res.redirect('/home');
                }
            })
        }
    })
});

module.exports = router;
