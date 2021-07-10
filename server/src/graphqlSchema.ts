import { buildSchema } from 'graphql';
import * as fs from 'fs';
import * as path from 'path';

const gqlPath = path.join(__dirname, '../src/schema.gql');
const schema = buildSchema(fs.readFileSync(gqlPath, 'utf8'));

export default schema;
