const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const passport = require('passport')
//DB connection
const User = require('../models/user');
const ToDo = require('../models/todo');
var today = new Date();

require('../authentication/passport')(passport)

//Home CONTROLLER
exports.getHome = (req, res) => {
    res.render('index', {
        user: req.user
    });
}


//Login CONTROLLER
exports.getLogin = (req, res) => {
    res.render('login');
}

//REGISTER CONTROLLER
exports.getRegister = (req, res) => {
    res.render('register');
}


//REGISTER CONTROLLER
exports.getDashboard = (req, res) => {
    const check = req.query.check;
    const del = req.query.delete;
    if (check) {
        let today = new Date();
        let dt = `${today.getHours()}:${today.getMinutes()} ${today.getDate()}/${today.getMonth()}/${today.getFullYear()}`
        ToDo.findByIdAndUpdate(check, {
                status: "Done",
                dateTime: dt
            })
            .then(data => {
                if (data) {
                    req.flash("success_msg", "Marked As Done")
                    res.redirect('/dashboard')
                } else {
                    req.flash("error_msg", "Something Went Wrong")
                    res.redirect('/dashboard')
                }
            })
            .catch(err => { console.log(err)})
    }
    if (del) {
        ToDo.findByIdAndDelete(del)
            .then(data=>{
                if(data){
                    req.flash("success_msg", "Deleted Permanently")
                    res.redirect('/dashboard')
                }else{
                    req.flash("error_msg", "Something Went Wrong");
                    res.redirect('/dashboard')
                }
            })
    }
    ToDo.find()
        .then(data => {
            if (data) {
                res.render('dashboard', {
                    user: req.user,
                    data: data
                });
            } else {
                req.flash("error_msg", "Add Some Tasks")
                res.redirect('/add')
            }
        })

}


//ADD CONTROLLER
exports.getAdd = (req, res) => {
    res.render('add', {
        user: req.user
    });
}


//REGISTER CONTROLLER
exports.getLogout = (req, res) => {
    req.logout();
    req.flash("success_msg", "Logged out Successfully")
    res.redirect('/login')
}

//PAGE NOT FOUND  CONTROLLER
exports.getNotfound = (req, res) => {
    res.render('notfound',{
        user: req.user
    })
}

//POST CONTROLLERS

//POST FOR LOGIN
exports.postLogin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
}
//POST FOR LOGIN
exports.postRegister = (req, res) => {
    const {
        name,
        email,
        password,
        cnfpassword
    } = req.body;
    let error = []
    if (!name || !email || !password || !cnfpassword) {
        error.push({
            msg: "Please Fill All the Fields"
        })
    }
    if (password !== cnfpassword) {
        error.push({
            msg: "Password Dont Match"
        })
    }
    if (password.length < 6) {
        error.push({
            msg: "Password Should be at least 6 characters"
        })
    }
    if (error.length > 0) {
        res.render('register', {
            error,
            name,
            email
        })
    } else {
        User.findOne({
                email: email
            })
            .then(user => {
                if (user) {
                    error.push({
                        msg: "User already exists with this email"
                    })
                    res.render('register', {
                        error,
                        name,
                        email
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) throw err;
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;

                            newUser.save()
                                .then(user => {
                                    req.flash("success_msg", "User Registered Successfully..! Login to Continue...")
                                    res.redirect('/login');
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                        })
                    })
                }
            })
    }
}
//POST FOR LOGIN
exports.postAdd = (req, res) => {
    var today = new Date()
    var dt = `${today.getHours()}:${today.getMinutes()} ${today.getDate()}/${today.getMonth()}/${today.getFullYear()}`
    const {
        title,
        task,
    } = req.body;
    if (!title || !task) {
        req.flash("error_msg", "Please Fill All the Fields");
        res.redirect('/add');
    } else {
        const todo = new ToDo({
            title,
            task,
            dateTime : dt
        })
        todo.save()
            .then(data => {
                if (data) {
                    req.flash("success_msg", "Task Added Successfully");
                    res.redirect('/dashboard')
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
}