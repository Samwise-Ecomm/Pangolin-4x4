<template>
<div id="cart" v-if="!empty">
	<div id="Cart-head">Cart</div>
	<offer v-for="(offerId, offer) in cart"
		:offer="offer" 
		:offer-id="offerId"
		:last-offer-id="lastOfferId">
	</offer>
	<a v-link="{ path: '/checkout/cart' }">
		<div id="Cart-foot" class="u-active">
			<b>Subtotal:</b> {{ subTotal / 100 | currency }}<b class='u-floatRight'>Checkout</b>
		</div>
	</a>
</div>
</template>

<script>
module.exports = {
	data () {
		return {
			cart: {}
		}
	},

	computed: {
		subTotal () {
			var subTotal = 0
			for (var offerId in this.cart) {
				for (var itemId in this.cart[offerId].items) {
					var item = this.cart[offerId].items[itemId]
					subTotal += item.count * item.price
				}
			}
			return subTotal
		},

		lastOfferId () {
			if (this.cart) {
				return Object.keys(this.cart)[Object.keys(this.cart).length - 1]
			} else {
				return null
			}
		},

		empty () {
			return (this.subTotal == 0)
		}
	},

	components: {
		offer: require('./cartOffer.vue')
	},

	methods: {
		addItem (item) {
			if (!this.cart[item.offer_id]) {
				this.$set(`cart[${item.offer_id}]`, {
					name: item.offer_name,
					items: {}
				})
			}

			if (!this.cart[item.offer_id].items[item.id]) {
				this.$set(`cart[${item.offer_id}].items[${item.id}]`, item)
				this.$set(`cart[${item.offer_id}].items[${item.id}].count`, 1)	
			} else {
				this.cart[item.offer_id].items[item.id].count += 1
			}
		}
	}
}
</script>