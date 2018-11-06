let $ = require('jquery')  // jQuery now loaded and assigned to $

$(() => {
	// Watch for a query
	$("#query").change(query)
});

function query() {
	let q = this.value

	if (q == "") {
		$("#results").html("")
	} else {
		$("#results").html("Results: " + q)
	}
}