const server = require('./lib/server');

(async function test() {
  try {
    const res = await server.getOwnGroups('userId1');
    console.log(res);
  } catch(error) {
    console.error(error);
  }
})();
