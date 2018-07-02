var path = require("path");
const db = require('../db');
var helper = require('./helper')
var _ = require('lodash');
const { check, validationResult } = require('express-validator/check');
var profilemap = {};

exports.getRankings = (req, res, next) => {
    db.query('SELECT * FROM matches', (err, result) => {
        //console.log("entered query")
        if (err) {
            return next(err)
        }
        res.end(JSON.stringify(result.rows))
    })
}

exports.computeRankings = (req, res, next) => {
    helper.loadProfilemap(function(pmap) {
        //  console.log(pmap);
        var count = 0;
        var length = _.size(pmap)
        _.forEach(pmap, function(profile) {
            var totalpoints = 0;
            var winning_points = 0;
            var losing_points = 0;
            var won = 0;
            var lost = 0;
            db.query(`select sum(winning_points) as wp,count(*) as won from matches where winner_profile_id=$1`, [profile.profile_id], function(err, result) {
                winning_points = Number(result.rows[0].wp);
                won = Number(result.rows[0].won)
                db.query(`select sum(losing_points) as lp,count(*) as lost from matches where loser_profile_id=$1`, [profile.profile_id], function(err, result) {
                    losing_points = Number(result.rows[0].lp);
                    lost = Number(result.rows[0].lost)
                    totalpoints = winning_points + losing_points
                    var text = 'INSERT INTO RANKINGS(NAME,PHONE,RANK,WON,LOST,POINTS,PROFILE_ID) VALUES($1, $2,$3,$4,$5,$6,$7) RETURNING *'
                    var values = [profile.first_name + " " + profile.last_name, profile.phone, 1, won, lost, totalpoints, profile.profile_id]
                    db.query(text, values, (err, result) => {
                        if (err) {
                            console.log("there is an error");
                        }
                        else {
                            count++
                            if (count == length) {
                                res.end("ok");
                            }

                            console.log("w,l,t,successful", winning_points, losing_points, totalpoints)
                        }
                    })
                })
            })

        })
    })
}

exports.cleanupRankings = (req, res, next) => {
    db.query(`delete from rankings`, function(err, result) {
        if (err) {
            next(err)
        }
        else {
            console.log("cleanup", result)
            next()
        }
    })
}

exports.finalizeRankings = (req, res, next) => {
    var length = 0;
    db.query(`select * from rankings order by points desc`, function(err, result) {
        // console.log("finalize rankings", result.rows)
        var i = 0,
            j = 0;
        length = result.rows.length
        var rank = result.rows
        console.log("finalize rankings", rank)

        for (i = 0; i < length - 1; i++) {
            j = i + 1;
            console.log("rank of i and rank of j is ", i, j, rank[i], rank[j])
            if (rank[i].points == rank[j].points) {
                rank[j].rank = rank[i].rank
            }
            else {
                rank[j].rank = rank[i].rank + 1;
            }
            db.query(`update rankings set rank=$1 where phone=$2`, [rank[j].rank, rank[j].phone], function(err, result) {
                if (err) console.log(err)
            })
        }
        res.render("displayrankings", { rank: rank, user: req.user.username })
    })
}
