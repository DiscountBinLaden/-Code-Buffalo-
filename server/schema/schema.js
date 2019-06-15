const graphql = require('graphql');
//const finder = require('lodash');
const User = require("../user.js");
const { ApolloServer, gql } = require('apollo-server');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLInt,
    GraphQLFloat,
    GraphQLNonNull
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        userID: { type: GraphQLString },
        passwd: { type: GraphQLString },
        avgPrice: { type: GraphQLFloat },
        priceN: { type: GraphQLInt }
    })
});

const typeDefs = gql`
  type Event {
    activity: String!
    accessibility: Float!
    type: String!
    participants: Int!
    price: Float!
    key: Int!
  }

  type Query {
    event(price: Float!): Event
    events: [Event]
  }
`;


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        User: {
            type: UserType,
            args: { id: { type: new GraphQLNonNull(GraphQLString) } },
            resolve(parent, args) {
                //console.log(arguments);
                return User.findById(args.id);
            }
        },
        event: {
            args: { price: { type: new GraphQLNonNull(GraphQLFloat) } },
            resolve(parent, args) {
                event: (root, { price }, { dataSources }) =>
                    dataSources.BoredAPI.getEventP(price)
            }
        },
        rndEvent: {
            resolve() {
                events: (root, args, { dataSources }) => dataSources.BoredAPI.getRandomEvent()
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                userID: { type: GraphQLString },
                passwd: { type: GraphQLString },
                avgPrice: { type: GraphQLFloat },
                priceN: { type: GraphQLInt }
            },
            resolve(parent, args) {
                let tempUser = new User({
                    userID: { type: new GraphQLNonNull(GraphQLString) },
                    passwd: { type: new GraphQLNonNull(GraphQLString) },
                    avgPrice: { type: new GraphQLNonNull(GraphQLFloat) },
                    priceN: { type: new GraphQLNonNull(GraphQLInt) }
                });
                return tempUser.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
