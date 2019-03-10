var Due = require('../../models/due'),
    _ = require('lodash');

module.exports = {
    get: function(req, res, next) {
        res.render('getalldues', { title: "All Details", loggedInUser: global.loggedInUser });

    },
    post: function(req, res, next) {
        var startdate = new Date(req.body.startdate),
            endDate = new Date(req.body.enddate),
            allDuesArr = [];
        startdate.setHours(0,0,0,0);
        endDate.setHours(0,0,0,0);
        Due.find({}, function(err, docs) {
            if (err) return next(err);
            if (docs) {
                _.each(docs, function(obj) {
                    var dueDate = new Date(obj.lastUpdated);
                    dueDate.setHours(0,0,0,0);
                    if(dueDate >= startdate && dueDate <= endDate) {
                        obj.dueDate = dueDate.toLocaleDateString();
                        allDuesArr.push(obj);
                    }
                });
                res.render('getalldues', { title: "All Dues", allDuesArr: allDuesArr, loggedInUser: global.loggedInUser });
            } else {
                res.render('failure', { title: "Something Wrong!", message: "Dues db not exist", loggedInUser: global.loggedInUser });
            }
        });
    }
};
