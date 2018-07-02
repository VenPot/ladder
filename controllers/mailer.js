exports = module.exports = {}
const nodemailer = require('nodemailer')
var helper = require('./helper')
const db = require('../db');
var profilemap = {};


var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'botsbyvenopot2@gmail.com', // Your email id
        pass: '01Jan2013#@' // Your password
    }
});


exports.sendSignupEmail = function(req, res, next) {

    var text = "Welcome"
    var mailOptions = {
        from: 'botsbyvenopot2@gmail.com', // sender address
        to: `${req.session.email}`, // list of receivers
        subject: 'Welcome to TopTennis!', // Subject line
        //text: text, //, // plaintext body
        html: `<b>Thank you for signing up ${req.body.fname}. We are excited to have you!! Happy Playing! ✔</b> <br> <br>
               <img src="https://cdn.pixabay.com/photo/2016/09/10/17/30/tennis-balls-1659737_960_720.jpg" 
               alt="Top Tennis. Play now.">` // You can choose to send an HTML body instead
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.json({ yo: 'error' });
        }
        else {
            console.log('Message sent: ' + info.response);
            res.render('login', { message: { status: 1, class: "text-success", message: "Thank you for signing up !, Please login." } })
        };
    });

}


exports.sendForgotPassword = function(req, res, next) {

    var text = `Your Username is : ${req.session.username}. \nVerication code will expire in 1 hour. Your verificaiton code is ${req.session.token}\n `
    var mailOptions = {
        from: 'botsbyvenopot2@gmail.com', // sender address
        to: `${req.session.email}`, // list of receivers
        subject: 'TopTennis Password reset!', // Subject line
        text: text //, // plaintext body
        // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.json({ yo: "error" });
        }
        else {
            console.log('Message sent: ' + info.response);
            res.render('verificationCode')
            // res.json({ Password: 'An email has been sent your account with a password reset link.' });
        };
    });

}

//not using this yet
exports.sendAcceptedProposal = async(req, res, next) => {
    var profilemap = {},
        venue = {};
    var acceptedBy_id = req.user.id;
    var proposer_id = req.body.proposer_id;
    var proposal_id = req.body.id;

    helper.loadProfilemap(function(pmap) {
        // mailer.sendAcceptedProposal

        //console.log("pmap is", pmap)
        profilemap = pmap;
        res.end(profilemap[acceptedBy_id]['first_name'])
        db.query(`select day,timestamp,location from proposals where proposal_id=$1`, [proposal_id], (err, result) => {
            if (err) console.log(err.message)
            console.log('result.rows[0] is', result.rows[0])
            venue = result.rows[0]
            //console.log("typeof(venue),typeof(venue.day)", typeof(venue), venue.day, typeof(venue.day))
            //console.log('venue inside query is', venue)
            // var text = `Proposal posted by ${profilemap[proposer_id]['first_name']}(${profilemap[proposer_id]['phone']}) 
            // at ${venue['location']} on ${venue.day}, ${venue.timestamp.substring(0,10)} is accepted by ${profilemap[acceptedBy_id]['first_name']}(${profilemap[acceptedBy_id]['phone']})\n`
            var mailOptions = {
                from: 'botsbyvenopot2@gmail.com', // sender address
                to: `${profilemap[proposer_id]['email']},${profilemap[acceptedBy_id]['email']}`, // list of receivers
                subject: 'Proposal accepted!', // Subject line
                // text: text, //, // plaintext body
                html: `<h1>You got a game!</h1>
<p></p>
<table border="1" style="border-collapse: collapse; width: 100%;">
<tbody>
<tr style="height: 20px;">
<td style="width: 13.0952%; height: 20px;"><strong>Venue</strong></td>
<td style="width: 13.1512%; height: 20px;"><strong>${JSON.stringify(venue.day).substring(1,10)}, ${venue.timestamp}</strong></td>
<td style="width: 13.2155%; height: 20px;"><strong>${venue['location']}</strong></td>
</tr>
<tr style="height: 15px;">
<td style="width: 13.0952%; height: 15px;"><strong>Proposer</strong></td>
<td style="width: 13.1512%; height: 15px;">${profilemap[proposer_id]['first_name']}</td>
<td style="width: 13.2155%; height: 15px;">${profilemap[proposer_id]['phone']}</td>
</tr>
<tr style="height: 21px;">
<td style="width: 13.0952%; height: 21px;"><strong>Accepted by</strong></td>
<td style="width: 13.1512%; height: 21px;">${profilemap[acceptedBy_id]['first_name']}</td>
<td style="width: 13.2155%; height: 21px;">${profilemap[acceptedBy_id]['phone']}</td>
</tr>
</tbody>
</table>
<p></p>
<p><span style="color: #000000;">Good luck!!&nbsp;&nbsp;</span></p>` // You can choose to send an HTML body instead
            };


            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                    // res.json({ yo: "error" });
                }
                else {
                    console.log('Message sent: ' + info.response);
                    //res.end(profilemap[req.user.id].first_name)
                    // res.render('verificationCode')
                    // res.json({ Password: 'An email has been sent your account with a password reset link.' });
                };
            });

        })
    })
    //console.log("profilemap in mailer is ", profilemap)




    // console.log("req.user.id,req.body.proposer_id,proposal_id,venue", req.user.id, req.body.proposer_id, proposal_id, venue)






}
