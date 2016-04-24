var Promise = require('bluebird');

module.exports = function GetBalance(opts) {
  return new Promise(function(resolve, reject) {
    console.log('Balance');
    console.log(opts);
    resolve();
  });
};
