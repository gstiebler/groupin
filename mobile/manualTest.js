const server = require('./lib/server');
const { setToken } = require('./lib/graphqlConnect');

const randomStr = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

(async function test() {
  try {
    setToken('eyJhbGciOiJSUzI1NiIsImtpZCI6ImNlNWNlZDZlNDBkY2QxZWZmNDA3MDQ4ODY3YjFlZDFlNzA2Njg2YTAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZ3JvdXBpbi00NzAwYiIsImF1ZCI6Imdyb3VwaW4tNDcwMGIiLCJhdXRoX3RpbWUiOjE1Nzc5MTU5NDQsInVzZXJfaWQiOiJlWEpxMG9teUtGWTNwMzI5QlhCWmV5bDJRVjkzIiwic3ViIjoiZVhKcTBvbXlLRlkzcDMyOUJYQlpleWwyUVY5MyIsImlhdCI6MTU3NzkxNTk0NSwiZXhwIjoxNTc3OTE5NTQ1LCJwaG9uZV9udW1iZXIiOiIrNTUyMTk5OTk5MjIyMiIsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsicGhvbmUiOlsiKzU1MjE5OTk5OTIyMjIiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwaG9uZSJ9fQ.OT2liwKEJNN8jXECiIw9TR1MdDoTgmZB0jXCoKXvTj56S4v0g80Uo3NgycTarV6MIpFz55VrsEsA7DyDKU83GwCA0b246Z2eNx7wXE1nxodItZEozMXwXElWaqpt1NlCr_KjFqgs2KZdqQbQlFGCsvICkYcvuDZTC9wfssnrlQ_4j-lgK9BTLsX3AnqKWBFzL5JN-hwkiViUEZN6ScLOoa5gC3tHpet0V7MWN4Q8epzNH8TX1ykIxjDrFf9WPBpCNFhMoqQiiq95WIBrS72zqdwPHoLku2OC-RiUTumoBxwmyzq1-hhLLCzPShC_OJwP2MXXoSxOC9va_aXYskYi9g');
    const message = `teste manual ${randomStr()}`;
    const res = await server.sendMessage({message, topicId: '5da363cf6403611a22058a88'});
    console.log(res);
  } catch(error) {
    console.error(error);
  }
})();
