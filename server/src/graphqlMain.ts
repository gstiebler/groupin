import * as admin from 'firebase-admin';
import { graphql } from 'graphql';
import * as _ from 'lodash';
import rootValue from './resolver';
import schema from './graphqlSchema';
import logger from './config/winston';
import { User } from './db/entity/User';
import { Connection } from 'typeorm';

type GraphQLParams = Parameters<typeof graphql>;
type graphqlVariables = GraphQLParams[4];

export async function main(
  { query, variables }: { query: string, variables: graphqlVariables },
    authFbToken: string,
    connection: Connection
) {
  try {
    let user: User | undefined = undefined;
    let firebaseId: string | null = null;
    // ***
    if (authFbToken) {
      logger.debug(authFbToken);
      // authFbToken comes from the client app
      const decodedToken = await admin.auth().verifyIdToken(authFbToken);
      firebaseId = decodedToken.uid;
      const userRepository = connection.getRepository(User);
      user = await userRepository.findOne({ externalId: firebaseId });
    }
    const result = await graphql(schema, query, rootValue, { user, firebaseId, connection }, variables);
    logger.debug(JSON.stringify(query, null, 2));
    logger.debug(JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    logger.error(error);
    return -1;
  }
}
