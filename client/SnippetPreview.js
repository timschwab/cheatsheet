const Vue = require('vue/dist/vue.js')

Vue.component('snippet-preview', {
	props: ['snippet'],
	template: `
		<div class="snippet-preview">
			<hr />
			<p><a href="#" v-on:click="clicked">{{ snippet.problem }}</a></p>
			<p v-if="snippet.score">{{ snippet.score }}</p>
		</div>
	`,
	methods: {
		clicked: function() {
			this.$emit('click', this.snippet.key)
		}
	}
})
