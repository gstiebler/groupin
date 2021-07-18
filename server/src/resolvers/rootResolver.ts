import { subscribeToAll } from '../lib/subscription';
import { User } from '../db/entity/User';
import { Query, Resolver, Mutation, Arg, Field, InputType, ObjectType, Ctx } from 'type-graphql'
import { Context } from '../graphqlContext';
import 'reflect-metadata';

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

@Resolver(() => User)
export class RootResolver {

  @Query(() => String)
  async getHello(
    @Arg('todoInput') { pass }: HelloInput,
    @Ctx() ctx: Context
  ): Promise<String> {
    console.log(ctx);
    return pass === 'foca' ? 'OK' : 'ERROR';
  }

  @Query(() => String)
  async getUserId(args, @Ctx() { user }: Context) {
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
    const newUser = await db.getRepository(User).save({
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
    await db.getRepository(User).save(user);
    await subscribeToAll(db, user, notificationToken);
  }
}
