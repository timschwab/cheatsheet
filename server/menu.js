const {Menu} = require('electron')

const menu = Menu.buildFromTemplate([
	{
		label: 'File',
		submenu: [{label: 'Install sheet'}, {label: 'Remove sheet'}]
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
