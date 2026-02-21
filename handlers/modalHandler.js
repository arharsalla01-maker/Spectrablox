const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  const modalsPath = path.join(__dirname, '../modals');
  const modalFiles = fs.readdirSync(modalsPath).filter(file => file.endsWith('.js'));

  for (const file of modalFiles) {
    const filePath = path.join(modalsPath, file);
    const modal = require(filePath);
    if ('customId' in modal && 'execute' in modal) {
      client.modals.set(modal.customId, modal);
    }
  }
};