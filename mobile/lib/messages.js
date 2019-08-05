
function mergeMessages(olderMessages, newerMessages) {
  return [...olderMessages, ...newerMessages];
}

module.exports = {
  mergeMessages,
}
