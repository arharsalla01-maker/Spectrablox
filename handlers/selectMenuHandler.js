const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  const selectMenusPath = path.join(__dirname, '../selectMenus');
  const selectMenuFiles = fs.readdirSync(selectMenusPath).filter(file => file.endsWith('.js'));

  for (const file of selectMenuFiles) {
    const filePath = path.join(selectMenusPath, file);
    const selectMenu = require(filePath);
    if ('customId' in selectMenu && 'execute' in selectMenu) {
      client.selectMenus.set(selectMenu.customId, selectMenu);
    }
  }
};