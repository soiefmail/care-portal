var User = require('../../models/user');

module.exports = {
    get: function(req, res, next) {
        res.render('user', { title: "Sign Up", menuHide: true });
    },
    post: function(req, res, next) {
        if (req.body.username && req.body.password && req.body.passwordConf) {
            // confirm that user typed same password twice
            if (req.body.password !== req.body.passwordConf) {
                // var err = new Error('Passwords do not match.');
                // err.status = 400;
                // return next(err);
                res.render('user', { title: "Sign Up", message: 'Passwords do not match.', menuHide: true });
            } else {
                var userData = {
                        username: req.body.username,
                        password: req.body.password,
                        passwordConf: req.body.passwordConf
                    };
                //use schema.create to insert data into the db
                User.create(userData, function(err, user) {
                    if (err) {
                        return next(err);
                    } else {
                        req.session.userId = user._id;
                        //return res.redirect('/profile');
                        res.render('login', { title: "Login", message: "You have successfully registered, now proceed with login", menuHide: true });
                    }
                });
            }
        } else {
            var err = new Error('All fields required.');
            err.status = 400;
            return next(err);
        }
    }
};