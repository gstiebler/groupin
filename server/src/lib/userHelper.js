
var rand = function() {
  return Math.random().toString(36).substr(2); // remove `0.`
};

var genToken = function() {
  return rand() + rand(); // to make it longer
};

module.exports = {
  genToken,
};