var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
const _ = require('lodash')
//var request = require('superagent');

//var app = require('../user.js')

var host = 'https://ladder-curious2code.c9users.io'
//var host = 'https://www.google.com/'

//request = request.bind(request, host);

//request = request('https://ladder-curious2code.c9users.io')

//var Cookies;

describe('checkPublicroutes', function() {
    it('respond with 302 for home', function(done) {
        request(host)
            .get('/')
            .expect(302, done);
        //request.get(host).expect(302, done);
    });
    it('respond with 200 for login', function(done) {
        request(host)
            .get('/login')
            .expect(200, done);
    });
    it('respond with 200 for forgot', function(done) {
        request(host)
            .get('/forgot')
            .expect(200, done);
    });
    it('respond with 200 for signup', function(done) {
        request(host)
            .get('/signup')
            .expect(200, done);
    });



})


describe('login', function() {
    it('should fail when trying to Login with bad credentials', function(done) {
        request(host)
            .post('/login')
            .send({ username: 'Rogr', password: 'Apple12' })
            .expect(302)
            .end(function(err, res) {

                if (err) return done(err);
                if (!_.includes(res.text, 'showProposals')) return done();
                else done(new Error('able to login with bad creds'));
            });
    })
    it('should pass when trying to Login with good credentials', function(done) {
        request(host)
            .post('/login')
            .send({ username: 'Roger', password: 'Apple12' })
            .expect(302)
            .end(function(err, res) {
                if (err) return done(err);
                if (!_.includes(res.text, 'showProposals')) return done(new Error('Not able to login'));
                else {
                    //Cookies = res.headers['set-cookie'].pop().split(';')[0];
                    done();
                }
            });
    })
})




describe('Check private routes', function() {
    const agent = request.agent(host);
    const agent1 = request.agent(host);
    it('should display login', function(done) {
        agent
            .post('/login')
            .send({ username: 'Roger', password: 'Apple12' })
            .expect(302, done)
    })

    it('should display rankings', function(done) {

        agent
            .get('/getRankings')
            .expect('location', 'getRankings')
            .expect(200, done)
    })


    it('should display proposals', function(done) {

        agent
            .get('/showProposals')
            .expect(200, done)
    })


    it('should display matches', function(done) {

        agent
            .get('/getMatches')
            .expect(200, done)
    })
})
