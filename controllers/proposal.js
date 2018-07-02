var path = require("path");
const db = require('../db');
var helper = require('./helper')
var mailer = require('./mailer')

var _ = require('lodash');
const { check, validationResult } = require('express-validator/check');
var profilemap = {};

exports.getProposals = (req, res, next) => {
    helper.loadProfilemap(function(pmap) {
        profilemap = pmap;
        db.query('SELECT * FROM proposals order by proposal_id asc', (err, result) => {
            if (err) {
                return next(err)
            }
            else {
                // console.log("output in get propsals is", result.rows)
                var proposalmap = result.rows.map(function(x) {
                    x["proposer_id"] = profilemap[x.proposer];
                    if (x.acceptedby) {
                        x["acceptedby_id"] = profilemap[x.acceptedby];
                    }
                    return x;
                })
                // console.log(proposalmap)
                console.log(req.session.views, req.sessionID)
                res.end(JSON.stringify(proposalmap));
            }
        })
    });

}


exports.addProposal = (req, res, next) => {
    helper.loadProfilemap(function(pmap) {
        var profilemap = pmap;
        console.log("i have entered the post body");
        console.log(req.body);
        console.log("Starting Validation");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.mapped())
            return res.status(422).json({ errors: errors.mapped() });
        }
        else {
            const text = 'INSERT INTO proposals(proposer,phone,day,timestamp,location,status) VALUES($1, $2,$3,$4,$5,$6) RETURNING *'
            const values = [req.user.id, profilemap[req.user.id].phone, req.body.day, req.body.gametime, req.body.place, 'f'];
            db.query(text, values, (err, result) => {
                console.log("entered query");
                if (err) {
                    return next(err)
                }
                else {
                    console.log("result rows is ", result.rows);
                    res.redirect('/showProposals')
                }
            })
            //res.end(`output is , ${JSON.stringify(req.body)}`)
        }
    })

}

exports.acceptProposal = (req, res, next) => {
    console.log(req.body);
    var acceptedPlayer = req.user.id;
    var proposalId = req.body.id;
    var text = `UPDATE PROPOSALS set acceptedby=$1,status=$2 where proposal_id=$3 RETURNING *`;
    var values = [acceptedPlayer, 't', proposalId];
    db.query(text, values, (err, result) => {
        if (err) {
            //return next(err)
            console.log("error inside acceptProposal is ", err)
            res.end('notok')
        }
        else {
            //if (result.rows.length > 0) {
            console.log("ready to redirect", req.user);
            // res.send("ok");
            next()
            // helper.loadProfilemap(function(pmap) {
            //     // mailer.sendAcceptedProposal
            //     res.end(pmap[req.user.id].first_name)
            // })
        }

    })
}


exports.decline = (req, res, next) => {
    console.log("entered decline")
    var a = null;
    var text = `UPDATE PROPOSALS set acceptedby=$1,status=$2 where proposal_id=$3 RETURNING *`;
    console.log('req.params.id is ', req.params.id)
    var values = [null, a, req.params.proposalId];
    db.query(text, values, (err, result) => {
        console.log('result', result.rows)
        if (err) {
            console.log(err)
            return next(err)
        }
        res.redirect('/showProposals')
    })

}


exports.cancel = (req, res, next) => {
    var text = `Delete from PROPOSALS where proposal_id=$1 RETURNING *`;
    var values = [req.params.proposalId];
    db.query(text, values, (err, result) => {
        if (err) return next(err)
        res.redirect('/showProposals')
    })
}
