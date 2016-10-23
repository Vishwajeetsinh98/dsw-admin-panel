var LocalStrategy = require('passport-local');
var User = require(require('path').join(__dirname, '../models/user.js'));


module.exports = function(passport){
    passport.use(new LocalStrategy({
                                    usernameField: 'email',
                                    passwordField: 'password'
                                   }, 
    function(username, password, done){
        var user = null;
        User.findOne({email: username}).then(function(result){
            if(!result){
                var error = new Error('No User By That Name');
                error.status = 401;
                throw error;
            }
            user = result;
            return user.comparePassword(password);
        })
        .then(function(match){
            if(!match){
                var error = new Error('Invalid Password!');
                error.status(401);
                throw error;
            }
            return done(null, user);
        })
        .catch(done);
    }))

    passport.serializeUser(function(user, done){
        return done(null, user._id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            return done(err, user);
        });
    });

}