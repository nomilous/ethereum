var Promise = require('bluebird');
var Deployer = require('ethereum-deploy-raw-contract');
var Archiver = require('./archiver');

module.exports = function DeployContract(opts) {
  return new Promise(function(resolve, reject) {
    var sender = opts.sender;
    var gasLimit = opts.gasLimit;
    var file = opts.file;
    var params = opts.params;
    var deployer, compiled, gasPrice, receipt;

    deployer = new Deployer();
    deployer.compileContract(file)

      .then(function(_compiled) {
        compiled = _compiled;
        return deployer.getCurrentGasPrice();
      })

      .then(function(_gasPrice) {
        gasPrice = _gasPrice;
        return deployer.deployContract(sender, compiled, params, gasPrice, gasLimit)
      })

      .then(function(_receipt) {
        receipt = _receipt;
        console.log(receipt);
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
