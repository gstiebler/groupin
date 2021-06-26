import axios from 'axios';
import env from '../env';

const url = env.SERVER_URL;

export function setToken(token) {
  axios.defaults.headers.common.authorization = token;
}

export async function sendQuery(query, variables) {
  try {
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
  } catch(err) {
    console.error(err);
    throw new Error(err);
  }
}
