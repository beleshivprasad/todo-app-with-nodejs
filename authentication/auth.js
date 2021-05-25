module.exports = {
    checkAuth:function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error_msg","Please Login to View this resource");
        res.redirect('/login');
    }
}