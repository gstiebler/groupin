import * as firebaseAdmin from 'firebase-admin';
import { Query, Resolver, Mutation, Arg, Field, InputType, ObjectType, Ctx } from 'type-graphql'
import { subscribeToAll } from '../lib/subscription';
import { Context } from '../graphqlContext';
import logger from '../config/winston';
import { encodeAuthToken } from '../lib/auth';

@InputType()
class HelloInput {
  @Field()
  pass: string
}

@ObjectType()
class RegisterResult {
  @Field()
  errorMessage: string;
  
  @Field()
  authToken: string;
}

@ObjectType()
class UserResult {

}

@Resolver(() => UserResult)
export class RootResolver {

  @Query(() => String)
  async getHello(
    @Arg('helloInput') helloInput: HelloInput,
    @Ctx() ctx: Context
  ): Promise<String> {
    logger.debug(ctx.externalId);
    return helloInput.pass === 'foca' ? 'OK' : 'ERROR';
  }

  @Query(() => String)
  async getAuthToken(
    @Arg('firebaseAuthToken') firebaseAuthToken: string,
    @Ctx() { db }: Context
  ): Promise<string> {
    const decodedFirebaseToken = await firebaseAdmin.auth().verifyIdToken(firebaseAuthToken);
    const firebaseId = decodedFirebaseToken.sub;
    const user = await db.User.findOne({ externalId: firebaseId });
    const authToken = encodeAuthToken({
      userId: user?._id,
      externalId: firebaseId,
    });
    return authToken;
  }

  @Mutation(() => RegisterResult)
  async register(
    @Arg('name') name: string,
    @Ctx() { userId, externalId, db }: Context
  ): Promise<RegisterResult> {
    if (userId) {
      throw new Error('User is already registered');
    }
    const newUser = await db.User.create({
      name: name,
      externalId,
    });

    const authToken = encodeAuthToken({
      userId: newUser._id,
      externalId: externalId!,
    });
    return {
      errorMessage: '',
      authToken,
    };
  }

  @Mutation(() => String)
  async updateNotificationToken(
    @Arg('notificationToken') notificationToken: string,
    @Ctx() { userId, db }: Context
  ): Promise<string> {
    if (!userId) {
      throw new Error('A user is required to update the notification token');
    }
    await db.User.updateOne({ _id: userId }, { notificationToken });
    await subscribeToAll(db, userId, notificationToken);
    return 'OK';
  }
}
