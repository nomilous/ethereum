var Promise = require('bluebird');
var Deployer = require('./deployer');
var Archiver = require('./archiver');

module.exports = function DeployContract(opts) {
  return new Promise(function(resolve, reject) {
    var sender = opts.sender;
    var gasLimit = opts.gasLimit;
    var file = opts.file;
    var params = opts.params;
    var compiled, gasPrice, receipt;

    Deployer.compileContract(file)

      .then(function(_compiled) {
        compiled = _compiled;
        return Deployer.getCurrentGasPrice();
      })

      .then(function(_gasPrice) {
        gasPrice = _gasPrice;
        return Deployer.deployContract(sender, compiled, params, gasPrice, gasLimit)
      })

      .then(function(_receipt) {
        receipt = _receipt;
        console.log('\nabi:', JSON.stringify(compiled.abi));
        console.log('\nreceipt:', receipt);

        return Archiver({
          receipt: receipt,
          compiled: compiled,
          file: file
        });
      })

      .then(resolve)

      .catch(reject);
  });
};
