const $ = require('jquery')
const Vue = require('vue/dist/vue.js')

const searchPage = require('./SearchPage')
const viewPage = require('./ViewPage')
const addPage = require('./AddPage')
const messageDisplay = require('./MessageDisplay')

$(() => {
	new Vue({
		el: '#app',
		data: {
			page: 'search',
			message: ''
		},
		computed: {
			showSearchPage: function() {
				return (this.page == 'search')
			},
			showViewPage: function() {
				return (this.page.slice(0,5) == 'view:')
			},
			showAddPage: function() {
				return (this.page == 'add')
			},
			showEditPage: function() {
				return (this.page.slice(0,5) == 'edit:')
			},
			viewingKey: function() {
				if (this.showViewPage) {
					return this.page.slice(5)
				} else {
					return null
				}
			},
			editingKey: function() {
				if (this.showEditPage) {
					return this.page.slice(5)
				} else {
					return null
				}
			}
		},
		template: `
			<div>
				<message-display
					:message="message"
				></message-display>

				<hr />

				<div id="content">
					<search-page
						v-show="showSearchPage"
						v-on:page="page = $event"
						v-on:message="message = $event"
					></search-page>

					<view-page
						v-show="showViewPage"
						v-on:page="page = $event"
						v-on:message="message = $event"

						:snippetKey="viewingKey"
					></view-page>

					<add-page
						v-show="showAddPage"
						v-on:page="page = $event"
						v-on:message="message = $event"

						:snippetKey="editingKey"
					></add-page>
				</div>
			</div>
		`
	})
})







