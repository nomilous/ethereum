var Promise = require('bluebird');
var EthereumTx = require('ethereumjs-tx');
var Deployer = require('./deployer');

module.exports = function TransferValue(opts) {
  return new Promise(function(resolve, reject) {
    var sender = opts.sender;
    var value = opts.value;
    var unit = opts.unit;
    var to = opts.to;
    var gas = opts.gas;
    var privateKey, rawTx, tx, serializedTx;

    Deployer.getCurrentGasPrice()
      .then(function(gasPrice) {

        web3.eth.getTransactionCount(sender.Address, function(error, number) {
          if (error) return reject(error);

          privateKey = new Buffer(sender.PrivateKey, 'hex');
          rawTx = {
            nonce: web3.toHex(number),
            gasPrice: web3.toHex(gasPrice),
            gasLimit: web3.toHex(gas),
            to: '0x' + to.Address,
            value: web3.toHex(web3.toWei(value, unit)),
          };
          tx = new EthereumTx(rawTx);
          tx.sign(privateKey);
          serializedTx = tx.serialize();

          web3.eth.sendRawTransaction(serializedTx.toString('hex'), function (error, transactionHash) {
            if (error) return reject(error);
            console.log('...transaction submitted - TX: ' + transactionHash);

            var count = 0;
            var filter = web3.eth.filter('latest', function() {

              count++;
              web3.eth.getTransactionReceipt(transactionHash, function (error, receipt) {
                if (error) return reject(error);
                if (!receipt) console.log('...block %d, still waiting for transaction', count);
                if (receipt || count > 50) {
                  if (!receipt) return reject(new Error('...gave up waiting for transaction to be mined'));
                  filter.stopWatching();
                  console.log('\nreceipt:', receipt);
                  resolve();
                }
              });
            });
          });
        });
      })
      .catch(reject);
  });
};


// getCurrentGasPrice
