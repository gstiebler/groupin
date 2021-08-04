import { subscribeToAll } from '../lib/subscription';
import { Query, Resolver, Mutation, Arg, Field, InputType, ObjectType, Ctx } from 'type-graphql'
import { Context } from '../graphqlContext';

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
    console.log(ctx.externalId);
    return helloInput.pass === 'foca' ? 'OK' : 'ERROR';
  }

  @Query(() => String)
  async getUserId(@Ctx() { user }: Context) {
    return user ? user.id : 'NO USER';
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
      throw new Error('A user is required to update FCM token');
    }
    user.notificationToken = notificationToken;
    await user.save();
    await subscribeToAll(db, user, notificationToken);
  }
}
