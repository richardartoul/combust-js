var supertest = require('supertest');

module.exports = {
  serverAddress: 'http://127.0.0.1:3000',
  utils: {
    dbName: 'test',
    tableName: 'test',
    testObj: {
      users: {
        user1: {
          name: "richie"
        },
        user2: {
          name: "kuldeep"
        },
        user: {
          name: "jack",
          something: ['hi', {something: 'hi'}]
        }
      },
      activated: true,
      messedUp: false,
      test: {
        name: "viable"
      }
    },
    dummyObj: {
      users: {
        user1: {
          name: "richie"
        },
        user2: {
          name: "kuldeep"
        },
        user: {
          name: "jack",
          something: ['hi', {something: 'hi'}]
        }
      },
      activated: true,
      messedUp: false,
      test: {
        name: "viable"
      }
    },
    testRows: {
      testRoot: { path: '/root/', _id: 'testObj', activated: true, messedUp: false },
      testChildren: [ 
        { path: '/root/testObj/users/', _id: 'user1', name: 'richie' },
          { path: '/root/testObj/users/', _id: 'user2', name: 'kuldeep' },
          { path: '/root/testObj/users/user/something/', _id: '1', something: 'hi', _partArray: true },
          { '0': 'hi', path: '/root/testObj/users/user/', _id: 'something', _isArray: true, _length: 2 },
          { path: '/root/testObj/users/', _id: 'user', name: 'jack' },
          { path: '/root/testObj/', _id: 'users' },
          { path: '/root/testObj/', _id: 'test', name: 'viable' }
      ]
    },
    testUser: {
      username: "testUser",
      password: "testPassword",
      email: "testEmail"
    },
    authUser: {
      username: "authUser",
      password: "authPassword",
      email: "authEmail"
    },
    createAgent: function(server) {
      var server = server || this.serverAddress;
      return supertest.agent(server);
    },
  }
}