var express = require('express');
var express_graphql = require('express-graphql').graphqlHTTP
var { buildSchema } = require('graphql');

// GraphQL schema
var schema = buildSchema(`
    type Query {
        roaster(id: Int!): Roaster
        roastersByLocation(location: String): [Roaster]
    },
    type Roaster {
        id: Int
        name: String
        location: String
        url: String
    }
`);

const roasterData = [
    {
        id: 1,
        name: 'Merit Coffee Co.',
        location: 'San Antonio, Texas',
        url: 'https://meritcoffee.com/'
    },
    {
        id: 2,
        name: 'Oak Cliff Coffee Roasters',
        location: 'Dallas, Texas',
        url: 'https://www.oakcliffcoffee.com/'
    },
    {
        id: 3,
        name: 'Austin Roasting Company',
        location: 'Austin, Texas',
        url: 'https://austinroastingcompany.com/'
    },
    {
        id: 4,
        name: 'Wild Gift Coffee',
        location: 'Austin, Texas',
        url: 'https://wildgiftcoffee.com/'
    }
];

// Service (this is what would access the db and do the correct query)
const getRoaster = function(args) { 
    var id = args.id;
    return roasterData.filter(course => {
        return course.id == id;
    })[0];
};

const getRoasters = function(args) {
    if (args.location) {
        var location = args.location;
        return roasterData.filter(course => course.location === location);
    } else {
        return roasterData;
    }
};

// attaching the schema
const root = {
    roaster: getRoaster,
    roastersByLocation: getRoasters,
};

// Create an express server and a GraphQL endpoint
const app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));