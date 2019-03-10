var User = require('../../models/user');
module.exports = {
    get: function(req, res, next) {
        if (req.session.userId)
            res.redirect('/index');
        else
            res.render('login', { title: "Login", menuHide: true });
    },
    post: function(req, res, next) {
        if (req.body.logusername && req.body.logpassword) {
            User.authenticate(req.body.logusername, req.body.logpassword, function(error, user) {
                if (error || !user) {
                    // var err = new Error('Wrong email or password.');
                    // err.status = 401;
                    // return next(err);
                    res.render('login', { title: "Login", message: 'Wrong username or password.', menuHide: true });
                } else {
                    req.session.userId = user._id;
                    return res.redirect('/index');
                }
            });
        } else {
            var err = new Error('All fields required.');
            err.status = 400;
            return next(err);
        }
    }
};