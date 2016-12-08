var express = require('express');
var router = express.Router();
var util = require(require('path').join(__dirname, '../utils/util.js'));
var User = require(require('path').join(__dirname, '../models/user.js'));
var Event = require(require('path').join(__dirname, '../models/event.js'));

router.use(util.checkUserType(['fc']));

router.post('/accept', function(req, res, next){
    var query = {faApproval: req.body.accept};
    Event.findByIdAndUpdate(req.body.eventFor, query, function(err, event){
        if(err){
            console.log(err);
            next(util.sendError(500, 'Cant Approve Right Now'))
        } else{
            if(req.body.accept){
                var search = {_id: event.chapter};
                User.update(search, {$push: {events: event._id}}, function(err){
                    if(err){
                        console.log(err);
                        next(util.sendError(500, 'Cant Send Event To Admins'));
                    } else{
                        User.update({role: {$in: ['dsw', 'superAdmin', event.conductingBodyType + 'Admin']}}, {$push: {events: event._id}}, function(err){
                            if(err){
                                console.log(err);
                                next(util.sendError(500, 'Cant Send Event To Admins'));
                            }
                        })
                    }
                })
            }
            res.send(req.body.accept ? 'Approved' : 'Rejected');
        }
    })
})

module.exports = router;