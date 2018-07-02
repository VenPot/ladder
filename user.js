var express = require("express");
var path = require("path");
var db = require(path.join(__dirname, 'db.js'));
var mailer = require(path.join(__dirname, '/controllers/mailer.js'))
const bodyParser = require('body-parser');
var session = require('express-session');
var exphbs = require("express-handlebars");
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
//const flash = require('express-flash');
const helmet = require('helmet');
//const transporter = nodemailer.createTransport(transport, defaults])
var passport = require('passport');
var passportConfig = require(path.join(__dirname, '/config/passportConfig.js'))
var app = express();

app.use(helmet());
app.use(helmet.noCache());

app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.static(path.join(__dirname, 'Public', 'CSS')));
app.use(express.static(path.join(__dirname, 'Public', 'unprotectedHTML')));
app.use(express.static(path.join(__dirname, 'Public', 'HTML')));
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(expressValidator());
app.use(session({
  name: 'ladder.sid',
  secret: 'mouse dog',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 }
}))

app.use(passport.initialize());
app.use(passport.session());

//Route controllers
//const playerController = require('./controllers/player');
//const homeController = require('./controllers/home');
const proposalController = require('./controllers/proposal');
const matchController = require('./controllers/match');
const helper = require('./controllers/helper');
const auth = require('./controllers/auth')
const accountController = require('./controllers/account');
const rankController = require('./controllers/rank');

app.use(function(req, res, next) {
  //res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});




/**
Login routes
*/
app.get('/', (req, res, next) => { res.redirect('/home.html') });
app.get('/signupConfirmation', mailer.sendSignupEmail);
app.get('/signup', (req, res) => { res.render('signup') })
app.get('/forgot', (req, res) => { res.render('forgot') })
app.post('/forgotPassword', auth.validateUserEmailForReset, auth.generateToken, mailer.sendForgotPassword)
app.post('/reset', auth.validateResetToken, auth.showReset)
app.post('/updatePassword', auth.hashPassword, accountController.isNotLastPassword, accountController.updateProfilePassword)
app.get('/login', function(req, res) { // If status is 1 message gets displayed 
  // if (req.user) {
  //   res.redirect('/showProposals')
  // }
  // else {
  res.render('login', { message: { status: 0, class: "text-info", message: "Please Login" } })
  //}

});
app.get('/loginfail', function(req, res) {
  res.render('login', { message: { status: 1, class: "text-danger", message: "Incorrect username or Password! Please try again" } })
})

app.post('/login', passport.authenticate('local', {
  failureRedirect: '/loginfail',
  successRedirect: '/showProposals'
}))

app.get('/logout', passportConfig.logout);

app.post('/addProfile', [
  check('fname').trim(), check('lname').trim(), check('email').isEmail().withMessage('must be an email')
], auth.hashPassword, accountController.addProfile);

/**
 * Proposal routes
 */

app.get('/getProposals', passportConfig.isAuthenticated, proposalController.getProposals);
app.post('/addProposal', passportConfig.isAuthenticated, [check('place').trim()], proposalController.addProposal);
app.post('/acceptProposal', passportConfig.isAuthenticated, proposalController.acceptProposal, mailer.sendAcceptedProposal);
app.get('/showProposals', passportConfig.isAuthenticated, (req, res) => { res.render('proposals', { user: req.user.username, userid: req.user.id }) });
app.get('/declineProposal/:proposalId', passportConfig.isAuthenticated, proposalController.decline)
app.get('/cancelProposal/:proposalId', passportConfig.isAuthenticated, proposalController.cancel)

/**
 * Match routes
 */

app.post('/addMatchScores', passportConfig.isAuthenticated, matchController.validateMatch, matchController.addMatchScores);
app.get('/getMatches', passportConfig.isAuthenticated, matchController.getMatches);
app.get('/showMatch/:id', passportConfig.isAuthenticated, matchController.showMatch)

/**
 * Rank routes
 */
app.get('/rankings', passportConfig.isAuthenticated, rankController.cleanupRankings, rankController.computeRankings) //add last computed fot table rankings
app.get('/getRankings', passportConfig.isAuthenticated, rankController.finalizeRankings)

app.listen(process.env.PORT, function() {
  console.log(`server started on port: ${process.env.PORT}`);
});
