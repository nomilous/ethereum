var Promise = require('bluebird');
var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');

module.exports = function TransferValue(opts) {
  return new Promise(function(resolve, reject) {
    var receipt = opts.receipt;
    var compiled = opts.compiled;
    var file = opts.file;

    var archiveDir = file + '.contract';
    var latestDir = archiveDir + path.sep + 'latest';
    var previousDir = archiveDir + path.sep + 'previous';
    var dateFile = latestDir + path.sep + 'date';
    var abiFile = latestDir + path.sep + 'abi.json';
    var abiFlatFile = latestDir + path.sep + 'abiFlat.json';
    var receiptFile = latestDir + path.sep + 'receipt.json';

    try {
      mkdirp.sync(archiveDir);
      try {
        fs.lstatSync(latestDir);
        var date = fs.readFileSync(dateFile).toString();
        mkdirp.sync(previousDir);
        fs.renameSync(latestDir, archiveDir + path.sep + 'previous' + path.sep + date);
        mkdirp.sync(latestDir);
      } catch (e) {
        mkdirp.sync(latestDir);
      }

      fs.writeFileSync(dateFile, new Date().toISOString());
      fs.writeFileSync(abiFile, JSON.stringify(compiled.abi, null, 2));
      fs.writeFileSync(abiFlatFile, JSON.stringify(compiled.abi));
      fs.writeFileSync(receiptFile, JSON.stringify(receipt, null, 2));

      console.log('stored... (%s)', latestDir);
      resolve();
    } catch (e) {
      return reject(e);
    }
  });
};
