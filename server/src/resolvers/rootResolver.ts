import { subscribeToAll } from '../lib/subscription';
import { Query, Resolver, Mutation, Arg, Field, InputType, ObjectType, Ctx } from 'type-graphql'
import { Context } from '../graphqlContext';
import logger from '../config/winston';

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
  id: string;
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
  async getUserId(@Ctx() { user }: Context) {
    return user ? user._id!.toHexString() : 'NO USER';
  }

  @Mutation(() => RegisterResult)
  async register(
    @Arg('name') name: string,
    @Ctx() { user, externalId, db }: Context
  ) {
    if (user) {
      throw new Error('User is already registered');
    }
    const newUser = await db.User.create({
      name: name,
      externalId,
    });

    return {
      errorMessage: '',
      id: newUser.id,
    };
  }

  @Mutation(() => String)
  async updateNotificationToken(
    @Arg('notificationToken') notificationToken: string,
    @Ctx() { user, db }: Context
  ) {
    if (!user) {
      throw new Error('A user is required to update the notification token');
    }
    await db.User.updateOne({ _id: user._id }, { notificationToken });
    await subscribeToAll(db, user, notificationToken);
    return 'OK';
  }
}
