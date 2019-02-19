const Vue = require('vue/dist/vue.js')

Vue.component('deleted-page', {
	template: `
		<div id="deleted-page">
			<div id="deleted-links">
				<p><a href="#" v-on:click="$emit('page', 'search')">Back to search results</a></p>
			</div>

			<p>Page for searching and restoring recently deleted snippets</p>
		</div>
	`
})
