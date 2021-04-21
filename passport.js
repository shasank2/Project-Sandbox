const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//user model
const userM = require('./models/UserModel')

module.exports = function(passport){
    passport.use(new LocalStrategy({ 
      usernameField: 'email',    
      passwordField: 'password'
    },(username, password, done)=> {
          userM.findOne({ email: username },  (err, user)=> {
            if (err) throw err 
            if (!user) { return done(null, false, { message: 'User not found' })}
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                  return done(null, user);
                } else {
                  return done(null, false, { message: 'Password incorrect' });
                }
            });
          });
        }
      ));
      passport.serializeUser((user, done)=> {
        done(null, user.id);
      });
    
      passport.deserializeUser((id, done)=> {
        userM.findById(id, (err, user)=> {
          done(err, user);
        });
      });
}
