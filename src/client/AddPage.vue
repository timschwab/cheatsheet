<template>
	<div id="add-page">
		<div id="add-links">
			<p><a href="#" v-on:click="$emit('page', 'search')">Back to search results</a></p>
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

	export.modules = {
		created: function() {
			vm = this
		},
		methods: {
			submit: function(data) {
				ipcRenderer.send('add', data)
			}
		}
	})
</script>
