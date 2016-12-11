var mongoose = require('mongoose');
var Promise = require('bluebird');
var bcrypt = process.platform == 'win32' ? Promise.promisifyAll(require('bcryptjs')) : Promise.promisifyAll(require('bcrypt'));

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    representative: {
        name: String,
        mobile: Number,
        email: String,
        regNum: String
    },
    facultyCoordinator: {
        name: String,
        empId: String,
        mobile: Number,
        email: String,
        school: String
    },
    role: String,
    events: [{
        type: ObjectId,
        ref: 'Event'
    }],
    approvedEvents: [{
        type: ObjectId,
        ref: 'Event'
    }],
    fullyApprovedEvents: [{
        type: ObjectId,
        ref: 'Event'
    }],
    changedEvents: [{
        by: String,
        event: {
            type: ObjectId,
            ref: 'Event'
        }
    }]
});

User.methods.comparePassword = function(enteredPassword){
    return bcrypt.compareSync(enteredPassword, this.password);
}

User.pre('save', function(next){
    var SALT = 10;
    var user = this;
    if (!user.isModified('password'))
        return next();
    bcrypt.genSaltAsync(SALT)
        .then((salt) => {
            return bcrypt.hashAsync(user.password, salt);
        })
        .then((hash) => {
            user.password = hash;
            next();
        })
        .catch(next);
});

module.exports = mongoose.model('User', User);