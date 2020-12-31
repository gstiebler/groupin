const axios = require('axios');
const env = require('../env');

const url = env.SERVER_URL;

function setToken(token) {
  axios.defaults.headers.common.authorization = token;
}

async function sendQuery(query, variables) {
  try {
    const requestConfig = {
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

module.exports = {
  sendQuery,
  setToken,
};
