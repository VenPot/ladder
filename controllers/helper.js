const db = require('../db');
// var path = require("path");

// var _ = require('lodash');
// const UIDGenerator = require('uid-generator');
// const uidgen = new UIDGenerator();



exports.loadProfilemap = (callback) => {
    var pmap = {};
    db.query('select * from profiles', (err, profiles) => {
        if (err) {
            console.log(err)
            callback(null);
        }
        else {

            pmap = profiles.rows.reduce(function(obj, item) {
                obj[item.profile_id] = { "profile_id": item.profile_id, "first_name": item.first_name, "last_name": item.last_name, "phone": item.phone, "email": item.email }
                return obj;
            }, {});

            callback(pmap);

        }
    })
}


// exports.getCredentials = (username, callback) => {

//     db.query('select username,profile_id as id,password from profiles where username=$1', [username], (err, creds) => {
//         if (err) {
//             console.log("query executiong failed with error", err)
//             callback(null);
//         }
//         else {

//             // console.log("creds in get creds is ", creds)
//             callback(creds.rows);

//         }
//     })
// }

// exports.validateMatch = (req, res, next) => {
//     db.query('select proposer,acceptedby from proposals where proposal_id=$1', [req.body.proposal_id], (err, result) => {
//         if (err) {
//             console.log(err)
//             next(err);
//         }
//         else {
//             console.log('result in validatMatch is ', result.rows[0])
//             if (_.includes(result.rows[0], req.user.id)) {
//                 next();
//             }
//             else {
//                 console.log("mismatch between match and and proposal id")
//                 // req.flash('Failed', { msg: 'Sorry ,you can only update your matches' });
//                 res.end("mismatch");
//                 //  res.redirect("/");
//                 //next(new Error());
//             }

//         }

//     })
// }

// exports.generateToken = (req, res, next) => {
//     uidgen.generate((err, uid) => {
//         if (err) {
//             next(err)
//         }
//         else {
//             req.session.token = uidgen.generateSync();
//             req.session.resetPasswordExpires = Date.now() + 3600000; //1hr expiry Date.now() returns unix epoch time
//             req.session.email = req.body.email;
//             const text = 'INSERT INTO resetpassword(email_id,token,token_expires) VALUES($1, $2,$3)'
//             const values = [req.body.email, req.session.token, req.session.resetPasswordExpires];
//             db.query(text, values, (err, result) => {
//                 if (err) return next(err)
//                 console.log('Inserted in to resetpassword', result.rows)
//                 next();
//             });

//         }
//     })
// }

// exports.validateUserEmailForReset = (req, res, next) => {
//     console.log('checks in validateUserEmailForReset ', req.body.email)
//     db.query('select email,username from profiles where email=$1', [req.body.email], (err, result) => {
//         if (err) {
//             console.log(err)
//             next(err);
//         }
//         else {
//             console.log('result in validateUserEmailForReset is ', result.rows)
//             if (_.includes(result.rows[0], req.body.email)) {
//                 req.session.username = result.rows[0].username;
//                 next();
//             }
//             else {
//                 console.log("email Id is not a regisreed user")
//                 // req.flash('Failed', { msg: 'Sorry ,you can only update your matches' });
//                 res.render('login', { message: { status: 1, class: "text-danger", message: "Incorrect email!, Please try again" } })
//                 //  res.redirect("/");
//                 //next(new Error());
//             }

//         }

//     })
// }


// exports.showReset = function(req, res) {
//     res.render('reset')
// }


// exports.validateResetToken = function(req, res, next) {

//     db.query('select * from resetpassword where token=$1', [req.body.verificationCode], (err, result) => {
//         if (err) {
//             console.log(err)
//             next(err);
//         }
//         else {
//             console.log(result);
//             if (!result.rows[0]) {
//                 res.render('verificationCode', { message: { status: 1, class: "text-danger", message: "Invalid Verifcation Code!, Please try again." } })
//             }
//             else {
//                 if (Date.now() < result.rows[0]['token_expires']) {
//                     next()
//                 }
//                 else {
//                     res.render('login', { message: { status: 1, class: "text-danger", message: "Verifcation code expired!, Please try again by clicking Forgot Password." } })
//                 }
//             }
//         }

//     })
// }
