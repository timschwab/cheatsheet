<template>
	<div id="edit-page">
		<div id="edit-links">
			<p><a href="#" v-on:click="back">Back to view page</a></p>
		</div>

		<AddForm
			v-on:message="$emit('message', $event)"
			v-on:submit="submit"
			ref="form"
		></AddForm>
	</div>
</template>

<script>
	const {ipcRenderer} = require('electron')
	const AddForm = require('./AddForm')

	let vm

	// Get the snippet to edit
	ipcRenderer.on('edit:get-result', (event, snippet) => {
		vm.$refs.form.set(snippet)
	})

	// Server adds a snippet
	ipcRenderer.on('edit:change-result', (event, result) => {
		if (result.status == 'success') {
			vm.$emit('message', 'Successfully edited')
			vm.$emit('page', 'view:' + vm.snippetID)
		} else {
			console.log(result)
			vm.$emit('message', 'Could not edit snippet')
		}
	})

	module.exports = {
		created: function() {
			vm = this
		},
		props: ['snippetID'],
		watch: {
			snippetID: function(id) {
				if (id) {
					ipcRenderer.send('edit:get', id)
				}
			}
		},
		methods: {
			back: function(event) {
				this.$emit('page', 'view:' + vm.snippetID)
			},
			submit: function(data) {
				data.id = this.snippetID
				ipcRenderer.send('edit:change', data)
			}
		}
	}
</script>
