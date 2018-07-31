
const { graphql } = require('graphql');
const schema = require('./src/graphqlSchema');

function main(req, res) {
  graphql(schema, req.query).then(result => res.send(result));
}

module.exports = { main };
