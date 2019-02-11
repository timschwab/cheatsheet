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
				return '<p>Preview of markdown rendering of the solution</p>'
			}
		}
	},
	template: `
		<div class="add-form form-horizontal">
			<div class="form-group">
				<label for="problem" class="control-label col-sm-2">Problem:</label>
				<div class="col-sm-10">
					<input class="form-control" id="problem" type="text" v-model="problem">
				</div>	
			</div>
			<div class="form-group">
				<label for="solution" class="control-label col-sm-2">Solution:</label>
				<div class="col-sm-10">
					<textarea class="form-control" id="solution" rows=10 cols=40 v-model="solution"></textarea>
				</div>
			</div>
			<div class="form-group">
				<label for="keywords" class="control-label col-sm-2">Keywords:</label>
				<div class="col-sm-10">
					<input class="form-control" id="keywords" type="text" v-model="keywordString"> {{ keywords }}
				</div>
			</div>
			<div class="form-group">
				<div class="col-sm-offset-2 col-sm-10">
					<input class="btn" type="button" value="Submit" v-on:click="submit">
				</div>
			</div>
			<hr />
			<div class="md" v-html="markdownPreview"></div>
		</div>
	`,
	methods: {
		submit: function() {
			if (!this.problem) {
				this.$emit('message', 'You gotta input a problem to add it, bro')
			} else if (!this.solution) {
				this.$emit(
					'message',
					"It isn't very helpful to have a problem with no solution, now is it?"
				)
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
