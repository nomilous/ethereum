var Promise = require('bluebird');

module.exports = function GetBalance(opts) {
  return new Promise(function(resolve, reject) {
    var sender = opts.sender;
    web3.eth.getBalance(sender.Address, function(error, balance) {
      if (error) return  reject(error);
      // console.log('wei balance:', balance.toString());
      console.log('wei:  ', balance.toString(10));
      // console.log('ether balance:', web3.fromWei(balance, 'ether'));
      console.log('ether:', web3.fromWei(balance, 'ether').toString(10));
      resolve();
    });
  });
};
