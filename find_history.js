const fs = require('fs');
const path = require('path');
const os = require('os');

const historyDir = path.join(os.homedir(), 'AppData', 'Roaming', 'Cursor', 'User', 'History');

if (!fs.existsSync(historyDir)) {
  console.log('History dir not found:', historyDir);
  process.exit(1);
}

const folders = fs.readdirSync(historyDir);

let count = 0;
for (const folder of folders) {
  const entriesPath = path.join(historyDir, folder, 'entries.json');
  if (fs.existsSync(entriesPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(entriesPath, 'utf8'));
      console.log(data.resource);
      count++;
      if (count > 5) break;
    } catch (e) {}
  }
}

console.log(`Checked a few, first one was ${count}`);
