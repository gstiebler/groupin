const { buildSchema } = require('graphql');
const fs = require('fs');
const path = require('path');

const gqlPath = path.join(__dirname, '/schema.gql');
const schema = buildSchema(fs.readFileSync(gqlPath, 'utf8'));

module.exports = schema;
