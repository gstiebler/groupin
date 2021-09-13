import { Query, Resolver, Mutation, Arg, Field, InputType, ObjectType, Ctx } from 'type-graphql'
import { subscribeToAll } from '../lib/subscription';
import { Context } from '../graphqlContext';
import logger from '../config/winston';
import { encodeAuthToken, getFirebaseUserId } from '../lib/auth';

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
    logger.debug(`External id: ${ctx.externalId}`);
    return helloInput.pass === 'foca' ? 'OK' : 'ERROR';
  }

  // TODO: test
  @Query(() => String)
  async getAuthToken(
    @Arg('firebaseAuthToken') firebaseAuthToken: string,
    @Ctx() { db }: Context
  ): Promise<string> {
    const firebaseId = await getFirebaseUserId(firebaseAuthToken);
    const user = await db.User.findOne({ externalId: firebaseId });
    const authToken = encodeAuthToken({
      userId: user?._id,
      externalId: firebaseId,
    });
    return authToken;
  }

  // TODO: test
  @Mutation(() => RegisterResult)
  async register(
    @Arg('name') name: string,
    @Arg('firebaseAuthToken') firebaseAuthToken: string,
    @Ctx() { db }: Context
  ): Promise<RegisterResult> {
    const firebaseId = await getFirebaseUserId(firebaseAuthToken);

    const user = await db.User.findOne({ externalId: firebaseId, }).lean();
    if (user) {
      throw new Error('User is already registered');
    }
    const newUser = await db.User.create({
      name: name,
      externalId: firebaseId,
    });

    const authToken = encodeAuthToken({
      userId: newUser._id,
      externalId: firebaseId,
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
