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
			snippets: 'test'
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

			<p>{{ snippets }}</p>
		</div>
	`
})

ipcRenderer.on('get:deleted-result', (event, snippets) => {
	vm.snippets = snippets
})
