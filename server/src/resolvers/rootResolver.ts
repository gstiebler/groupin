import { subscribeToAll } from '../lib/subscription';

import { User } from '../db/entity/User';
import { Connection } from 'typeorm';

import { Query, Resolver, Mutation, Arg, Field, InputType } from 'type-graphql'
import { Context } from '../graphqlMain';
import { stringifyKey } from 'mobx/dist/internal';

@InputType()
export class HelloInput {
  @Field()
  pass: string
}

@Resolver(() => User)
export class RootResolver {

  @Query(() => String)
  async getHello(
    @Arg('todoInput') { pass }: HelloInput
  ): Promise<string> {
    return pass === 'foca' ? 'OK' : 'ERROR';
  }

  @Query(() => String)
  async getUserId(args, { user }: Context) {
    return user ? user.id : 'NO USER';
  }

  @Mutation(() => )
  async register(
    @Arg('todoInput') { name }: HelloInput,
    { user, externalId, connection }: Context
  ) {
    if (user) {
      throw new Error('User is already registered');
    }
    const newUser = await connection.getRepository(User).save({
      name,
      externalId,
    });

    return {
      errorMessage: '',
      id: newUser.id,
    };
  }
}

export async function updateFcmToken({ fcmToken }, { user, connection }: { user: User, connection: Connection }) {
  if (!user) {
    throw new Error('A user is required to update FCM token');
  }
  user.notificationToken = fcmToken;
  await connection.getRepository(User).save(user);
  await subscribeToAll(user, fcmToken);
}
