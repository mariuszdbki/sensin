import settings from './settings.mjs';
import fetch from 'node-fetch';

/**
 * Reads provided device recent history
 * @param {int} deviceId id of a device you want to read from
 * @returns object with api returned data
 */
async function readDeviceRecentHistory(deviceId) {
  let deviceHistoryUrl = settings.apiRoot + `/devices/summary/${deviceId}/history`;
  const response = await fetch(deviceHistoryUrl);
  return await response.json();
}

export { readDeviceRecentHistory };