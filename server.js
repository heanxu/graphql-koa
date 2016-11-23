const Koa = require('koa');
const Router = require('koa-router');
const qs = require('koa-qs');
const parseBody = require('co-body');
const mongoose = require('mongoose');
const { graphql } = require('graphql');
const userSchema = require('./schema/user');

let routes = new Router();
let app = Koa();

qs(app);
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/graphql');

routes.get('/user', function* () {
  let query = this.query.query;
  let params = this.query.params;
  let resp = yield graphql(userSchema, query, '', params);

  if (resp.errors) {
    this.status = 400;
    return this.body = {
      errors: resp.errors
    };
  }
  this.body = resp;
});

routes.post('/user', function* () {
  let payload = yield parseBody(this);
  let resp = yield graphql(userSchema, payload.query, '', payload.params);

  if (resp.errors) {
    this.status = 400;
    return this.body = {
      errors: resp.errors
    };
  }
  this.body = resp;
});


app.use(routes.middleware());
app.listen(3000, () => {
  console.log('>>| App is listening on ' + 3000);
});

module.exports = app;
