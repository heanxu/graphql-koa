
const request = require('superagent');
const userId = '559645cd1a38532d14349246';
const deleteId = '559645cd1a38532d14349240';
const name = 'HeanXu';
const updateName = 'HeanHsu';
const age = 22;
const updateAge = 23;

request
.post('http://localhost:3000/user')
.send({
	query: ` mutation M($name: String!, $age: Int) {
	  createUser(name: $name, age: $age) {
	    name,
	    age
	  }
	}`,
	params: {
		name: name,
		age: age
	}
}).end((err, res) => {
	if(err) return console.error(err);
	console.log('createUser', res.body);
});

request
.get('http://localhost:3000/user')
.query({
	query: `{
        user(id: "${userId}") {
        	name
        	manage {
        		name
        	}
        }
    }`
})
.end((err, res) => {
	if(err) return console.error(err);
	console.log('queryUser', res.body.data.user);
});

request
.post('http://localhost:3000/user')
.send({
	query: `
	mutation M($userId: String! $name: String!) {
	  updateUser(id: $userId, name: $name) {
	    name
	  }
	}`,
	params: {
	  userId: userId,
	  name: updateName
	}
}).end((err, res) => {
	if(err) return console.error(err);
	console.log('updateUser', res.body.data.updateUser);
});

request
.post('http://localhost:3000/user')
.send({
	query: `
	mutation M($userId: String!) {
	  deleteUser(id: $userId) {
	    name
	    age
	  }
	}
	`,
	params: {
	  userId: deleteId
	}
})
.end((err, res)=> {
	if(err) return console.error(err);
	console.log('deleteUser', res.body);
});
