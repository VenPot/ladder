var path = require("path");
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
var db = require(path.join(__dirname, '/../db.js'));

//serialize and deserealize functions are used by passport js
passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    db.findById(id, function(err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});


//setting up local strategy for passport js
passport.use(new Strategy(
    function(username, password, cb) {
        db.findByUsername(username, function(err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false) }
            //if (user.password != password) { return cb(null, false); }
            bcrypt.compare(password, user.password, function(err, result) {
                //console.log("compare result is ", result)
                if (!err && result) {
                    return cb(null, user);
                }
                else {
                    return cb(null, false, { msg: 'Invalid username or password.' });
                }
            })

        });
    }));



/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
    const provider = req.path.split('/').slice(-1)[0];
    const token = req.user.tokens.find(token => token.kind === provider);
    if (token) {
        next();
    }
    else {
        res.redirect(`/auth/${provider}`);
    }
};



exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
}

// exports.authenticate = function(req, res) {
//     passport.authenticate('local', {
//         failureRedirect: '/login',
//         successRedirect: '/showProposals'
//     });
// }

// exports.authenticate = function(req, res, next) {

//     passport.authenticate('local', (err, user, info) => {
//         if (err) { return next(err); }
//         if (!user) {
//             console.log("info is ", info)
//             return res.redirect('/login');
//         }
//         req.logIn(user, (err) => {
//             if (err) { return next(err); }

//             res.redirect('/showProposals');
//         });
//     })(req, res, next);
// };
