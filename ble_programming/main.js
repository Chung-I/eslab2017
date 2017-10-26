let bleno = require('bleno');

let BlenoPrimaryService = bleno.PrimaryService;

let AdxlCharacteristic = require('./characteristic');

console.log('bleno - button');

bleno.on('stateChange', state => {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('echo', ['1900']);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', error => {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: '1901',
        characteristics: [
          new AdxlCharacteristic()
        ]
      })
    ]);
  }
});
