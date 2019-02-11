const {ipcRenderer} = require('electron');
const Vue = require('vue/dist/vue.js');
const marked = require('marked');

let vm;

Vue.component('view-page', {
	created: function() {
		vm = this;
	},
	props: ['snippetKey'],
	data: function() {
		return {
			snippet: {
				problem: '',
				solution: '',
				keywords: []
			}
		};
	},
	computed: {
		markedSolution: function() {
			return marked(this.snippet.solution);
		}
	},
	watch: {
		snippetKey: function(key) {
			if (key) {
				ipcRenderer.send('get', key);
			}
		}
	},
	template: `
		<div id="view-page">
			<div id="view-links">
				<p><a href="#" v-on:click="$emit('page', 'search')">Back to search results</a></p>
				<p><button v-on:click="editSnippet">Edit this snippet</button></p>
				<p><button v-on:click="deleteSnippet">Delete this snippet</button></p>
			</div>
			<div id="view-results">
				<p class="problem">{{ snippet.problem }}</p>
				<div class="solution" v-html="markedSolution"></div>
				<p class="keywords">{{ snippet.keywords }}</p>
			</div>
		</div>
	`,
	methods: {
		deleteSnippet: function() {
			if (this.snippetKey) {
				ipcRenderer.send('delete', this.snippetKey);
			}
		},
		editSnippet: function() {
			this.$emit('page', 'edit:' + this.snippetKey);
		}
	}
});

// Server responds with snippet data
ipcRenderer.on('get-result', (event, snippet) => {
	vm.snippet = snippet;
});

// Server deleted a snippet
ipcRenderer.on('delete-result', (event, result) => {
	if (result.status == 'success') {
		vm.$emit('message', 'Snippet deleted');
		vm.$emit('page', 'search');
	} else {
		vm.$emit('message', 'Snippet could not be deleted');
		console.log(result);
	}
});

module.exports = {};
