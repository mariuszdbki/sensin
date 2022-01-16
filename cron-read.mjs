/**
 * Reads data from "active" devices and stores it in db.
 * To be run from cron or some scheduled script.
 */

import { readDeviceRecentHistory } from "./sensors-api.mjs";

let test = await readDeviceRecentHistory(666);
console.log(test);