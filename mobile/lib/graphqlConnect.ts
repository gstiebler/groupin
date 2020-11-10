import axios , { AxiosRequestConfig } from 'axios';
import { SERVER_URL } from '../env';

const url = SERVER_URL;

export function setToken(token) {
  axios.defaults.headers.common.authorization = token;
}

export async function sendQuery(query, variables?) {
  try {
    console.log(query, variables);
    const requestConfig: AxiosRequestConfig = {
      url,
      method: 'post',
      data: { 
        query, 
        variables,
      },
    };
    const res = await axios.request(requestConfig);
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
  } catch(err) {
    console.error(err);
    throw new Error(err);
  }
}
