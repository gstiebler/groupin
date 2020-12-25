import { buildSchema } from 'graphql';
import fs = require('fs');
import path = require('path');

const gqlPath = path.join(__dirname, './schema.gql');
const schema = buildSchema(fs.readFileSync(gqlPath, 'utf8'));

export default schema;
