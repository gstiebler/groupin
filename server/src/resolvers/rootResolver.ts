import { subscribeToAll } from '../lib/subscription';
import { User } from '../db/entity/User';
import { Query, Resolver, Mutation, Arg, Field, InputType } from 'type-graphql'
import { Context } from '../graphqlMain';
import 'reflect-metadata';

@InputType()
export class HelloInput {
  @Field()
  pass: string
}

@InputType()
export class RegisterInput {
  @Field()
  name: string
}

@Resolver(() => User)
export class RootResolver {

  @Query(() => String)
  async getHello(
    @Arg('todoInput') { pass }: HelloInput
  ): Promise<String> {
    return pass === 'foca' ? 'OK' : 'ERROR';
  }

  @Query(() => String)
  async getUserId(args, { user }: Context) {
    return user ? user.id : 'NO USER';
  }

  @Mutation(() => ({ errorMessage: String, id: String }))
  async register(
    @Arg('todoInput') { name }: RegisterInput,
    { user, externalId, db }: Context
  ) {
    if (user) {
      throw new Error('User is already registered');
    }
    const newUser = await db.getRepository(User).save({
      name,
      externalId,
    });

    return {
      errorMessage: '',
      id: newUser.id,
    };
  }

  @Mutation(() => String)
  async updateNotificationToken({ notificationToken }, { user, db }: Context) {
    if (!user) {
      throw new Error('A user is required to update FCM token');
    }
    user.notificationToken = notificationToken;
    await db.getRepository(User).save(user);
    await subscribeToAll(db, user, notificationToken);
  }
}
