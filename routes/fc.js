var express = require('express');
var router = express.Router();
var util = require(require('path').join(__dirname, '../utils/util.js'));
var User = require(require('path').join(__dirname, '../models/user.js'));
var Event = require(require('path').join(__dirname, '../models/event.js'));

router.use(util.checkUserType(['fc']));

router.post('/approve', function(req, res, next){
    var eventApproval = req.body.accept === 'true' ? 'approved' : 'rejected';
    var query = {fcApproval: eventApproval, $push: {approvals: {by: "fc", approved: eventApproval, when: new Date()}}};
    Event.findByIdAndUpdate(req.body.eventId, query, function(err, event){
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
                        User.update({role: {$in: ['dsw', 'superAdmin']}}, {$push: {events: event._id}}, function(err){
                            if(err){
                                console.log(err);
                                next(util.sendError(500, 'Cant Send Event To Admins'));
                            }
                        })
                    }
                })
            }
            req.session['message'] = 'Event has been ' + (req.body.accept ? 'Approved Successfully' : 'Rejected');
            res.redirect('/home');
        }
    })
})

module.exports = router;
