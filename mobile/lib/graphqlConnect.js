const axios = require('axios');

const url = 'https://us-central1-chat-534f7.cloudfunctions.net/function-2';

async function sendQuery(query) {
  try {
    const res = await axios.post(url, query);
    return res.data;
  } catch(err) {
    console.error(err);
  }
}

module.exports = {
  sendQuery,
};
