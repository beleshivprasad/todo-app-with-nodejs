const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const flash = require('connect-flash')
const session = require('express-session');
const passport = require('passport')

//Get Strategy
require('./authentication/passport')(passport)

//dotenv for getting PORT and DATABASE details.
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'});
const PORT = process.env.PORT;
const URL = process.env.URL;

//CONNECTING TO MONGODB
mongoose.connect(URL,{useUnifiedTopology:true,useNewUrlParser:true})
    .then(()=>{
        console.log("Connected MongoDB");
    })
    .catch(err=>
        console.log(err) 
    )

//REQUIRING THE ROUTER
const router = require('./routes/router')

//CREATING THE APP
const app = express();

//SETTING UP THE VIEWENGINE
app.set('views',path.resolve(__dirname,"./views"))
app.set('view engine', 'ejs')

//SETTING UP THE MIDDLEWARE
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//EXPRESS SESSION
app.use(session({
    secret:'this is the secret',
    resave:true,
    saveUninitialized:true
}))

//MIDDLEWARE FOR PASSPORT
app.use(passport.initialize())
app.use(passport.session())

//SETTING UP THE FLASH 
app.use(flash())

//FLASH VAR
app.use((req,res,next)=>{
    res.locals.login = req.isAuthenticated();
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//SETTING UP THE STATIC FOLDERS
app.use(express.static(path.join(__dirname,"./assets")))

//CREATING ROUTE FOR / 
app.use('/',router)

//LISTENING SERVER AT PORT
app.listen(PORT,()=>{
    console.log(`The server is running at: http://localhost:${PORT}`);
})



