const express = require('express');
const router = express.Router();

const {checkAuth} = require('../authentication/auth');

//REQUIRING THE CONTROLLER
const controller = require('../controllers/controller')

//ROUTE FOR HOME
router.get("/",controller.getHome);

//ROUTE FOR HOME
router.get("/login",controller.getLogin);

//ROUTE FOR HOME
router.get("/register",controller.getRegister);


//ROUTE FOR DASHBOARD
router.get("/dashboard",checkAuth,controller.getDashboard);

//ROUTE FOR DASHBOARD
router.get("/add",checkAuth,controller.getAdd);

//ROUTE FOR DASHBOARD Check
router.put("/dashboard/:check",checkAuth,controller.getDashboard);

//ROUTE FOR DASHBOARD
router.put("/dashboard/:delete",checkAuth,controller.getDashboard);

//ROUTE FOR DASHBOARD
router.get("/logout",controller.getLogout);

//ROUTE FOR DASHBOARD
router.get("*",controller.getNotfound);

//POST REQUEST
router.post('/login',controller.postLogin);

//POST REQUEST
router.post('/register',controller.postRegister);

//POST REQUEST
router.post('/add',checkAuth,controller.postAdd);




module.exports = router;
