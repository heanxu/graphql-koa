const mongoose = require('mongoose');
const User = require('./model/user');

mongoose.connect('mongodb://localhost/graphql');

const users = [
  {
    _id: '559645cd1a38532d14349246',
    name: 'jing',
    manage: ['559645cd1a38532d14349240']
  },
  {
    _id: '559645cd1a38532d14349240',
    name: 'worker1',
    manage: []
  }
];

mongoose.connection.collections['users'].drop((err) => {
  User.create(users, (err, res) => {
    if(err) return console.error(err);
    console.log('User data created.');
    process.exit();
  });
});


