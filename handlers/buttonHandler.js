const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  const buttonsPath = path.join(__dirname, '../buttons');
  const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));

  for (const file of buttonFiles) {
    const filePath = path.join(buttonsPath, file);
    const button = require(filePath);
    if ('customId' in button && 'execute' in button) {
      client.buttons.set(button.customId, button);
    }
  }
};