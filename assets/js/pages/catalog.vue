<template>
	<div class="row" v-if="loaded">
		<h1>{{ catalog.name }}</h1>
		<p>{{ catalog.description }}</p>

		<section v-if="catalog.tags.length > 1">
			<hr>
			<ul class="u-cols-3">
				<li v-for="tag in catalog.tags">
					<label for='{{ tag }}'} class='Checkbox'>
						<input type='checkbox' id='{{ tag }}' checked @click='toggleTag(tag)'>
						<i class="fa fa-fw" :class="(selected.tags.indexOf(tag) != -1)?'fa-check-square':'fa-square'"></i> {{ tag.substring(trim) }}
					</label>
				</li>
			</ul>
			<br>
			<ul class="u-cols-3">
				<li class="u-active" @click="fillTags">
					<i class="fa fa-fw fa-plus-square"></i> Select All
				</li>
				<li class="u-active" @click="clearTags">
					<i class="fa fa-fw fa-minus-square"></i> Select None
				</li>
			</ul>
		</section>

		<hr>
		<i>Note: Shopping cart does not account for shipping. Once we receive your order, we will send you follow-up invoice that includes the calculated shipping amount. Thank you!</i>
		<hr>

		<section>
			<div class="u-floatLeft" v-if="selected.pages > 1">
				<span class="fa fa-chevron-left u-active" @click="changePage(selected.page - 1)"></span>&nbsp;
				<span :class="(selected.page == 1)?'u-highlight':'u-active'" @click="changePage(1)">1</span>
				<span v-if="selected.page > 3">...</span>
				<span class="u-active" @click="changePage(selected.page - 1)" v-if="selected.page > 2">{{ selected.page - 1}}</span>
				<span class="u-highlight" v-if="selected.page > 1 && selected.page < selected.pages">{{ selected.page}}</span>
				<span class="u-active" @click="changePage(selected.page + 1)" v-if="selected.page < selected.pages - 1">{{ selected.page + 1}}</span>
				<span v-if="selected.page < selected.pages - 2">...</span>
				<span :class="(selected.page == selected.pages)?'u-highlight':'u-active'" @click="changePage(selected.pages)">{{ selected.pages }}</span>
				<span class="fa fa-chevron-right u-active" @click="changePage(selected.page + 1)"></span>
			</div>
			<div class="u-floatRight">{{ selected.count }} {{ selected.count | pluralize 'item' }} found.</div>
			<br><br>

			<div class='CatalogItem' v-for="item in selected.items">
				<a v-link="{ path: '/item/'+item.id }">
					<img :src="'/img/'+item.images.medium[0]" class='CatalogItem-thumb u-activeImg'>
				</a>
				<div class='CatalogItem-description'>
					<h2><a v-link="{ path: '/item/'+item.id }">{{{ item.name + ', ' + item.type_info.state }}}</a></h2>
					<div v-if="item.type_info.part_number">Part #{{ item.type_info.part_number.split(',').join(', #') }}</div>
					<br>
					<p>
						{{{ item.description }}}
						<br><br>
						{{ item.type_info.quality }}, {{ (item.type_info.state == 'NOS')?'New/Old Stock':item.type_info.state }}.
						<span v-if="item.type_info.part_number">Part #{{ item.type_info.part_number.split(',').join(', #') }}.</span>
						<span v-if="item.type_info.ss_part_number">Superseded by Part #{{ item.type_info.ss_part_number.split(',').join(', #') }}.</span>
					</p>
					<div class='CatalogItem-controls'>
						<select class='CatalogItem-variations js-variantSelector'
							v-model="item.selected"
							:item-id="item.id"
							@change="changedVariant(item)"
							v-if="item.variants.length > 1">
							<option v-for="(variantIndex, variant) in item.variants" :value="variantIndex">{{{ variant.name }}} - {{ variant.price | currency }}</option>
						</select>
						<br><br>
						<div class='Button Button--active inCatalog u-floatRight js-addToCart' 
							v-if="item.variants[item.selected].infinite || item.variants[item.selected].stock > 0"
							:variant-id="item.variants[item.selected].id"
							:item-id="item.id"
							@click="addToCart(item)">
		        	<i class="fa fa-cart-plus"></i> Add to Cart
	        	</div>
						<div class="Button Button--active inCatalog u-floatRight isDisabled" v-else>
							Out of Stock
						</div>
	        	<a v-link="{ path: '/item/'+item.id }">
	        		<div class='Button Button--dark inCatalog u-floatRight u-marginRight'>
	        			<i class='fa fa-search'></i> Inspect Item
	        		</div>
	        	</a>
	        	<span class="CatalogItem-price">
	        		<b>{{ item.variants[item.selected].price | currency }}</b>
	        		<span v-if="item.variants[item.selected].unit != 'Unit'" class="u-thin"> / {{ item.variants[item.selected].unit }}</span>
	        	</span>
					</div>
				</div>
				<hr class='u-clear'>
			</div>

			<br>
			<div class="u-floatRight" v-if="selected.pages > 1">
				<span class="fa fa-chevron-left u-active" @click="changePage(selected.page - 1)"></span>&nbsp;
				<span :class="(selected.page == 1)?'u-highlight':'u-active'" @click="changePage(1)">1</span>
				<span v-if="selected.page > 3">...</span>
				<span class="u-active" @click="changePage(selected.page - 1)" v-if="selected.page > 2">{{ selected.page - 1}}</span>
				<span class="u-highlight" v-if="selected.page > 1 && selected.page < selected.pages">{{ selected.page}}</span>
				<span class="u-active" @click="changePage(selected.page + 1)" v-if="selected.page < selected.pages - 1">{{ selected.page + 1}}</span>
				<span v-if="selected.page < selected.pages - 2">...</span>
				<span :class="(selected.page == selected.pages)?'u-highlight':'u-active'" @click="changePage(selected.pages)">{{ selected.pages }}</span>
				<span class="fa fa-chevron-right u-active" @click="changePage(selected.page + 1)"></span>
			</div>
		</section>
	</div>
</template>

<script>
module.exports = {
	data () {
		return {
			catalog: {},
			selected: {
				tags: [],
				items: [],
				count: 0,
				pages: 0,
				page: 1,
				limit: 10
			},
			loaded: false
		}
	},

	route: {
		data () {
			this.getCatalog()
		},
	},

	computed: {
		trim () {
			if (this.catalog.tags.length <= 1) {
				return 0
			}

			var chunk = this.compareStartingChunks(this.catalog.tags[0], this.catalog.tags[1])
			if (this.catalog.tags.length == 2) {
				return chunk.length
			}

			for (var i = 2; i < this.catalog.tags.length; i++) {
				var tag = this.catalog.tags[i]
				chunk = this.compareStartingChunks(chunk, tag)
			}
			return chunk.length
		}
	},

	watch: {
		'selected.tags' () {
			this.selected.page = 1
			this.getItems()
		}
	},

	methods: {
		getCatalog () {
			this.$http.get('/api/catalog/'+this.$route.params.id).then(function(response) {
		  	this.$set('catalog', response.data)
		  	this.fillTags()
		  	this.loaded = true
	    })
		},

		getItems () {
			var request = {
				tags: this.selected.tags,
				page: this.selected.page,
				limit: this.selected.limit
			}
			this.$http.post('/api/search/item-tags', request).then(function(response) {
				for (var i in response.data.items) {
					response.data.items[i].selected = 0
				}

				this.selected.items = response.data.items
				this.selected.count = response.data.count
				this.selected.pages = response.data.pages
				this.selected.page = response.data.page
				this.selected.limit = response.data.limit

				this.$nextTick(function() {
		  		this.$parent.$refs.cart.setAddToCartButtons()	
		  	})
			})
		},

		changePage (page) {
			if (page < 1) {
				page = this.selected.pages
			}
			if (page > this.selected.pages) {
				page = 1
			}

			this.selected.page = page
			this.getItems()
		},

		changedVariant(item) {
			var itemId = item.id
			var variantId = item.selected

			$('.js-addToCart[item-id=' + itemId + ']').removeClass('isDisabled')
			$('.js-addToCart[item-id=' + itemId + ']').addClass('Button--active')
			$('.js-addToCart[item-id=' + itemId + ']').html('<i class="fa fa-cart-plus"></i> Add to Cart')

			this.$nextTick(function() {
				this.$parent.$refs.cart.setAddToCartButtons()	
			})
		},

		fillTags () {
			this.selected.tags = []
			for (var i = 0; i < this.catalog.tags.length; i++) {
				this.selected.tags.push(this.catalog.tags[i])
			};
		},

		clearTags () {
			this.selected.tags = []
		},

		toggleTag (tag) {
			var index = this.selected.tags.indexOf(tag)
			if (index != -1) {
				this.selected.tags.splice(index, 1)
			} else {
				this.selected.tags.push(tag)
			}
		},

		addToCart(item) {
			var variantId = item.variants[item.selected].id
			var variant = item.variants[item.selected]

			if (!variant.infinite && variant.stock == 0) {
				return 0
			}

			var cartItem = {
				name: item.name,
				images: item.images,
				part_number: item.type_info.part_number,
				state: item.type_info.state,
				variants: {},
			}
	
			cartItem.variants[variant.id] = {
				name: variant.name,
				price: variant.price,
				unit: variant.unit,
				stock: variant.stock,
				infinite: variant.infinite,
				count: 1
			}

			this.$parent.$refs.cart.addToCart(cartItem, item.id, variant.id)

			return 1
		},

		compareStartingChunks(stringOne, stringTwo) {
			var firstDash = stringOne.indexOf('-')
			if (firstDash == -1) {
				return ""
			}

			var firstChunk = stringOne.substring(0,firstDash)

			var firstDash = stringTwo.indexOf('-')
			if (firstDash == -1) {
				return ""
			}

			if (stringTwo.substring(0,firstDash) == firstChunk) {
				return firstChunk+'-'
			} else {
				return ""
			}
		}
	},
}
</script>