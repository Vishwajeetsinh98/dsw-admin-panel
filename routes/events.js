var express = require('express');
var router = express.Router();
var util = require(require('path').join(__dirname, '../utils/util.js'));
var User = require(require('path').join(__dirname, '../models/user.js'));
var Event = require(require('path').join(__dirname, '../models/event.js'));

router.get('/list', function(req, res, next){
  Event.find({_id: {$in: req.session.user.events}})
  .exec(function(err, events){
    if(err){
      next(util.sendError(500, 'Cant Get Events'));
    } else{
      //res.render('eventsList', {data: events});
      res.json({data: events});
    }
  });
})

router.get('/', function(req, res, next){
  res.render('eventsList');
});

router.use(util.checkUserType(['fc', 'dsw', 'clubAdmin', 'chapterAdmin', 'superAdmin']))

router.get('/all', function(req, res, next){
  Event.find({})
  .exec(function(err, data){
    res.render('allEvents',{events: data});
  });
});

router.get('/:eventId', function(req, res, next){
  Event.findById(req.params.eventId)
  .exec(function(err, event){
    if(err){
      console.log(err);
      next(util.sendError(500, 'Cant Get Event'));
    }
    res.render('event', {event: event});
  });
});

module.exports = router;
