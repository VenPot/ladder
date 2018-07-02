const { Pool } = require('pg')
const auth = require('./controllers/auth');
var _ = require('lodash');

//const pool = new Pool()

const pool = new Pool({
  user: 'test',
  database: 'test',
  password: 'test'

})

exports.query = (text, params, callback) => {
  return pool.query(text, params, callback)
}



var records = [];

exports.findById = function(id, cb) {
  // var credentailData = helper.getCredentails();
  // console.log("find by id", credentailData);
  console.log("find by id", records);

  process.nextTick(function() {
    //  var idx = id - 1;
    if (records[0]) {
      cb(null, records[0]);
    }
    else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {
  console.log('username in find by username is ', username);
  auth.getCredentials(username, function(result) {
    if (!_.isEmpty(result)) {
      records = result;
      console.log("find by username", records);
      process.nextTick(function() {
        try {
          for (var i = 0, len = records.length; i < len; i++) {
            var record = records[i];
            if (record.username === username) {
              return cb(null, record);
            }
          }
        }
        catch (err) {
          if (err) return cb(null, null);
        }

      });
    }
    else {
      return cb(null, null);
    }
  });
};
