const {ipcRenderer} = require('electron')
const Vue = require('vue/dist/vue')

const messageDisplay = require('./MessageDisplay')
const searchPage = require('./SearchPage')
const viewPage = require('./ViewPage')
const addPage = require('./AddPage')
const editPage = require('./EditPage')
const deletedPage = require('./DeletedPage')

let vm

document.addEventListener('DOMContentLoaded', () => {
	vm = new Vue({
		el: '#app',
		data: {
			page: 'search',
			message: ''
		},
		computed: {
			showSearchPage: function() {
				return this.page == 'search'
			},
			showViewPage: function() {
				return this.page.slice(0, 5) == 'view:'
			},
			showAddPage: function() {
				return this.page == 'add'
			},
			showEditPage: function() {
				return this.page.slice(0, 5) == 'edit:'
			},
			showDeletedPage: function() {
				return this.page == 'deleted'
			},
			showDeletedViewPage: function() {
				return this.page.slice(0, 13) == 'view-deleted:'
			},
			viewingID: function() {
				if (this.showViewPage) {
					return this.page.slice(5)
				} else {
					return null
				}
			},
			editingID: function() {
				if (this.showEditPage) {
					return this.page.slice(5)
				} else {
					return null
				}
			},
			deletedID: function() {
				if (this.showDeletedViewPage) {
					return this.page.slice(13)
				} else {
					return null
				}
			}
		},
		template: `
			<div class="m-3">
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

						:snippetID="viewingID"
					></view-page>

					<add-page
						v-show="showAddPage"
						v-on:page="page = $event"
						v-on:message="message = $event"
					></add-page>

					<edit-page
						v-show="showEditPage"
						v-on:page="page = $event"
						v-on:message="message = $event"

						:snippetID="editingID"
					></edit-page>

					<deleted-page
						v-show="showDeletedPage"
						v-on:page="page = $event"
						v-on:message="message = $event"

						:visible="showDeletedPage"
					></deleted-page>

					<view-page
						v-show="showDeletedViewPage"
						v-on:page="page = $event"
						v-on:message="message = $event"

						:snippetID="deletedID"
						:deleted=true
					></view-page>
				</div>
			</div>
		`
	})
})

ipcRenderer.on('menu:deleted', (event, results) => {
	vm.page = 'deleted'
})
