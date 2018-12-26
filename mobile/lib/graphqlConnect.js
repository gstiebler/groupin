const axios = require('axios');

const url = 'https://b2hbks8mx8.execute-api.us-east-1.amazonaws.com/prod/groupin';

axios.defaults.headers.common.authorization = '85076546477256749024Robert';

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
};
