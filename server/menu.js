const {Menu, ipcMain} = require('electron')

const menu = Menu.buildFromTemplate([
	{
		label: 'File',
		submenu: [
			{
				label: 'Install sheet'
			},
			{
				label: 'Remove sheet'
			},
			{
				label: 'Recently deleted snippets',
				click(item, window) {
					window.webContents.send('menu:deleted')
				}
			}
		]
	},
	{
		label: 'View',
		submenu: [
			{
				label: 'Refresh',
				role: 'reload'
			},
			{
				label: 'Dev tools',
				role: 'toggledevtools'
			}
		]
	}
])

module.exports = menu
