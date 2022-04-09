/**
 * Reads data from "active" devices and stores it in db.
 * To be run from cron or some scheduled script.
 */

import * as sensorsApi from './sensors-api.mjs';
import * as db from './database.mjs';

let symbols = db.getSymbolMap();

readDeviceData();

async function readDeviceData() {
  let deviceList = await db.getDeviceList();
  deviceList.forEach(async device => {
    let response = await sensorsApi.readDeviceRecentHistory(device.id);
    if (response.code == 200) {
      parseDeviceRecentHistory(device.id, response.payload);
    }
    // @todo: log non-success queries somewhere
  });
}

function parseDeviceRecentHistory(deviceId, payload) {  
  for (let value of payload.deviceDetails.lastValues) {
    parseSymbolData(deviceId, value.values[0]);
  }
}

// @todo: check if readings from specified time are already in db
function parseSymbolData(deviceId, data) {
  if (! (data.symbol in symbols) ) {
    symbols[data.symbol] = {code: data.symbol, name: data.symbol};
    db.addSymbol(data.symbol, data.symbol);
  }
  db.addReading(deviceId, data.symbol, data.value, data.date);
}
