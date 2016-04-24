var Promise = require('bluebird');
var net = require('net');
var BigNumber = require('bignumber.js');

module.exports = function GetBalance(opts) {
  return new Promise(function(resolve, reject) {
    var sender = opts.sender;

    //// The easy way
    // web3.eth.getBalance(sender.Address, function(error, balance) {
    //   if (error) return  reject(error);
    //   console.log('wei:  ', balance.toString(10));
    //   console.log('ether:', web3.fromWei(balance, 'ether').toString(10));
    //   resolve();
    // });

    // The harder way (post request to ipc directly)
    var sequence = 1;
    var block = 'latest';
    var balance;
    var connection = net.connect({path: ipcPath});

    connection.on('error', function(error) {
      reject(error);
    });

    connection.on('end', function() {
      console.log('wei:  ', balance.toString(10));
      console.log('ether:', web3.fromWei(balance, 'ether').toString(10));
      resolve();
    });

    connection.on('data', function(data) {
      var hex = JSON.parse(data).result;
      balance = new BigNumber(hex.replace('0x', ''), 16);
      connection.end();
    });

    connection.write(JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: ['0x' + sender.Address, block],
      id: sequence
    }));
  });
};
