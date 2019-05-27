const { 
  getTopicsOfCurrentGroup,
  getMessagesOfCurrentTopic,
} = require('../actions/rootActions');


async function messageReceived(store, message) {
  await Promise.all([
    getTopicsOfCurrentGroup(store),
    getMessagesOfCurrentTopic(store),
  ]);
}

module.exports = {
  messageReceived,
};
