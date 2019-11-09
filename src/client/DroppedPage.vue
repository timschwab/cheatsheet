const {ipcRenderer} = require('electron')
const Vue = require('vue/dist/vue.js')

let vm

Vue.component('dropped-page', {
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
				ipcRenderer.send('get:dropped', {})
			}
		}
	},
	template: `
		<div id="dropped-page">
			<div id="dropped-links">
				<p><a href="#" v-on:click="$emit('page', 'search')">Back to search results</a></p>
			</div>

			<div v-for="snippet in snippets">
				<p>
					<snippet-preview
						:snippet="snippet"
						:dropped=true
						:key="snippet.id"
						v-on:view="$emit('page', 'view-dropped:' + $event)"
						v-on:restore="restoreSnippet"
						v-on:destroy="dropSnippet"
					></snippet-preview>
				</p>
			</div>
		</div>
	`,
	methods: {
		restoreSnippet: function(id) {
			ipcRenderer.send('restore', id)
		},
		destroySnippet: function(id) {
			ipcRenderer.send('destroy', id)
		}
	}
})

ipcRenderer.on('get:dropped-result', (event, snippets) => {
	vm.snippets = snippets
})

// If the list has changed, then reload it.
let events = ['restore', 'destroy']
events.forEach(event => {
	ipcRenderer.on(event + '-result', () => {
		ipcRenderer.send('get:dropped', {})
	})
})

module.exports = {}
