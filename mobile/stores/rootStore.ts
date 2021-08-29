import * as _ from 'lodash';

export class RootStore {
  userId = '';

  setUserIdAction = (userId: string) => { this.userId = userId; };
}
