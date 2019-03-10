var User = require('../../models/user');

module.exports = {
    get: function(req, res, next) {
        res.render('changepassword', { title: "Change Password", menuHide: true });
    },
    post: function(req, res, next) {
        var userName = req.body.username,
            oldPassword = req.body.oldpassword,
            newPassword = req.body.newpassword,
            passwordConf = req.body.passwordConf;
        if (userName && oldPassword && newPassword && passwordConf) {
            User.findOne({ username: userName }).exec(function(err, user) {
                if (err) return next(err);
                else if (!user)
                    res.render('changepassword', { title: "Change Password", message: "Username does not exist.", menuHide: true });
                else {
                    User.authenticate(userName, oldPassword, function(error, user) {
                        if (error || !user) {
                            res.render('changepassword', { title: "Change Password", message: "Please enter corrent old password", menuHide: true });
                        } else {
                            // confirm that user typed same password twice
                            if (newPassword !== passwordConf) {
                                res.render('changepassword', { title: "Change Password", message: 'New Passwords do not match.', menuHide: true });
                            } else if (newPassword === oldPassword) {
                                res.render('changepassword', { title: "Change Password", message: 'New Password should not be the same with old password.', menuHide: true });
                            } else {
                                user.password = newPassword;
                                user.save(function(err, doc) {
                                    if (err)
                                        res.render('changepassword', { title: "Change Password", message: "Something went wrong in changing your password.", menuHide: true });
                                    else
                                        res.render('login', { title: "Login", message: "You have successfully changed your password, now proceed with login", menuHide: true });
                                });
                            }
                        }
                    });
                }
            });
        } else {
            var err = new Error('All fields required.');
            err.status = 400;
            return next(err);
        }
    }
};