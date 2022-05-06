/**
 * Reads data from "active" devices and stores it in db.
 * To be run from cron or some scheduled script.
 */

import * as sensorsApi from './sensors-api.mjs';
import * as db from './database.mjs';
import { createHash } from 'crypto';

let symbols = await db.getSymbolMap();

readDeviceData();

async function readDeviceData() {
  console.log('Odczytujemy najnowsze dane z sensorów!');
  let deviceList = await db.getDeviceList();
  deviceList.forEach(async device => {
    let response = await sensorsApi.readDeviceRecentHistory(device.id);
    if (response.code == 200) {
      console.log(`Odebrano dane dot. sensora o id=${device.id}`);
      parseDeviceRecentHistory(device.id, response.payload);
    }
    // @todo: log non-success queries somewhere
  });
}

async function parseDeviceRecentHistory(deviceId, payload) {
  let hash = computeReadingLogHash(payload.deviceDetails.lastValues);
  let lastReadingLog = await db.getLastReadingLog(deviceId);
  if (lastReadingLog?.hash != hash) {
    console.log('Dostępne są najnowsze dane! Zapiszemy sobie.');
    let newReadingLogId = await db.addReadingLog(deviceId, hash);
    for (let value of payload.deviceDetails.lastValues) {
      parseSymbolData(deviceId, newReadingLogId, value.values[0]);
    }
  }
  else {
    console.log('Odczytany zestaw danych był już wcześniej zapisany. Ignoruję!');
  }
}

function computeReadingLogHash(readingData) {
  return createHash('md5').update(JSON.stringify(readingData)).digest('hex');
}

// @todo: check if readings from specified time are already in db
function parseSymbolData(deviceId, readingLogId, data) {
  if (! (data.symbol in symbols) ) {
    console.log(`Musimy dodać nowy symbol ${data.symbol}`);
    symbols[data.symbol] = {code: data.symbol, name: data.symbol};
    db.addSymbol(data.symbol, data.symbol);
  }
  console.log(`Dodaję odczyt ${data.symbol} = ${data.value}`)
  db.addReading(deviceId, readingLogId, data.symbol, data.value, data.date);
}
