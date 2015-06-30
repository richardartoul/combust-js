var io = require('socket.io-client');
var r = require('rethinkdb');
var db = require('../db');
var parseToRows = require('../utils/parseToRows');
var parseToObj = require('../utils/parseToObj');
var should = require('should');
var supertest = require('supertest');
var configTest = require('./configTest');

var utils = configTest.utils;
var serverAddress = configTest.serverAddress;

xdescribe('delete', function() {
  var socket;
  var agent;
  before(function(done) {
    configTest.resetDb(function() {
      configTest.authenticateSocket(function(newSocket, newAgent) {
        socket = newSocket;
        agent = newAgent;
        done();
      });
    });
  });

  beforeEach(function(done) {
    var rows = parseToRows({msg1: {from:'mom'}, msg2: {from: 'dad'}, room: 'main'}, '/user5/', 'messages');
    db.connect(function(conn) {
      r.db(utils.dbName).table(utils.tableName).insert({path: '/', _id: 'user5'}).run(conn, function(err, results) {
        if (err) throw err;
        r.db(utils.dbName).table(utils.tableName).insert(rows).run(conn, function(err, results) {
          if (err) throw err;
          done();
        })
      });
    });
  });

  after(function(done) {
    configTest.resetDb(function() {
      done();
    });
  });

  it('should delete static properties', function(done) {
    socket.once('/user5/room/-deleteSuccess', function() {
      db.connect(function(conn) {
        r.db(utils.dbName).table(utils.tableName).filter({path: '/', _id: 'user5'}).run(conn, function(err, cursor) {
          if (err) throw err;
          cursor.toArray(function(err, array) {
            if (err) throw err;
            console.log('In static properties test, root node where static properties used to be looks like: ', array);
            array[0].room.should.not.exist;
            done();
          });
        });
      });
    });
    socket.emit('delete', {path: '/user5/room/'});
  });

  it('should delete nested objects', function(done) {
    socket.once('/user5/messages/-deleteSuccess', function() {
      db.connect(function(conn) {
        //check if root node was deleted
        r.db(utils.dbName).table(utils.tableName).filter({path: '/user5/', _id: 'messages'}).run(conn, function(err, cursor) {
          if (err) throw err;
          cursor.toArray(function(err, array) {
            if (err) throw err;
            console.log('In nested objects test, filter for root node returned: ', array);
            array[0].length.should.equal(0);
            //check if children were deleted
            r.db(utils.dbName).table(utils.tableName).filter(r.row('path').match('/user5/messages/*')).run(conn, function(err, cursor) {
              if (err) throw err;
              cursor.toArray(function(err, array) {
                console.log('In nested objects test, filter for children returned: ', array);
                array.length.should.eql(0);
                done();
              });
            });
          });
        });
      });
    });
    socket.emit('delete', {path: '/user5/messages/'});
  });
});
