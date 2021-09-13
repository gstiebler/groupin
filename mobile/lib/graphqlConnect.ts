import axios from 'axios';
import env from './graphqlEnv';

const url = env.SERVER_URL;

export default {
  setToken(token: string) {
    axios.defaults.headers.common.authorization = token;
  },

  async sendQuery(query: string, variables?: unknown) {
    try {
      console.debug(query);
      console.debug(variables);
      const res = await axios.request({
        url,
        method: 'post',
        data: { 
          query, 
          variables,
        },
      });
      console.log(JSON.stringify(res));
      if (!res.data) {
        throw new Error('No data returned from server');
      }
      if (res.data.errors) {
        throw new Error(res.data.errors[0].message);
      }
      if (res.data.errorMessage) {
        throw new Error(res.data.errorMessage);
      }
      return res.data.data;
    } catch (err) {
      console.error(err);
      console.error(err.response?.data?.errors);
      throw new Error(err);
    }
  },
};


