const Vue = require('vue/dist/vue.js')
const marked = require('marked')

Vue.component('add-form', {
	props: ['problemProp', 'solutionProp', 'keywordStringProp'],
	data: function() {
		return {
			problem: this.problemProp || '',
			solution: this.solutionProp || '',
			keywordString: this.keywordStringProp || ''
		}
	},
	computed: {
		keywords: {
			get: function() {
				let result

				// Split into keywords
				result = this.keywordString.trim().split(/[, ]+/g)

				// Get rid of empty keywords
				result = result.filter(keyword => {
					return keyword
				})

				return result
			},
			set: function(words) {
				this.keywordString = words.join(',')
			}
		},
		markdownPreview: function() {
			if (this.solution) {
				return marked(this.solution)
			} else {
				return "<p>Preview of markdown rendering of the solution</p>"
			}
		}
	},
	template: `
		<div class="add-form">
			<span>Problem:</span> <input type="text" v-model="problem">
			<br />
			<span>Solution:</span> <textarea rows=10 cols=40 v-model="solution"></textarea>
			<br />
			<span>Keywords:</span> <input type="text" v-model="keywordString"> {{ keywords }}
			<br />
			<input type="button" value="Submit" v-on:click="submit">
			<hr />
			<div class="md" v-html="markdownPreview"></div>
		</div>
	`,
	methods: {
		submit: function() {
			if (!this.problem) {
				this.$emit('message', 'You gotta input a problem to add it, bro')
			} else if (!this.solution) {
				this.$emit('message', 'It isn\'t very helpful to have a problem with no solution, now is it?')
			} else if (this.keywords.length == 0) {
				this.$emit('message', 'Keywords are your friend')
			} else {
				this.$emit('submit', {
					problem: this.problem,
					solution: this.solution,
					keywords: this.keywords
				})
			}
		},
		clear: function() {
			this.problem = ''
			this.solution = ''
			this.keywordString = ''
		},
		set: function(snippet) {
			this.problem = snippet.problem || this.problem
			this.solution = snippet.solution || this.solution
			this.keywordString = snippet.keywordString || this.keywordString
			this.keywords = snippet.keywords || this.keywords
		}
	}
})

module.exports = {}
