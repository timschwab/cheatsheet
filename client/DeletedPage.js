const {ipcRenderer} = require('electron')
const Vue = require('vue/dist/vue.js')

let vm

Vue.component('deleted-page', {
	created: function() {
		vm = this
	},
	props: ['visible'],
	data: function() {
		return {
			snippets: []
		}
	},
	watch: {
		visible: function() {
			if (this.visible) {
				ipcRenderer.send('get:deleted', {})
			}
		}
	},
	template: `
		<div id="deleted-page">
			<div id="deleted-links">
				<p><a href="#" v-on:click="$emit('page', 'search')">Back to search results</a></p>
			</div>

			<div v-for="snippet in snippets">
				<p>
					reuse &lt;snippet-preview&gt;:
					{{ snippet }}
					<a href="#" v-on:click="this.restoreSnippet()">Restore</a>
					<a href="#" v-on:click="deleteSnippet">Delete</a>
				</p>
			</div>
		</div>
	`,
	methods: {
		restoreSnippet: function() {
			console.log('restoring...')
		},
		deleteSnippet: function() {
			console.log('deleting...')
		}
	}
})

ipcRenderer.on('get:deleted-result', (event, snippets) => {
	vm.snippets = snippets
})
