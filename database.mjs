import fs from 'fs';
import sqlite3 from 'sqlite3';

let db = new sqlite3.Database('./db/sensin.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

if (db) {
  prepareDatabaseStructure(db);
}

function prepareDatabaseStructure() {
  let databaseStructureSQL = fs.readFileSync('./database-structure.sql', {encoding: 'utf-8'});
  db.exec(databaseStructureSQL);
}

function getDeviceList() {
  return new Promise(resolve => {
    db.all('select * from devices', function (err, rows) {
      resolve(rows);
    });
  });
}

function getSymbolList() {
  return new Promise(resolve => {
    db.all('select * from symbols', function (err, rows) {
      resolve(rows);
    });
  });
}

async function getSymbolMap() {
  let symbolList = await getSymbolList();
  if (symbolList) {
    return symbolList.reduce((acc, symbol) => {
      acc[symbol.code] = symbol;
      return acc;
    }, {});
  }

  return {};
}

function addSymbol(code, name) {
  db.run('insert into symbols (code, name) values (?, ?)', [code, name]);
}

function getLastReadingLog(deviceId) {
  return new Promise(resolve => {
    db.get(
      'select * from reading_log where device_id = ? order by reading_timestamp desc limit 1', 
      [deviceId], 
      function (err, rows) {
        resolve(rows);
      }
    );
  });
}

function addReadingLog(deviceId, hash) {
  return new Promise(resolve => {
    db.run(
      'insert into reading_log (device_id, hash) '+
      'values (?, ?)',
      [deviceId, hash],
      function (err) {
        if (err === null) {
          resolve(this.lastID);
        }
      }
    );
  });
  
}

function addReading(deviceId, readingLogId, symbolCode, value, readingTimestamp) {
  db.run(
    'insert into readings (device_id, reading_log_id, symbol_code, value, reading_timestamp) '+
    'values (?, ?, ?, ?, ?)',
    [deviceId, readingLogId, symbolCode, value, readingTimestamp]
  );
}

function getDeviceReadings(deviceId) {
  return new Promise(resolve => {
    db.all(
      'select * from readings where device_id = ? order by reading_timestamp desc', 
      [deviceId], 
      function (err, rows) {
        resolve(rows);
      }
    );
  });
}

export { db, getDeviceList, getSymbolList, addSymbol, addReading, getDeviceReadings, getSymbolMap, getLastReadingLog, addReadingLog };