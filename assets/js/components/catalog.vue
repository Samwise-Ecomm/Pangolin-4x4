<template>
	<section v-if="loaded">
		<page-counter class="u-floatLeft" 
			v-if="pages > 1 && !hidePages"
			:pages="pages"
			:page.sync="page">
		</page-counter>
		<div class="u-floatRight" v-if="!hideCount">{{ count }} {{ count | pluralize 'item' }} found.</div>
		<br v-if="!hideCount"><br v-if="!hideCount">

		<item v-for="item in items"
			:item="item"
			:style="style"></item>

		<br class="u-clear">
		<page-counter class="u-floatRight" 
			v-if="pages > 1 && !hidePages"
			:pages="pages"
			:page.sync="page">
		</page-counter>
	</section>
</template>

<script>
module.exports = {
	data () {
		this.getItems()

		return {
			loaded: false,
			items: [],
			count: 0,
			pages: 1,
			page: 1,
		}
	},

	props: {
		tags: {
			type: Array,
			default () { return [] },
			coerce: function(value) {
				if (typeof value == 'string') {
					return value.split(',')
				} else {
					return value
				}
			}
		},

		limit: {
			type: Number,
			default: 10,
			coerce (input) {
				return parseInt(input)
			}
		},

		hideCount: {
			type: Boolean,
			default: false,
		},

		hidePages: {
			type: Boolean,
			default: false,
		},

		style: {
			type: String,
			default: 'rows',
		},

		sort: {
			type: String,
			default: 'name',
		}
	},

	components: {
		item: require('./item.vue'),
		pageCounter: require('./pageCounter.vue')
	},

	watch: {
		tags () {
			this.page = 1
			this.getItems()
		}
	},

	events: {
		changePage (page) {
			if (page < 1) {
				page = this.pages
			}
			if (page > this.pages) {
				page = 1
			}

			this.page = page
			this.getItems()
		}
	},

	methods: {
		getItems () {
			var request = {
				tags: this.tags,
				page: this.page,
				limit: this.limit
			}
			this.$http.post('/api/search/item-tags', request).then(function(response) {
				for (var i in response.data.items) {
					response.data.items[i].selected = 0
				}

				this.items = response.data.items
				this.count = response.data.count
				this.pages = response.data.pages
				this.page = response.data.page
				this.limit = response.data.limit
				this.loaded = true

				this.$nextTick(function() {
		  		this.$root.$refs.cart.setAddToCartButtons()	
		  	})
			})
		}
	}
}
</script>