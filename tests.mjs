import { db, getDeviceList } from "./database.mjs";

async function tests() {
  // db.run('insert into devices (id, name) values (666, \'sensor 1\');');
  
  let deviceList = await getDeviceList();
  console.log(deviceList);
};

tests();