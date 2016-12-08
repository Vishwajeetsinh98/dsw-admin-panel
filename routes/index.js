var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require(require('path').join(__dirname, '../models/user.js'));
var Event = require(require('path').join(__dirname, '../models/event.js'));
var util = require(require('path').join(__dirname, '../utils/util.js'));

router.get('/', function(req, res, next){
  res.render('eventsForm', {loggedIn: req.session.user != undefined});
});

router.post('/login', passport.authenticate('local'), function(req, res, next){
  req.session.user = req.user;
  res.json(req.session.user);
});

router.get('/logout', function(req, res, next){
  if(!req.session.user)
    res.send('Not Logged In!');
  req.logout();
  res.clearCookie();
  req.session.user = req.user;
  res.send('Logged Out');
});

router.post('/register', function(req, res, next){
  var newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    representative: {
        name: req.body.repName,
        mobile: req.body.repMobile,
        email: req.body.repEmail,
        regNum: req.body.regRegNum
    },
    facultyCoordinator: {
        name: req.body.facname,
        empId: req.body.facId,
        mobile: req.body.facMobile,
        email: req.body.facemail,
        school: req.body.facSchool
    },
    role: req.body.role,
    events: []
  });
  newUser.save(function(err){
    if(err){
      console.log(err)
      next(util.sendError(500, 'Cant Register'));
    } else{
      res.send('Registered')
    }
  })
})

router.post('/addevent', function(req, res, next){
  var newEvent = new Event({
    clubOrChapter: req.body.clubOrChapter,
    eventName: req.body.eventName,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    startTime: req.body.startTime,
    duration: req.body.duration,
    eventDescription: req.body.description,
    eventParticipants: req.body.participants,
    venueRequirement: req.body.venue,
    guestDetails: req.body.guest,
    budget: req.body.budget,
    sponsors: req.body.sponsors,
    studentCoordinator: {
        name: req.body.studentCoordinatorName,
        regNum: req.body.studentCoordinatorRegNum,
        school: req.body.studentCoordinatorSchool,
        mobile: req.body.studentCoordinatorMobile,
        email: req.body.studentCoordinatorEmail
    },
    facultyCoordinator: {
        name: req.body.facultyCoordinatorName,
        empId: req.body.facultyCoordinatorEmpId,
        mobile: req.body.facultyCoordinatorMobile,
        school: req.body.facultyCoordinatorSchool,
        email: req.body.facultyCoordinatorEmail
    },
    ceoRequest: req.body.ceoRequest,
    proRequest: req.body.proRequest,
    other: req.body.other,
    faApproval: false,
    approvalStatus: false
  });
  //Populate The Chapter Field
  User.findOne({name: req.body.clubOrChapter, role: 'chapter'}, function(err, chapter){
    if(err){
      console.log(err);
      var error = new Error('Unable To Get Chapter');
      error.status = 500;
      next(error);
    } else{
      newEvent.chapter = chapter._id;
      newEvent.save(function(err, event){
        if(err){
          console.log(err);
          var error = new Error('Unable To Save Event');
          error.status = 500;
          next(error);
        } else{
          //Send To FC
          User.update({email: req.body.facultyCoordinatorEmail}, {$push: {events: event._id}}, function(err){
            if(err){
              console.log(err);
              var error = new Error('Unable To Save Event');
              error.status = 500;
              next(error);
            } else{
              res.send('Sent To FC For Approval');
            }
          });
          /*User.findByIdAndUpdate(newEvent.chapter, {$push: {events: event._id}}, function(err){
            if(err){
              console.log(err);
              var error = new Error('Unable To Save Event');
              error.status = 500;
              next(error);
            } else{
              res.send('Saved');
            }
          });*/
        }
      })
    }
  })
});

module.exports = router;
