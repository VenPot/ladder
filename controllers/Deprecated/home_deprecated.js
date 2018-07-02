// var path = require("path");
// const db = require('../db');
// var helper = require('./helper')
// var _ = require('lodash');
// var profilemap = {};

/**
 * GET /
 * Home page.
 */
// exports.index = (req, res, next) => {
        //     res.redirect('/home.html')
        //     // console.log("indexprofilemap is ", profilemap)
        //     // db.query('SELECT * FROM proposals', (err, result) => {
        //     //     console.log("entered query")
        //     //     if (err) {
        //     //         return next(err)
        //     //     }
        //     //     console.log(`result is ${result}`);
        //     //     console.log(result.rows);
        //     //     res.end(`output is , ${JSON.stringify(result.rows)}`)
        //     // })
        // };

// exports.getProposals = (req, res, next) => {
// helper.loadProfilemap(function(pmap) {
//     profilemap = pmap;
//     db.query('SELECT * FROM proposals order by proposal_id asc', (err, result) => {
//         if (err) {
//             return next(err)
//         }
//         else {
//             var proposalmap = result.rows.map(function(x) {
//                 x["proposer_id"] = profilemap[x.proposer];
//                 if (x.acceptedby) {
//                     x["acceptedby_id"] = profilemap[x.acceptedby];
//                 }
//                 return x;
//             })
//             //  console.log(profilemap)
//             console.log(req.session.views, req.sessionID)
//             res.end(JSON.stringify(proposalmap));
//         }
//     })
// });

// }

// exports.getMatches = (req, res, next) => {
// helper.loadProfilemap(function(pmap) {
//     profilemap = pmap;
//     db.query('SELECT * FROM matches order by match_id desc', (err, result) => {
//         //console.log("entered query")
//         if (err) {
//             return next(err)
//         }
//         else {
//             var filteredMatches = [];
//             console.log(JSON.stringify(result.rows[0]))

//             filteredMatches = result.rows.filter(function(item) {
//                 item.set1_score = item.set1_score.match(/\d+/g).map(Number).toString().replace(",", "-")
//                 item.set2_score = item.set2_score.match(/\d+/g).map(Number).toString().replace(",", "-")
//                 item.set3_score = item.set3_score.match(/\d+/g).map(Number).toString().replace(",", "-")
//                 item.winner_profile_id = profilemap[item.winner_profile_id].first_name
//                 item.loser_profile_id = profilemap[item.loser_profile_id].first_name
//                 return item;


//             })

//             res.render('displaymatches', { data: filteredMatches, user: req.user.username })
//         }

//     })

// })
// }

// exports.getRankings = (req, res, next) => {
//     db.query('SELECT * FROM matches', (err, result) => {
//         //console.log("entered query")
//         if (err) {
//             return next(err)
//         }
//         res.end(JSON.stringify(result.rows))
//     })
// }

// exports.computeRankings = (req, res, next) => {
//     helper.loadProfilemap(function(pmap) {
//         //  console.log(pmap);
//         var count = 0;
//         var length = _.size(pmap)
//         _.forEach(pmap, function(profile) {
//             var totalpoints = 0;
//             var winning_points = 0;
//             var losing_points = 0;
//             var won = 0;
//             var lost = 0;
//             db.query(`select sum(winning_points) as wp,count(*) as won from matches where winner_profile_id=$1`, [profile.profile_id], function(err, result) {
//                 winning_points = Number(result.rows[0].wp);
//                 won = Number(result.rows[0].won)
//                 db.query(`select sum(losing_points) as lp,count(*) as lost from matches where loser_profile_id=$1`, [profile.profile_id], function(err, result) {
//                     losing_points = Number(result.rows[0].lp);
//                     lost = Number(result.rows[0].lost)
//                     totalpoints = winning_points + losing_points
//                     var text = 'INSERT INTO RANKINGS(NAME,PHONE,RANK,WON,LOST,POINTS,PROFILE_ID) VALUES($1, $2,$3,$4,$5,$6,$7) RETURNING *'
//                     var values = [profile.first_name + " " + profile.last_name, profile.phone, 1, won, lost, totalpoints, profile.profile_id]
//                     db.query(text, values, (err, result) => {
//                         if (err) {
//                             console.log("there is an error");
//                         }
//                         else {
//                             count++
//                             if (count == length) {
//                                 res.end("ok");
//                             }

//                             console.log("w,l,t,successful", winning_points, losing_points, totalpoints)
//                         }
//                     })
//                 })
//             })

//         })
//     })
// }

// exports.cleanupRankings = (req, res, next) => {
//     db.query(`delete from rankings`, function(err, result) {
//         if (err) {
//             next(err)
//         }
//         else {
//             console.log("cleanup", result)
//             next()
//         }
//     })
// }

// exports.finalizeRankings = (req, res, next) => {
//     var length = 0;

//     db.query(`select * from rankings order by points desc`, function(err, result) {
//         // console.log("finalize rankings", result.rows)
//         var i = 0,
//             j = 0;
//         length = result.rows.length
//         var rank = result.rows
//         console.log("finalize rankings", rank)

//         for (i = 0; i < length - 1; i++) {
//             j = i + 1;
//             console.log("rank of i and rank of j is ", i, j, rank[i], rank[j])
//             if (rank[i].points == rank[j].points) {
//                 rank[j].rank = rank[i].rank
//             }
//             else {
//                 rank[j].rank = rank[i].rank + 1;
//             }
//             db.query(`update rankings set rank=$1 where phone=$2`, [rank[j].rank, rank[j].phone], function(err, result) {
//                 if (err) console.log(err)
//             })
//         }
//         res.render("displayrankings", { rank: rank, user: req.user.username })
//     })
// }


// //exports.showMatch = (req, res, next) => {
//     // console.log('req.body is', req.body)
//     var scores = [];
//     console.log(req.params);
//     //console.log("entered scores and req.body id is ", req.body["id"], typeof(req.body["id"]));
//     db.query('select * from matches where proposal_id=$1', [req.params.id], (err, result1) => {
//         if (err) return next(err)
//         if (result1.rows.length > 0) {
//             scores = result1.rows;
//             console.log("available scores ", scores[0].set1_score);
//             try {
//                 scores.score1 = result1.rows[0].set1_score.match(/\d+/g).map(Number)[0]
//                 scores.score2 = result1.rows[0].set2_score.match(/\d+/g).map(Number)[0]
//                 scores.score3 = result1.rows[0].set3_score.match(/\d+/g).map(Number)[0]
//                 scores.score4 = result1.rows[0].set1_score.match(/\d+/g).map(Number)[1]
//                 scores.score5 = result1.rows[0].set2_score.match(/\d+/g).map(Number)[1]
//                 scores.score6 = result1.rows[0].set3_score.match(/\d+/g).map(Number)[1]
//             }
//             catch (err) {
//                 console.log("error while setting scores is ", err)
//             }
//         }

//         db.query('select proposer,acceptedby from proposals where proposal_id=$1', [req.params.id], (err, result) => {
//             if (err) {
//                 return next(err);
//             }
//             else {
//                 console.log("enter scores", result.rows);
//                 if (result.rows.length > 0)
//                 //res.end(`output is , ${JSON.stringify(result.rows)}`)
//                 {
//                     var proposer = profilemap[result.rows[0].proposer];
//                     var acceptedby = profilemap[result.rows[0].acceptedby];
//                     console.log("scores before sending is ", scores)

//                     res.render('match', {
//                         "matchDetails": { "pid": req.params.id, "proposer": proposer, "acceptedby": acceptedby, "scores": scores },
//                         "matchDetailsStringed": JSON.stringify({ pid: req.params.id, proposer: proposer, acceptedby: acceptedby }),
//                         user: req.user.username
//                     });
//                 }
//                 else {
//                     res.end("Invalid proposal id Passed to enter scores")
//                 }
//             }
//         })
//     })
// }
