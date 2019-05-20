#! /usr/bin/env node
const {exec} = require('child_process')

switch (process.platform) {
	case 'win32':
		// Windows
		// TODO: Move the logic for installing on windows here from the bat file
		exec('call scripts/install-redis-windows.bat')
		break
	case 'darwin':
		// Mac
		exec('sh scripts/install-redis-mac.sh')
		break
	case 'linux':
		// ... Linux
		exec('sh scripts/install-redis-linux.sh')
		break
}
