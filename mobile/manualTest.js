const server = require('./lib/server');

(async function test() {
  try {
    const res = await server.getOwnGroups('5bc3ca99342fcfec653e2411');
    console.log(res);
  } catch(error) {
    console.error(error);
  }
})();
