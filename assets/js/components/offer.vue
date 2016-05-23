<template>
<div v-if="loaded">
	<div>
		<a v-link="{ path: `/item/${id}` }">
			<div class="CatalogGridItem">
				<img :src="'/img/'+offer.pictures[0].source.sm" class='CatalogGridItem-thumb' v-if="offer.pictures.length">
				<img src="/img/def.jpg" class='CatalogGridItem-thumb' v-else>
				<br>
				<div class="CatalogGridItem-name">
					<b>{{ offer.name }}</b>
					<div v-if="partNumbers">Part #{{ partNumbers.join(', #') }}</div>
				</div>
				<br>
				<span class="CatalogGridItem-price">
					<b>{{ offer.items[0].price / 100 | currency }}</b>
					<span v-if="offer.items[0].unit != 'Unit'" class="u-thin"> / {{ offer.items[0].unit }}</span>
				</span>
			</div>
		</a>
	</div>
</div>
</template>

<script>
module.exports = {
	data () {
		return {
			loaded: true
		}
	},

	computed: {
		partNumbers () {
			var numbers = [];
			for (var i = 0; i < this.offer.items.length; i++) {
				if (this.offer.items[i]['part_number'] && !numbers.includes(this.offer.items[i]['part_number'])) {
					numbers.push(this.offer.items[i]['part_number'])
				}
			}
		}
	},

	props: ['offer', 'id'],

	methods: {
		go (id) {
			this.$root.$router.go()
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