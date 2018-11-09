const {ipcRenderer} = require('electron')
const $ = require('jquery')

$(() => {
	// Watch for a query
	$("#query").change(query)
});

function query() {
	let q = this.value

	if (q) {
		ipcRenderer.send('query', q)
	} else {
		$("#results").html("")
	}
}

ipcRenderer.on('q-result', (event, result) => {
	if (result) {
		$("#results").html("Results: " + result)
		console.log(result)
	} else {
		$("#results").html("Could not find query.")
	}
})