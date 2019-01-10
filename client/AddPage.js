const {ipcRenderer} = require('electron')
const Vue = require('vue/dist/vue.js')

let vm

Vue.component('add-page', {
	created: function (){
		vm = this
	},
	data: function() {
		return {
			problem: '',
			solution: '',
			keywordInput: ''
		}
	},
	computed: {
		keywords: {
			get: function() {
				let result

				// split into keywords
				result = this.keywordInput.trim().split(/[, ]+/g)

				// get rid of empty keywords
				result = result.filter(keyword => {
					return keyword
				})

				return result
			},
			set: function(words) {
				this.keywordInput = words.join(',')
			}
		}
	},
	watch: {
		snippetKey: function(key) {
			if (key) {
				ipcRenderer.send('get', key)
			}
		}
	},
	template: `
		<div id="add-page">
			<div id="add-links">
				<p><a href="#" v-on:click="$emit('page', 'search')">Back to search results</a></p>
			</div>

			<div id="form">
				<span>Problem:</span><input type="text" v-model="problem">
				<br />
				<span>Solution:</span><textarea v-model="solution"></textarea>
				<br />
				<span>Keywords:</span><input type="text" v-model="keywordInput">
				{{ keywords }}
				<br />
				<input type="button" value="Submit" v-on:click="add">
			</div>

			<div id="add-message"></div>
		</div>
	`,
	methods: {
		add: function() {
			if (!this.problem) {
				this.$emit('message', 'You gotta input a problem to add it, bro')
			} else if (!this.solution) {
				this.$emit('message', 'It isn\'t very helpful to have a problem with no solution, now is it?')
			} else if (this.keywords.length == 0) {
				this.$emit('message', 'Keywords are your friend')
			} else {
				ipcRenderer.send('add', {
					problem: this.problem,
					solution: this.solution,
					keywords: this.keywords
				})
			}
		}
	}
})

// Server adds a snippet
ipcRenderer.on('add-result', (event, result) => {
	if (result.status == 'success') {
		vm.$emit('message', 'Successfully added')
		vm.problem = ''
		vm.solution = ''
		vm.keywordInput = ''
	} else {
		console.log(result)
		vm.$emit('message', 'Could not add snippet')
	}
})

// Open up a edit page
ipcRenderer.on('get-result', (event, snippet) => {
	console.log(vm)
	console.log(snippet)
	vm.problem = snippet.problem
	vm.solution = snippet.solution
	vm.keywords = snippet.keywords
})

module.exports = {}
