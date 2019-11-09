<template>
	<div class="view-page">
		<div class="view-links">
			<p><a href="#" v-on:click="$emit('page', 'search')">Back to search results</a></p>
		</div>
		<div class="view-results card">
			<div class="card-header">
				<h4 class="problem card-title">{{ snippet.problem }}</h4>
			</div>
			<div class="card-body">
				<div class="solution" v-html="markedSolution"></div>
				<hr />
				<h6>Keywords:</h6>
				<ul>
					<li v-for="keyword in snippet.keywords">{{ keyword }}</li>
				</ul>
			</div>
			<div class="card-footer">
				<div v-if="dropped">
					<button class="btn btn-danger float-right mx-1" v-on:click="destroySnippet"><i class="fa fa-trash"></i> Destroy</button>
					<button class="btn btn-primary float-right mx-1" v-on:click="restoreSnippet"><i class="fa fa-undo"></i> Restore</button>
				</div>

				<div v-else>
					<button class="btn btn-danger float-right mx-1" v-on:click="dropSnippet"><i class="fa fa-trash"></i> Drop</button>
					<button class="btn btn-secondary float-right mx-1" v-on:click="editSnippet"><i class="fa fa-edit"></i> Edit</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	const {ipcRenderer} = require('electron')
	const marked = require('marked')

	module.exports = {
		created: function() {
			// Server responds with snippet data
			ipcRenderer.on('get-result', (event, snippet) => {
				this.snippet = snippet
			})

			// Server dropped a snippet
			ipcRenderer.on('drop-result', (event, result) => {
				if (result.status == 'success') {
					this.$emit('message', 'Snippet dropped')
					this.$emit('page', 'search')
				} else {
					this.$emit('message', 'Snippet could not be dropped')
					console.log(result)
				}
			})
		},
		props: ['snippetID', 'dropped'],
		data: function() {
			return {
				snippet: {
					problem: '',
					solution: '',
					keywords: []
				}
			}
		},
		computed: {
			markedSolution: function() {
				return marked(this.snippet.solution)
			}
		},
		watch: {
			snippetID: function(id) {
				if (id) {
					ipcRenderer.send('get', id)
				}
			}
		},
		methods: {
			dropSnippet: function() {
				if (this.snippetID) {
					ipcRenderer.send('drop', this.snippetID)
				}
			},
			editSnippet: function() {
				this.$emit('page', 'edit:' + this.snippetID)
			},
			destroySnippet: function() {
				ipcRenderer.send('destroy', this.snippetID)
			},
			restoreSnippet: function() {
				ipcRenderer.send('restore', this.snippetID)
			}
		}
	}

</script>
