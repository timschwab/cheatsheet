const {ipcRenderer} = require('electron')
const Vue = require('vue/dist/vue.js')

const addForm = require('./AddForm')

let vm

Vue.component('edit-page', {
	created: function (){
		vm = this
    },
    props: ['snippetKey'],
    watch: {
		snippetKey: function(key) {
			if (key) {
				ipcRenderer.send('edit:get', key)
			}
		}
	},
	template: `
		<div id="edit-page">
			<div id="edit-links">
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
            data.key = this.snippetKey
			ipcRenderer.send('edit:change', data)
		}
	}
})

// Get the snippet to edit
ipcRenderer.on('edit:get-result', (event, snippet) => {
    vm.$refs.form.set(snippet)
})

// Server adds a snippet
ipcRenderer.on('edit:change-result', (event, result) => {
	if (result.status == 'success') {
		vm.$emit('message', 'Successfully edited')
		vm.$emit('page', 'view:' + vm.snippetKey)
	} else {
		console.log(result)
		vm.$emit('message', 'Could not edit snippet')
	}
})

module.exports = {}
