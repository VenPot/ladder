// var path = require("path");
// var _ = require('lodash');
// var helper = require('./helper')

// // var db = require(path.join(__dirname, 'db.js'));
// const db = require('../db');
// const { check, validationResult } = require('express-validator/check');


// exports.addProfile = (req, res, next) => {
//   console.log("i have entered the post body");
//   console.log(req.body);
//   console.log("Starting Validation");
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     console.log(errors.mapped())
//     return res.status(422).json({ errors: errors.mapped() });
//   }
//   else {
//     const text = 'INSERT INTO profiles(phone, first_name,last_name,email,emailoptin,skill,username,password) VALUES($1, $2,$3,$4,$5,$6,$7,$8) RETURNING *'
//     const values = [req.body.phone, req.body.fname, req.body.lname, req.body.email, req.body.optin, req.body.skill, req.body.username, req.body.password];
//     db.query(text, values, (err, result) => {
//       console.log("entered query")
//       if (err) {
//         return next(err)
//       }
//       else {
//         if (result.rows[0]) {
//           req.session.email = req.body.email
//           res.redirect('/signupConfirmation')
//         }
//         else {
//           res.end("Sorry cant sign you up")
//         }


//       }
//     })

//     // res.end(`output is , ${JSON.stringify(req.body)}`)
//   }
// }

// exports.updateProfilePassword = function(req, res, next) {
//   db.query(`update profiles set password=$1 where email=$2`, [req.body.password, req.session.email], (err, result) => {
//     if (err) return next(err)
//     console.log('query result in update profile Password', result)

//     res.render('login', { message: { status: 1, class: "text-success", message: "Password Successfully Changed!, Please login." } })

//   })
// }


// exports.addProposal = (req, res, next) => {
//   helper.loadProfilemap(function(pmap) {
//     var profilemap = pmap;
//     console.log("i have entered the post body");
//     console.log(req.body);
//     console.log("Starting Validation");
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       console.log(errors.mapped())
//       return res.status(422).json({ errors: errors.mapped() });
//     }
//     else {
//       const text = 'INSERT INTO proposals(proposer,phone,day,timestamp,location,status) VALUES($1, $2,$3,$4,$5,$6) RETURNING *'
//       const values = [req.user.id, profilemap[req.user.id].phone, req.body.day, req.body.gametime, req.body.place, 'f'];
//       db.query(text, values, (err, result) => {
//         console.log("entered query");
//         if (err) {
//           return next(err)
//         }
//         else {
//           console.log("result rows is ", result.rows);
//           res.render('messages');
//         }
//       })
//       //res.end(`output is , ${JSON.stringify(req.body)}`)
//     }
//   })

// }

// exports.acceptProposal = (req, res, next) => {
//   console.log(req.body);
//   var acceptedPlayer = req.user.id;
//   var proposalId = req.body.id;
//   var text = `UPDATE PROPOSALS set acceptedby=$1,status=$2 where proposal_id=$3 RETURNING *`;
//   var values = [acceptedPlayer, 't', proposalId];
//   db.query(text, values, (err, result) => {
//     if (err) {
//       //return next(err)
//       console.log("error inside acceptProposal is ", err)
//       res.end('notok')
//     }
//     else {
//       //if (result.rows.length > 0) {
//       console.log("ready to redirect", req.user);
//       // res.send("ok");
//       helper.loadProfilemap(function(pmap) {
//         res.end(pmap[req.user.id].first_name)
//       })
//       //}
//     }
//   })
// }

// exports.determineWinner = (req, res, next) => {

// }
// // exports.add1Scores = (req, res, next) => {

// //   console.log(req.body);
// //   var winner, loser, winner_rank, loser_rank, wp = 25,
// //     lp = 5;
// //   var x = {}
// //   //{ proposer_id: "1",
// //   //   acceptedby_id: "3",
// //   //   scores: [
// //   //     [6, 2],
// //   //     [3, 6],
// //   //     [6, 4]
// //   //   ],
// //   //   proposal_id: "1"
// //   // }
// //   x = req.body;
// //   console.log("x", x, typeof(x))
// //   var setDifference = Math.abs((match.scores[0][0] + match.scores[1][0] + match.scores[2][0]) > (match.scores[0][1] + match.scores[1][1] + match.scores[2][1]));
// //   if ((match.scores[0][0] + match.scores[1][0] + match.scores[2][0]) > (match.scores[0][1] + match.scores[1][1] + match.scores[2][1])) {
// //     winner = match.proposer_id;
// //     wp = wp + 5;
// //     loser = match.acceptedby_id;
// //   }
// //   else {
// //     winner = match.acceptedby_id;
// //     loser = match.proposer_id;
// //     lp = lp + 5;
// //     //match_id | winner_profile_id | loser_profile_id | winning_points | losing_points | proposal_id | set1_score | set2_score | set3_score | set4_score | set5_score 
// //   }
// //   // create functionality to get ranks
// //   db.query(`select rank as winner_rank from rankings where profile_id=$1`, [winner], (err, result) => {
// //     if (err) return next(err)
// //     winner_rank = result.rows[0].winner_rank
// //     db.query(`select rank as loser_rank from rankings where profile_id=$1`, [loser], (err, result) => {
// //       if (err) return next(err)
// //       loser_rank = result.rows[0].loser_rank
// //       const text = `INSERT INTO matches(winner_profile_id, loser_profile_id,winning_points,losing_points,proposal_id,set1_score,set2_score,set3_score,winner_rank,loser_rank) 
// //       VALUES($1, $2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`
// //       const values = [winner, loser, wp, lp, match.proposal_id, match.scores[0], match.scores[1], match.scores[2], winner_rank, loser_rank];
// //       db.query(text, values, (err, result) => {
// //         console.log("entered query")
// //         if (err) {
// //           if (_.includes(err.message, 'uniqpropid')) {
// //             console.log("error message is ", err.message);
// //             db.query('update matches set winner_profile_id=$1,loser_profile_id=$2,winning_points=$3,losing_points=$4,set1_score=$6,set2_score=$7,set3_score=$8,winner_rank=$9,loser_rank=$10 where proposal_id=$5 returning *', values, (err, result) => {
// //               if (err) {
// //                 return next(err);
// //               }
// //               else {
// //                 console.log("from update", result.rows);

// //                 res.end(`output is , ${JSON.stringify(result.rows)}`)
// //               }
// //             })
// //           }
// //           else {
// //             return next(err);
// //           }
// //         }
// //         else {
// //           console.log("from insert", result.rows);
// //           res.end(`output is , ${JSON.stringify(result.rows)}`)
// //         }
// //       })
// //     })
// //   })

// // }


// exports.addScores = async(req, res, next) => {
//   console.log(req.body);
//   var winner, loser, winner_rank, loser_rank, wp = 25,
//     lp = 5;
//   var match = {}
//   match = req.body;
//   console.log("match", match, typeof(match))
//   var setDifference = Math.abs((match.scores[0][0] + match.scores[1][0] + match.scores[2][0]) > (match.scores[0][1] + match.scores[1][1] + match.scores[2][1]));
//   if ((match.scores[0][0] + match.scores[1][0] + match.scores[2][0]) > (match.scores[0][1] + match.scores[1][1] + match.scores[2][1])) {
//     winner = match.proposer_id;
//     wp = wp + 5;
//     loser = match.acceptedby_id;
//   }
//   else {
//     winner = match.acceptedby_id;
//     loser = match.proposer_id;
//     lp = lp + 5;
//     //match_id | winner_profile_id | loser_profile_id | winning_points | losing_points | proposal_id | set1_score | set2_score | set3_score | set4_score | set5_score 
//   }

//   winner_rank = await db.query(`select rank as winner_rank from rankings where profile_id=$1`, [winner], (err, result) => {
//     if (err) return next(err)
//     return result.rows[0].winner_rank
//   })
//   loser_rank = await db.query(`select rank as loser_rank from rankings where profile_id=$1`, [loser], (err, result) => {
//     if (err) return next(err)
//     return result.rows[0].loser_rank
//   })

//   const text = `INSERT INTO matches(winner_profile_id, loser_profile_id,winning_points,losing_points,proposal_id,set1_score,set2_score,set3_score,winner_rank,loser_rank) 
//                 VALUES($1, $2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`
//   const values = [winner, loser, wp, lp, match.proposal_id, match.scores[0], match.scores[1], match.scores[2], winner_rank, loser_rank];

//   db.query(text, values, (err, result) => { //Insert for news score or update existing
//     console.log("entered query")
//     if (err) {
//       if (_.includes(err.message, 'uniqpropid')) {
//         console.log("error message is ", err.message);
//         db.query('update matches set winner_profile_id=$1,loser_profile_id=$2,winning_points=$3,losing_points=$4,set1_score=$6,set2_score=$7,set3_score=$8,winner_rank=$9,loser_rank=$10 where proposal_id=$5 returning *', values, (err, result) => {
//           if (err) return next(err);
//           console.log("from update", result.rows);
//           res.end(`output is , ${JSON.stringify(result.rows)}`)
//         })
//       }
//       else {
//         return next(err);
//       }
//     }
//     else {
//       //  console.log("from insert", result.rows);
//       res.end(`output is , ${JSON.stringify(result.rows)}`)
//     }
//   })

// }
