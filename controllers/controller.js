const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const passport = require('passport')
//DB connection
const User = require('../models/user');

require('../authentication/passport')(passport)

//Home CONTROLLER
exports.getHome = (req,res)=>{
    res.render('index',{user:req.user});
}


//Login CONTROLLER
exports.getLogin = (req,res)=>{
    res.render('login');
}

//REGISTER CONTROLLER
exports.getRegister = (req,res)=>{
    res.render('register');
}


//REGISTER CONTROLLER
exports.getDashboard = (req,res)=>{
    res.render('dashboard',{user:req.user});
}


//REGISTER CONTROLLER
exports.getLogout = (req,res)=>{
    req.logout();
    req.flash("success_msg","Logged out Successfully")
    res.redirect('/login')
}

//POST CONTROLLERS

//POST FOR LOGIN
exports.postLogin = (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect : '/login',
        failureFlash:true
    })(req,res,next);
}
//POST FOR LOGIN
exports.postRegister = (req,res)=>{
    const {name,email,password,cnfpassword} = req.body;
    let error = []
    if(!name || !email || !password || !cnfpassword){
        error.push({msg:"Please Fill All the Fields"})
    }
    if(password !== cnfpassword){
        error.push({msg:"Password Dont Match"})
    }
    if(password.length < 6){
        error.push({msg:"Password Should be at least 6 characters"})
    }
    if(error.length  > 0){
        res.render('register',{error,name,email})
    }
    else{
        User.findOne({email:email})
            .then(user =>{
                if(user){
                    error.push({msg:"User already exists with this email"})
                    res.render('register',{error,name,email})
                }
                else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    })
                    bcrypt.genSalt(10,(err, salt) =>{
                        if(err) throw err;
                        bcrypt.hash(newUser.password,salt,(err,hash) =>{
                            if(err) throw err;
                            newUser.password = hash;

                            newUser.save()
                                .then(user=>{
                                    req.flash("success_msg","User Registered Successfully..! Login to Continue...")
                                    res.redirect('/login');
                                })
                                .catch(err=>{ console.log(err)})
                        })
                    })
                }
            })
    }
}
//POST FOR LOGIN
exports.postDashboard = (req,res)=>{

}