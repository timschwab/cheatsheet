const {Menu} = require('electron')

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
				label: 'Dropped snippets',
				click(item, window) {
					window.webContents.send('menu:dropped')
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
