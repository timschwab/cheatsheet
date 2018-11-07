const {ipcRenderer} = require('electron')
const $ = require('jquery')  // jQuery now loaded and assigned to $

$(() => {
	// Watch for a query
	$("#query").change(query)
});

function query() {
	let q = this.value

	if (q == "") {
		$("#results").html("")
	} else {
		ipcRenderer.send('query', q)
	}
}

ipcRenderer.on('q-result', (event, arg) => {
	$("#results").html("Results: " + arg)
})