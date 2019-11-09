<template>
	<div class="m-3">
		<MessageDisplay
			:message="message"
		></MessageDisplay>

		<hr />

		<div id="content">
			<SearchPage
				v-show="showSearchPage"
				v-on:page="page = $event"
				v-on:message="message = $event"
			></SearchPage>

			<ViewPage
				v-show="showViewPage"
				v-on:page="page = $event"
				v-on:message="message = $event"
				:snippetID="viewingID"
			></ViewPage>

			<AddPage
				v-show="showAddPage"
				v-on:page="page = $event"
				v-on:message="message = $event"
			></AddPage>

			<EditPage
				v-show="showEditPage"
				v-on:page="page = $event"
				v-on:message="message = $event"
				:snippetID="editingID"
			></EditPage>

			<DroppedPage
				v-show="showDroppedPage"
				v-on:page="page = $event"
				v-on:message="message = $event"
				:visible="showDroppedPage"
			></DroppedPage>

			<ViewPage
				v-show="showDroppedViewPage"
				v-on:page="page = $event"
				v-on:message="message = $event"

				:snippetID="droppedID"
				:dropped=true
			></ViewPage>
		</div>
	</div>
</template>

<script>
	const {ipcRenderer} = require('electron')
	const MessageDisplay = require('./MessageDisplay.vue').default
	const SearchPage = require('./SearchPage.vue').default
	const ViewPage = require('./ViewPage.vue').default
	const AddPage = require('./AddPage.vue').default
	const EditPage = require('./EditPage.vue').default
	const DroppedPage = require('./DroppedPage.vue').default

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
		},
		components: {
			MessageDisplay,
			SearchPage,
			ViewPage,
			AddPage,
			EditPage,
			DroppedPage
		}
	}
</script>
