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
  db.run(databaseStructureSQL);
}

// testy:
function getDeviceList() {
  return new Promise(resolve => {
    db.all('select * from devices', function (err, rows) {
      resolve(rows);
    });
  });
}

export { db, getDeviceList };