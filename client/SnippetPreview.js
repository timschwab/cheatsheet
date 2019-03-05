const Vue = require('vue/dist/vue.js')

Vue.component('snippet-preview', {
	props: ['snippet', 'deleted'],
	template: `
		<div class="snippet-preview">
			<hr />
			<p>
				<a href="#" v-on:click="$emit('view', snippet.id)">{{ snippet.problem }}</a>

				<span v-if="deleted">
					-
					<a href="#" v-on:click="$emit('restore', snippet.id)">Restore</a>
					|
					<a href="#" v-on:click="$emit('delete', snippet.id)">Delete</a>
				</span>

				<span v-else>
					<p>{{ snippet.score }}</p>
				</span>
			</p>
		</div>
	`
})

module.exports = {}
