var express = require('express');
var router = express.Router();
var util = require(require('path').join(__dirname, '../utils/util.js'));
var User = require(require('path').join(__dirname, '../models/user.js'));
var Event = require(require('path').join(__dirname, '../models/event.js'));

router.use(util.checkUserType(['chapterAdmin', 'clubAdmin', 'superAdmin', 'dsw']))
router.get('/events', function(req, res, next){
  Event.find({_id: {$in: req.session.user.events}})
  .exec(function(err, events){
    if(err){
      next(util.sendError(500, 'Cant Get Events'));
    } else{
      res.json({data: events});
    }
  });
});

module.exports = router;
