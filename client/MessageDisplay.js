const Vue = require('vue/dist/vue.js')

Vue.component('message-display', {
	props: ['message'],
	template: `
		<div id="message-box">
			<span>{{ message }}</span>
		</div>
	`
})










module.exports = {}