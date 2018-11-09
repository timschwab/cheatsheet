const {ipcRenderer} = require('electron')
const $ = require('jquery')

$(() => {
	$('#submit').on('click', submit)
})

function submit() {
	let problem = $('#problem').val()
	let solution = $('#solution').val()
	let keywords = $('#keywords').val()

	if (!problem) {
		$('#message').html('You gotta input a problem to add it, bro')
	} else if (!solution) {
		$('#message').html('It isn\'t very helpful to have a problem with no solution, now is it?')
	} else if (!keywords) {
		$('#message').html('Keywords are your friend')
	} else {
		keywords = keywords.split(/, |,/g)

		ipcRenderer.send('add', {
			problem: problem,
			solution: solution,
			keywords: keywords
		})
	}
}

ipcRenderer.on('add-result', (event, results) => {
	if (results.status == 'success') {
		$('#message').html('Successfully added')
		$('#problem').val('')
		$('#solution').val('')
		$('#keywords').val('')
	} else {
		$('#message').html('Could not add: ' + results.message)
	}
})