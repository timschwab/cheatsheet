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
					<snippet-preview
						:snippet="snippet"
						:deleted=true
						:key="snippet.id"
						v-on:view="$emit('page', 'view-deleted:' + $event)"
						v-on:restore="restoreSnippet"
						v-on:delete="deleteSnippet"
					></snippet-preview>
				</p>
			</div>
		</div>
	`,
	methods: {
		restoreSnippet: function(id) {
			ipcRenderer.send('restore', id)
		},
		deleteSnippet: function(id) {
			ipcRenderer.send('delete:permanent', id)
		}
	}
})

ipcRenderer.on('get:deleted-result', (event, snippets) => {
	vm.snippets = snippets
})

// If the list has changed, then reload it.
let events = ['restore', 'delete:permanent']
events.forEach(event => {
	ipcRenderer.on(event + '-result', () => {
		ipcRenderer.send('get:deleted', {})
	})
})

module.exports = {}
