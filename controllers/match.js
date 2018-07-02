var path = require("path");
const db = require('../db');
var helper = require('./helper')
var _ = require('lodash');
var profilemap = {};


exports.getMatches = (req, res, next) => {
    helper.loadProfilemap(function(pmap) {
        profilemap = pmap;
        db.query('SELECT * FROM matches order by match_id desc', (err, result) => {
            //console.log("entered query")
            if (err) {
                return next(err)
            }
            else {
                var filteredMatches = [];
                console.log(JSON.stringify(result.rows[0]))

                filteredMatches = result.rows.filter(function(item) {
                    item.set1_score = item.set1_score.match(/\d+/g).map(Number).toString().replace(",", "-")
                    item.set2_score = item.set2_score.match(/\d+/g).map(Number).toString().replace(",", "-")
                    item.set3_score = item.set3_score.match(/\d+/g).map(Number).toString().replace(",", "-")
                    item.winner_profile_id = profilemap[item.winner_profile_id].first_name
                    item.loser_profile_id = profilemap[item.loser_profile_id].first_name
                    return item;


                })

                res.render('displaymatches', { data: filteredMatches, user: req.user.username })
            }

        })

    })
}


exports.showMatch = (req, res, next) => {
    // console.log('req.body is', req.body)
    helper.loadProfilemap(function(pmap) {
        profilemap = pmap;
    });
    var scores = [];
    console.log(req.params);
    //console.log("entered scores and req.body id is ", req.body["id"], typeof(req.body["id"]));
    db.query('select * from matches where proposal_id=$1', [req.params.id], (err, result1) => {
        if (err) return next(err)
        if (result1.rows.length > 0) {
            scores = result1.rows;
            console.log("available scores ", scores[0].set1_score);
            try {
                scores.score1 = result1.rows[0].set1_score.match(/\d+/g).map(Number)[0]
                scores.score2 = result1.rows[0].set2_score.match(/\d+/g).map(Number)[0]
                scores.score3 = result1.rows[0].set3_score.match(/\d+/g).map(Number)[0]
                scores.score4 = result1.rows[0].set1_score.match(/\d+/g).map(Number)[1]
                scores.score5 = result1.rows[0].set2_score.match(/\d+/g).map(Number)[1]
                scores.score6 = result1.rows[0].set3_score.match(/\d+/g).map(Number)[1]
            }
            catch (err) {
                console.log("error while setting scores is ", err)
            }
        }

        db.query('select proposer,acceptedby from proposals where proposal_id=$1', [req.params.id], (err, result) => {
            if (err) {
                return next(err);
            }
            else {
                console.log("enter scores", result.rows);
                if (result.rows.length > 0)
                //res.end(`output is , ${JSON.stringify(result.rows)}`)
                {
                    var proposer = profilemap[result.rows[0].proposer];
                    var acceptedby = profilemap[result.rows[0].acceptedby];
                    console.log("scores before sending is ", scores)

                    res.render('match', {
                        "matchDetails": { "pid": req.params.id, "proposer": proposer, "acceptedby": acceptedby, "scores": scores },
                        "matchDetailsStringed": JSON.stringify({ pid: req.params.id, proposer: proposer, acceptedby: acceptedby }),
                        user: req.user.username
                    });
                }
                else {
                    res.end("Invalid proposal id Passed to enter scores")
                }
            }
        })
    })
}




exports.addMatchScores = async(req, res, next) => {
    // console.log(req.body);
    var winner, loser, winner_rank, loser_rank, wp = 25,
        lp = 5;
    var match = {}
    match = req.body;
    console.log("match", match, typeof(match))
    var setDifference = Math.abs((match.scores[0][0] + match.scores[1][0] + match.scores[2][0]) > (match.scores[0][1] + match.scores[1][1] + match.scores[2][1]));
    if ((match.scores[0][0] + match.scores[1][0] + match.scores[2][0]) > (match.scores[0][1] + match.scores[1][1] + match.scores[2][1])) {
        winner = match.proposer_id;
        wp = wp + 5;
        loser = match.acceptedby_id;
    }
    else {
        winner = match.acceptedby_id;
        loser = match.proposer_id;
        lp = lp + 5;
        //match_id | winner_profile_id | loser_profile_id | winning_points | losing_points | proposal_id | set1_score | set2_score | set3_score | set4_score | set5_score 
    }

    winner_rank = await db.query(`select rank as winner_rank from rankings where profile_id=$1`, [winner], (err, result) => {
        if (err) return next(err)
        return result.rows[0].winner_rank
    })
    loser_rank = await db.query(`select rank as loser_rank from rankings where profile_id=$1`, [loser], (err, result) => {
        if (err) return next(err)
        return result.rows[0].loser_rank
    })

    const text = `INSERT INTO matches(winner_profile_id, loser_profile_id,winning_points,losing_points,proposal_id,set1_score,set2_score,set3_score,winner_rank,loser_rank) 
                VALUES($1, $2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`
    const values = [winner, loser, wp, lp, match.proposal_id, match.scores[0], match.scores[1], match.scores[2], winner_rank, loser_rank];

    db.query(text, values, (err, result) => { //Insert for news score or update existing
        console.log("entered query")
        if (err) {
            if (_.includes(err.message, 'uniqpropid')) {
                console.log("error message is ", err.message);
                db.query('update matches set winner_profile_id=$1,loser_profile_id=$2,winning_points=$3,losing_points=$4,set1_score=$6,set2_score=$7,set3_score=$8,winner_rank=$9,loser_rank=$10 where proposal_id=$5 returning *', values, (err, result) => {
                    if (err) return next(err);
                    console.log("from update", result.rows);
                    res.end(`output is , ${JSON.stringify(result.rows)}`)
                })
            }
            else {
                return next(err);
            }
        }
        else {
            //  console.log("from insert", result.rows);
            res.end(`output is , ${JSON.stringify(result.rows)}`)
        }
    })

}

exports.validateMatch = (req, res, next) => {
    db.query('select proposer,acceptedby from proposals where proposal_id=$1', [req.body.proposal_id], (err, result) => {
        if (err) {
            console.log(err)
            next(err);
        }
        else {
            console.log('result in validatMatch is ', result.rows[0])
            if (_.includes(result.rows[0], req.user.id)) {
                next();
            }
            else {
                console.log("mismatch between match and and proposal id")
                // req.flash('Failed', { msg: 'Sorry ,you can only update your matches' });
                res.end("mismatch");
                //  res.redirect("/");
                //next(new Error());
            }

        }

    })
}
