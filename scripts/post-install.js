#! /usr/bin/env node
const {exec} = require('child_process')

switch (process.platform) {
	case 'win32':
		// TODO: Move the logic for installing on windows here from the bat file
		exec('call scripts/install-redis-windows.bat')
		break
	case 'darwin':
		console.log(
			'Automated install of Redis currently not implemented on Mac OS'
		)
		break
	case 'linux':
		console.log('Automated install of Redis currently not implemented on Linux')
		break
}
