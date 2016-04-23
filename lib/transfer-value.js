var Promise = require('bluebird');

module.exports = function TransferValue(opts) {
  return new Promise(function(resolve, reject) {
    console.log('Transfer');
    console.log(opts);
    resolve();
  });
};
