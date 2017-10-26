let util = require('util');

let bleno = require('bleno');

let BlenoCharacteristic = bleno.Characteristic;

global.x_axis = 0;
global.y_axis = 1;
global.z_axis = 2;

let ADXL345 = require('./ADXL345.js');

let globallet = {
  SAMPLECOUNT : 400,
  accelScaleFactor : [0.0, 0.0, 0.0],
  runTimeAccelBias : [0, 0, 0],
  accelOneG : 0.0,
  meterPerSecSec : [0.0, 0.0, 0.0],
  accelSample : [0, 0, 0],
  accelSampleCount : 0
};

let accel = new ADXL345(err => {
  accel.accelScaleFactor[x_axis] = 0.0371299982;
  accel.accelScaleFactor[y_axis] = -0.0374319982;
  accel.accelScaleFactor[z_axis] = -0.0385979986;
  if (!err) {
    accel.computeAccelBias(() => {
      setInterval(() => {
	accel.measureAccel(err => {});
      }, 10);
    });
  } else {
    console.log(err);
  }
});

let AdxlCharacteristic = function() {
  AdxlCharacteristic.super_.call(this, {
    uuid: '1902',
    properties: ['read', 'write', 'notify'],
    value: null
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(AdxlCharacteristic, BlenoCharacteristic);

AdxlCharacteristic.prototype.onReadRequest = function(offset, callback) {
  this._value = new Buffer(
    accel.meterPerSecSec[global.x_axis].toString().split("").slice(0, 6).map(str => str.charCodeAt(0)).concat(
      [32], accel.meterPerSecSec[global.y_axis].toString().split("").slice(0, 6).map(str => str.charCodeAt(0)),
      [32], accel.meterPerSecSec[global.z_axis].toString().split("").slice(0, 6).map(str => str.charCodeAt(0))
    )
  )

  console.log('ADXL345Characteristic - onReadRequest: value = ' + this._value.toString());

  if (this._updateValueCallback) {
    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS, this._value);
};

//AdxlCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
//  this._value = data;

//  console.log('ADXL345Characteristic - onWriteRequest: value = ' + this._value.toString('hex'));

//  if (this._updateValueCallback) {
//    console.log('ADXL345Characteristic - onWriteRequest: notifying');

//    this._updateValueCallback(this._value);
//  }

//  callback(this.RESULT_SUCCESS);
//};

AdxlCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('ADXL345Characteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

AdxlCharacteristic.prototype.onUnsubscribe = function() {
  console.log('ADXL345Characteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = AdxlCharacteristic;
