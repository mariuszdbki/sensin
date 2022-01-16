import fs from 'fs';

let textSettings = fs.readFileSync('settings.json');
let sensinSettings = JSON.parse(textSettings);

export default sensinSettings;
