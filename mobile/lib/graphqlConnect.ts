import axios from 'axios';
import env from './graphqlEnv';

const url = env.SERVER_URL;

type ErrorHandler = (error: string) => void;

export default {

  errorHandler: (error: string) => { console.error(error) },
  setErrorHandler(handler: ErrorHandler) { this.errorHandler = handler; },

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
      const errorMessage = err.message || err.response?.data?.errors;
      this.errorHandler(errorMessage);
      throw new Error(err);
    }
  },
};


