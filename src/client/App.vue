<template>
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

			<dropped-page
				v-show="showDroppedPage"
				v-on:page="page = $event"
				v-on:message="message = $event"
				:visible="showDroppedPage"
			></dropped-page>

			<view-page
				v-show="showDroppedViewPage"
				v-on:page="page = $event"
				v-on:message="message = $event"

				:snippetID="droppedID"
				:dropped=true
			></view-page>
		</div>
	</div>
</template>

<script>
	const {ipcRenderer} = require('electron')

	let vm

	ipcRenderer.on('menu:dropped', (event, results) => {
		vm.page = 'dropped'
	})

	module.exports = {
		created: function() {
			vm = this
		},
		data: function() {
			return {
				page: 'search',
				message: ''
			}
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
			showDroppedPage: function() {
				return this.page == 'dropped'
			},
			showDroppedViewPage: function() {
				return this.page.slice(0, 13) == 'view-dropped:'
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
			droppedID: function() {
				if (this.showDroppedViewPage) {
					return this.page.slice(13)
				} else {
					return null
				}
			}
		}
	}
</script>
