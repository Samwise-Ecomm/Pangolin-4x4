<template>
<section v-if="loaded">
	<page-counter class="u-floatLeft" 
		v-if="pages > 1 && !hidePages"
		:pages="pages"
		:given-page.sync="page">
	</page-counter>
	<div class="u-floatRight" v-if="!hideCount">{{ count }} {{ count | pluralize 'offer' }} found.</div>
	<br v-if="!hideCount"><br v-if="!hideCount">

	<offer v-for="offer in offers"
		:offer="offer"></offer>

	<br class="u-clear">
	<page-counter class="u-floatRight" 
		v-if="pages > 1 && !hidePages"
		:pages="pages"
		:given-page.sync="page">
	</page-counter>
</section>
</template>

<script>
module.exports = {
	data () {
		this.getItems()

		return {
			loaded: false,
			offers: [],
			count: 0,
			pages: 1,
			page: 0,
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

		allItems: {
			type: Boolean,
			default: false,
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

		sort: {
			type: String,
			default: 'name',
		}
	},

	components: {
		offer: require('./offer.vue'),
		pageCounter: require('./pageCounter.vue')
	},

	watch: {
		tags () {
			this.page = 0
			this.getItems()
		}
	},

	events: {
		changePage (page) {
			if (page < 0) {
				page = this.pages - 1
			}
			if (page >= this.pages) {
				page = 0
			}

			this.page = page
			this.getItems()
		}
	},

	methods: {
		getItems () {
			if (this.tags.length == 0 && !this.allItems) {
				this.$set('offers', [])
				this.$set('count', 0)
				this.$set('pages', 0)
				this.$set('page', 0)
				this.$set('loaded', true)
				return 1
			}

			var request = {
				_must_not: JSON.stringify({ in_stock: false }),
				_sort: JSON.stringify({ id: 'desc' }),
				_page: this.page,
				_limit: this.limit
			}

			if (this.tags.length) {
				request['_must'] = JSON.stringify({ tag_array: this.tags })
			}
			
			this.$http.get('offers', request).then(response => {
				for (var i in response.data.body) {
					response.data.body[i].selected = 0
				}

				this.offers = response.data.body
				this.count = response.data.length
				this.pages = response.data.pages
				this.page = response.data._page
				this.limit = response.data._limit
				this.loaded = true

				// this.$nextTick(function() {
				// 	this.$root.$refs.cart.setAddToCartButtons()	
				// })
			})
		}
	}
}
</script>