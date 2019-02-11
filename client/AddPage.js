const {ipcRenderer} = require('electron')
const Vue = require('vue/dist/vue.js')

const addForm = require('./AddForm')

let vm

Vue.component('add-page', {
	created: function() {
		vm = this
	},
	template: `
		<div id="add-page">
			<div id="add-links">
				<p><a href="#" v-on:click="$emit('page', 'search')">Back to search results</a></p>
			</div>

			<add-form
				v-on:message="$emit('message', $event)"
				v-on:submit="submit"
				ref="form"
			></add-form>
		</div>
	`,
	methods: {
		submit: function(data) {
			ipcRenderer.send('add', data)
		}
	}
})

// Server adds a snippet
ipcRenderer.on('add-result', (event, result) => {
	if (result.status == 'success') {
		vm.$emit('message', 'Successfully added')
		vm.$refs.form.clear()
	} else {
		console.log(result)
		vm.$emit('message', 'Could not add snippet')
	}
})

module.exports = {}
