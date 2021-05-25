const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const User = require("../models/user");


module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField:"email",passwordField:"password"},(email,password,done)=>{
            User.findOne({email:email})
                .then(user=>{
                    if(!user){
                        return done(null,false,{message:"Email is not Registered..! Please Register"})
                    }
                    bcrypt.compare(password,user.password,(err,isMatch)=>{
                        if(err) throw err;
                        if(isMatch){
                            return done(null,user)
                        }
                        else{
                            return done(null,false,{message:"Incorrect Password"})
                        }
                    })
                })
                .catch(err => console.log(err))
        })
    );

    passport.serializeUser((user, done) =>{
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done)=>{
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}
