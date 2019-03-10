module.exports = {
    get: function(req, res, next) {
        console.log(global.loggedInUser);
        global.loggedInUser = '';
        if (req.session) {
            // delete session object
            req.session.destroy(function(err) {
                if (err) {
                    return next(err);
                } else {
                    res.render('login', { title: "Login", message: "You have successfully logged out.", menuHide: true });
                }
            });
        }
    }
};