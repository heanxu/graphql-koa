const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} = require('graphql/type');
const co = require('co');
const User = require('../model/user');

function getProjection (fieldASTs) {
  return fieldASTs.selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = 1;
    return projections;
  }, {});
}

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      type: GraphQLString
    },
    age: {
      type: GraphQLInt
    },
    manage: {
      type: new GraphQLList(userType),
      resolve: (user, params, source, fieldASTs) => {
        return User.find({
          _id: {
            $in: user.manage.map((id) => id.toString())
          }
        }, getProjection(fieldASTs));
      },
    }
  })
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      server: {
        type: GraphQLString,
        resolve: () => {
          return 'node';
        }
      },
      user: {
        type: userType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (root, {id}, source, fieldASTs) => {
          return User.findById(id, getProjection(fieldASTs));
        }
      }
    }
  }),

  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: {
        type: userType,
        args: {
          name: {
            name: 'name',
            type: GraphQLString
          },
          age: {
            name: 'age',
            type: GraphQLInt
          }
        },
        resolve: (obj, {name, age}, source, fieldASTs) => co(function *() {
          let user = new User();
          user.name = name;
          user.age = age;
          return yield user.save();
        })
      },
      deleteUser: {
        type: userType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (obj, {id}, source) => co(function *() {
          return yield User.findOneAndRemove({_id: id});
        })
      },
      updateUser: {
        type: userType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLString)
          },
          name: {
            name: 'name',
            type: GraphQLString
          },
          age: {
            name: 'age',
            type: GraphQLInt
          },
          manage: {
            name: 'manage',
            type: GraphQLList
          }
        },
        resolve: (obj, {id, name, age}, source, fieldASTs) => co(function *() {
          yield User.update({
            _id: id
          }, {
            $set: {
              name: name,
              age: age
            }
          });
          return yield User.findById(id, getProjection(fieldASTs));
        })
      }
    }
  })
});

module.exports = schema;
