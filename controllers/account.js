var path = require("path");
var _ = require('lodash');
var helper = require('./helper')
const bcrypt = require('bcrypt');


// var db = require(path.join(__dirname, 'db.js'));
const db = require('../db');
const { check, validationResult } = require('express-validator/check');


exports.addProfile = (req, res, next) => {
    console.log("i have entered the post body");
    console.log(req.body);
    console.log("Starting Validation");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.mapped())
        return res.status(422).json({ errors: errors.mapped() });
    }
    else {
        const text = 'INSERT INTO profiles(phone, first_name,last_name,email,emailoptin,skill,username,password) VALUES($1, $2,$3,$4,$5,$6,$7,$8) RETURNING profile_id'
        const values = [req.body.phone, req.body.fname, req.body.lname, req.body.email, req.body.optin, req.body.skill, req.body.username, req.body.password];
        db.query(text, values, (err, result) => {
            console.log("entered query", result)
            if (err) {
                return next(err)
            }
            else {
                if (result.rows[0]) {
                    req.session.email = req.body.email
                    const text = 'INSERT INTO rankings(name,phone, rank,won,lost,points,profile_id) VALUES($1, $2,$3,$4,$5,$6,$7) RETURNING *'
                    const values = [req.body.fname + ' ' + req.body.lname, req.body.phone, 1, 0, 0, 0, result.rows[0]['profile_id']];
                    db.query(text, values, (err, result) => {
                        if (err) return next(err);
                        res.redirect('/signupConfirmation')
                    })
                }
                else {
                    res.end("Sorry cant sign you up")
                }
            }
        })
        // res.end(`output is , ${JSON.stringify(req.body)}`)
    }
}

exports.updateProfilePassword = function(req, res, next) {
    db.query(`update profiles set password=$1 where email=$2`, [req.body.password, req.session.email], (err, result) => {
        if (err) return next(err)
        console.log('query result in update profile Password', result)

        res.render('login', { message: { status: 1, class: "text-success", message: "Password Successfully Changed!, Please login." } })

    })
}

exports.isNotLastPassword = function(req, res, next) {
    db.query(`select password from profiles where email=$1`, [req.session.email], (err, result) => {
        if (err) return next(err)
        console.log("(req.body.password == result.rows['password'])", req.body.password, req.session.email, result.rows)
        bcrypt.compare(res.locals.password, result.rows[0]['password'], (err, result) => {
            if (!err && result) {
                res.render('login', { message: { status: 1, class: "text-danger", message: "Cannot use last password, Please try again!." } })
            }
            else {
                next()
            }
        })
        // res.render('login', { message: { status: 1, class: "text-success", message: "Password Successfully Changed!, Please login." } })
    })
}
