import * as _ from 'lodash';
import * as server from '../lib/server';


export class RootStore {
  userId = '';
  error = '';
  errorId = Math.random();

  setUserIdAction = (userId: string) => { this.userId = userId; };
  setErrorAction = (error: string) => {
    if (_.isEmpty(error)) {
      return;
    }
    this.error = error;
    this.errorId = Math.random();
  };

  async updateNotificationToken(notificationToken: string) {
    if (!this.userId) {
      throw new Error('There is no user yet');
    }
    await server.updateNotificationToken(notificationToken);
  }
}
