const {ipcRenderer} = require('electron')
const Vue = require('vue/dist/vue.js')
const marked = require('marked')

Vue.component('view-page', {
	created: function() {
		// Server responds with snippet data
		ipcRenderer.on('get-result', (event, snippet) => {
			this.snippet = snippet
		})

		// Server deleted a snippet
		ipcRenderer.on('delete-result', (event, result) => {
			if (result.status == 'success') {
				this.$emit('message', 'Snippet deleted')
				this.$emit('page', 'search')
			} else {
				this.$emit('message', 'Snippet could not be deleted')
				console.log(result)
			}
		})
	},
	props: ['snippetKey', 'deleted'],
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
		snippetKey: function(key) {
			if (key) {
				ipcRenderer.send('get', key)
			}
		}
	},
	template: `
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
					<div v-if="deleted">
						<button class="btn btn-danger float-right mx-1" v-on:click="deletePermanent"><i class="fa fa-trash"></i> Delete Permanently</button>
						<button class="btn btn-primary float-right mx-1" v-on:click="restoreSnippet"><i class="fa fa-undo"></i> Restore</button>
					</div>

					<div v-else>
						<button class="btn btn-danger float-right mx-1" v-on:click="deleteSnippet"><i class="fa fa-trash"></i> Delete</button>
						<button class="btn btn-secondary float-right mx-1" v-on:click="editSnippet"><i class="fa fa-edit"></i> Edit</button>
					</div>
				</div>
			</div>
		</div>
	`,
	methods: {
		deleteSnippet: function() {
			if (this.snippetKey) {
				ipcRenderer.send('delete', this.snippetKey)
			}
		},
		editSnippet: function() {
			this.$emit('page', 'edit:' + this.snippetKey)
		},
		deletePermanent: function() {
			ipcRenderer.send('delete:permanent', this.snippetKey)
		},
		restoreSnippet: function() {
			ipcRenderer.send('restore', this.snippetKey)
		}
	}
})

module.exports = {}
