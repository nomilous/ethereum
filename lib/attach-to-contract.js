var Promise = require('bluebird');

module.exports = function AttachToContract(opts) {
  return new Promise(function(resolve, reject) {
    console.log('Attach');
    console.log(opts);
    resolve();
  });
};
