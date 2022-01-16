import sqlite3 from 'sqlite3';

let db = new sqlite3.Database('./db/sensin.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the sensin database.');
});

if (db) {
  prepareDatabase(db);
}

function prepareDatabase() {
  // @todo: extract db schema to separate sql file
  db.run('create table if not exists ... ');
}