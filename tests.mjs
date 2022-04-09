import { db, getDeviceList, getSymbolList, getDeviceReadings } from "./database.mjs";

async function tests() {
  // db.run('insert into devices (id, name) values (666, \'sensor 1\');');
  
  let deviceList = await getDeviceList();
  console.log('Device list:');
  console.log(deviceList);
  console.log('\nSymbols:');
  let symbolList = await getSymbolList();
  console.log(symbolList);
  console.log('\nReadings for 666:');
  let deviceReadings = await getDeviceReadings(666);
  console.log(deviceReadings);
};

tests();