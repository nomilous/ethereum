var Promise = require('bluebird');
var childProcess = require('child_process');
var os = require('os');
var ethereumUtil = require('ethereumjs-util');
var EthereumTx = require('ethereumjs-tx');
var solidity = require('solidity.js');

// web3 is global;

module.exports.compileContract = function(contractFile) {
  return new Promise(function(resolve, reject) {

    // using commandline solc so that it can follow "imports"

    childProcess.exec('solc --bin --abi ' + contractFile, function(error, stdout, stderr) {
      if (error) return reject(error);
      if (stderr.length > 0) return reject(stderr);

      // assuming the "main" contract appears first in output

      var split = stdout.split(os.EOL);
      var code = split[3];
      var abi;
      try {
        abi = JSON.parse(split[5]);
      } catch (e) {
        return reject(new Error('bad abi json: ' + split[5]));
      }
      resolve({
        code: code,
        abi:  abi
      });
    });
  });
};

module.exports.getCurrentGasPrice = function() {
  return new Promise(function(resolve, reject) {
    web3.eth.getGasPrice(function(error, price) {
      if (error) return reject(error);
      resolve(price);
    });
  });
};

module.exports.deployContract = function(senderKeyPair, contract, constructorParams, gasPrice, gasLimit) {
  return new Promise(function(resolve, reject) {
    var privateKey = new Buffer(senderKeyPair.PrivateKey, 'hex');
    var senderAccount = ethereumUtil.privateToAddress(privateKey).toString('hex');

    // need count of transactions set from this sender because transaction nonce must be sequence number
    web3.eth.getTransactionCount(senderAccount, function(error, number) {

      var transactionSequenceNumber = number;
      var paramBytes, rawTx, tx, serializedTx;

      // need to append bytecoded constructor params into tail of contract code
      paramBytes = encodeConstructorParams(contract.abi, constructorParams);

      rawTx = {
        nonce: web3.toHex(transactionSequenceNumber),
        gasPrice: web3.toHex(gasPrice.toString()),
        gasLimit: web3.toHex(gasLimit),

        // WEIRD BUG (remove 0x and add it again fixes bytecode miss-alignment on blockchain)
        // data: contract.code + paramBytes,
        data: '0x' + contract.code + paramBytes,
      };
      tx = new EthereumTx(rawTx);
      tx.sign(privateKey);
      serializedTx = tx.serialize();

      web3.eth.sendRawTransaction(serializedTx.toString('hex'), function(error, transactionHash) {
        if (error) return reject(error);
        console.log('...contract submitted - TX:', transactionHash);
        var count = 0;
        var filter = web3.eth.filter('latest', function() {
          // for each block write, look for transaction receipt
          // and give up after 50 blocks
          count++;
          web3.eth.getTransactionReceipt(transactionHash, function(error, receipt) {
            if (error) return reject(error);
            if (!receipt) console.log('...block %d, still waiting for contract', count);
            if (receipt || count > 50) {
              if (!receipt) return reject(new Error('...gave up waiting for contract to be mined'));
              filter.stopWatching();
              console.log('...contract mined');
              // console.log('====transaction=====');
              // console.log(JSON.stringify({
              //   sender: senderAccount,
              //   rawTx: rawTx,
              // }, null, 2));
              // console.log();
              // console.log('=======receipt=======');
              // console.log(JSON.stringify(receipt, null, 2));
              // console.log();
              // console.log('====== A B I =======');
              // console.log(JSON.stringify(contract.abi));
              // console.log();

              receipt.sender = senderAccount; // just because
              resolve(receipt);
            }
          });
        });
      });
    });
  });

};

function encodeConstructorParams(abi, params) {
  var bytes;
  bytes = abi.filter(function (json) {
      return json.type === 'constructor' && json.inputs.length === params.length;
    }).map(function (json) {
      return json.inputs.map(function (input) {
        return input.type;
      });
    }).map(function (types) {
      return solidity.encodeParams(types, params);
    })[0] || '';
  return bytes;
}
