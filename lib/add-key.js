var Promise = require('bluebird');
var bitcore = require('bitcore-lib');
var ethereumUtil = require('ethereumjs-util');
var fs = require('fs');

module.exports = function GetBalance(opts) {
  return new Promise(function(resolve, reject) {
    var keyFile = opts.keyFile;
    var keys = require(keyFile);
    var privateKey = new bitcore.PrivateKey().toString('hex');
    var privateKeyBuffer = new Buffer(privateKey, 'hex');
    var publicKey = ethereumUtil.privateToPublic(privateKeyBuffer);
    var address = ethereumUtil.privateToAddress(privateKeyBuffer);
    var keyPair = {
      PrivateKey: privateKey,
      PublicKey: publicKey.toString('hex'),
      Address: address.toString('hex')
    };

    console.log(keyPair);
    console.log();

    keys.push(keyPair);
    fs.writeFile(keyFile, JSON.stringify(keys, null, 2), function(error) {
      if (error) return reject(error);
      console.log('...updated (%s)', keyFile);
      resolve();
    });
  });
};
