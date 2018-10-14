const axios = require('axios');

const url = 'https://b2hbks8mx8.execute-api.us-east-1.amazonaws.com/prod/groupin';

async function sendQuery(query) {
  try {
    console.log(query);
    const parsedQuery = query.replace(/\n/g, '').replace(/\"/g, '\\\"');
    const requestConfig = {
      url,
      method: 'post',
      data: `"${parsedQuery}"`,
    };
    const res = await axios.request(requestConfig);
    if (res.data.errors) {
      throw new Error(res.data.errors);
    }
    return res.data.data;
  } catch(err) {
    console.error(err);
    throw new Error(res.data.errors);
  }
}

module.exports = {
  sendQuery,
};
