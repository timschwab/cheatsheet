<template>
	<div id="search-page">
		<div>
			<p><button class="btn btn-primary" v-on:click="$emit('page', 'add')">Add a snippet</button></p>
		</div>
		
		<div class="form-group">
			<label for="query">Search query:</label>
			<input class="form-control" id="query" type="text" v-model="query">
		</div>
		
		<SnippetPreview
			v-for="snippet in results"
			:snippet="snippet"
			:key="snippet.id"
			v-on:view="$emit('page', 'view:' + $event)"
		></SnippetPreview>
	</div>
</template>

<script>
	const {ipcRenderer} = require('electron')
	const SnippetPreview = require('./SnippetPreview.vue').default

	let vm

	// Server responds with search results
	ipcRenderer.on('search-result', (event, results) => {
		vm.results = results

		if (results.length == 0) {
			vm.$emit('message', "Search returned no results :'(")
		} else {
			vm.$emit('message', 'Showing ' + results.length + ' results.')
		}
	})

	// If the search results might have been changed, then reload them.
	let events = ['add', 'edit:change', 'drop', 'restore']
	events.forEach(event => {
		ipcRenderer.on(event + '-result', () => {
			ipcRenderer.send('search', vm.query)
		})
	})

	module.exports = {
		created: function() {
			vm = this
		},
		data: function() {
			return {
				query: '',
				results: []
			}
		},
		watch: {
			query: function(q) {
				if (q) {
					ipcRenderer.send('search', q)
				} else {
					vm.results = []
					this.$emit('message', 'Enter a search query')
				}
			}
		},
		components: {
			SnippetPreview
		}
	}

</script>
