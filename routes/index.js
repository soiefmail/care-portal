var express = require('express'),
    router = express.Router(),
    User = require('../models/user'),

    logInRoute = require('./user/login'),
    signUpRoute = require('./user/signup'),
    registerRoute = require('./patient/register'),
    packageRoute = require('./patient/package'),
    admitRoute = require('./patient/admit'),
    dischargeRoute = require('./patient/discharge'),
    invoiceRoute = require('./patient/invoice'),
    advanceRoute = require('./patient/advance'),
    dueRoute = require('./patient/due'),
    getallduesRoute = require('./patient/getalldues'),
    getpaymentdetailsRoute = require('./patient/getpaymentdetails'),
    putidentificationRoute = require('./patient/putidentification'),
    changepasswordRoute = require('./user/changepassword'),
    settingsRoute = require('./settings/settings');

global.loggedInUser = '';

//server side local storage
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

/* this function is used as a middleware to validate a logged in session */
function validSession(req, res, next) {
    if (req.session && req.session.userId) {
        User.findById(req.session.userId)
            .exec(function(error, user) {
                if (error) {
                    return next(error);
                } else {
                    if (user === null) {
                        var err = new Error('Not authorized! Go back!');
                        err.status = 400;
                        return next(err);
                    } else {
                        global.loggedInUser = user.username;
                        next();
                    }
                }
            });
    } else {
        res.render('failure', { title: "Something Wrong!", message: "Not Authorized !!!!! You need to login first.", menuHide: true });
    }
}


router.get('/', logInRoute.get);
router.post('/', logInRoute.post);

// Comment below two lines if you want to disable new registration.
router.get('/signup', signUpRoute.get);
router.post('/signup', signUpRoute.post);

// GET for logout logout
router.get('/logout', require('./user/logout').get);

router.get('/changepassword', changepasswordRoute.get);
router.post('/changepassword', changepasswordRoute.post);

/* GET home page. */
router.get('/index', validSession, function(req, res, next) {
    res.render('index', { title: "Welcome to Care Portal", loggedInUser: global.loggedInUser });
});

// registration page route
router.get('/register', validSession, registerRoute.get);
router.post('/register', validSession, registerRoute.post);

router.get('/package', validSession, packageRoute.get);
router.post('/package', validSession, packageRoute.post);

router.get('/admit', validSession, admitRoute.get);
router.post('/admit', validSession, admitRoute.post);

router.get('/discharge', validSession, dischargeRoute.get);
router.post('/discharge', validSession, dischargeRoute.post);

router.get('/invoice', validSession, invoiceRoute.get);
router.post('/invoice', validSession, invoiceRoute.post);

router.get('/advance', validSession, advanceRoute.get);
router.post('/advance', validSession, advanceRoute.post);

router.get('/due', validSession, dueRoute.get);
router.post('/due', validSession, dueRoute.post);

router.get('/patientdetails', validSession, require('./patient/patientdetails').get);

router.get('/settings', settingsRoute.findPatientStorageSize, settingsRoute.findInvoiceStorageSize, settingsRoute.findDueStorageSize, settingsRoute.findAdvanceStorageSize, settingsRoute.findUserStorageSize, settingsRoute.findPackageHistoryStorageSize, settingsRoute.get);
router.post('/settings', settingsRoute.findPatientStorageSize, settingsRoute.findInvoiceStorageSize, settingsRoute.findDueStorageSize, settingsRoute.findAdvanceStorageSize, settingsRoute.findUserStorageSize, settingsRoute.findPackageHistoryStorageSize, settingsRoute.post);

router.get('/getalldues', validSession, getallduesRoute.get);
router.post('/getalldues', validSession, getallduesRoute.post);

router.get('/getpaymentdetails', validSession, getpaymentdetailsRoute.get);
router.post('/getpaymentdetails', validSession, getpaymentdetailsRoute.post);

router.get('/putidentification', validSession, putidentificationRoute.get);
router.post('/putidentification', validSession, putidentificationRoute.post);

router.get('*', validSession, function(req, res) {
    res.render('pagenotfound', { title: "404 !!!" });
});

module.exports = router;