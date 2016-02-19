<template>
<div class='CatalogItem' v-if='loaded && style == "rows"'>
	<a @click="go(item.id)">
		<img :src="'/img/'+item.images.medium[0]" class='CatalogItem-thumb u-activeImg'>
	</a>
	<div class='CatalogItem-description'>
		<h2><a @click="go(item.id)">{{{ item.name + ', ' + item.type_info.state }}}</a></h2>
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
    	<a @click="go(item.id)">
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
<a @click="go(item.id)" v-if="loaded && style == 'grid'">
	<div class="CatalogGridItem">
		<img :src="'/img/'+item.images.small[0]" class='CatalogGridItem-thumb'>
		<br>
		<div class="CatalogGridItem-name">
			<b>{{{ item.name + ', ' + item.type_info.state }}}</b>
			<div v-if="item.type_info.part_number">Part #{{ item.type_info.part_number.split(',').join(', #') }}</div>
		</div>
		<br>
		<span class="CatalogGridItem-price">
			<b>{{ item.variants[0].price | currency }}</b>
			<span v-if="item.variants[0].unit != 'Unit'" class="u-thin"> / {{ item.variants[0].unit }}</span>
		</span>
	</div>
</a>
</template>

<script>
module.exports = {
	data () {
		return {
			loaded: true
		}
	},

	props: {
		item: {
			type: Object,
			default: {},
		},

		id: {
			type: Number,
			default: null,
		},

		style: {
			type: String,
			default: 'rows'
		}
	},

	methods: {
		go (id) {
			this.$root.$router.go({ path: '/item/'+id })
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

			this.$root.$refs.cart.addToCart(cartItem, item.id, variant.id)

			return 1
		},

		changedVariant(item) {
			var itemId = item.id
			var variantId = item.selected

			$('.js-addToCart[item-id=' + itemId + ']').removeClass('isDisabled')
			$('.js-addToCart[item-id=' + itemId + ']').addClass('Button--active')
			$('.js-addToCart[item-id=' + itemId + ']').html('<i class="fa fa-cart-plus"></i> Add to Cart')

			this.$nextTick(function() {
				this.$root.$refs.cart.setAddToCartButtons()	
			})
		},
	}
}
</script>