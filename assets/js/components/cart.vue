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

	ready () {
		this.restoreCart()
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
			return Object.keys(this.cart).length == 0
		}
	},

	components: {
		offer: require('./cartOffer.vue')
	},

	methods: {
		addItem (item, thumb, partNumbers) {
			if (!this.cart[item.offer_id]) {
				this.$set(`cart[${item.offer_id}]`, {
					name: item.offer_name,
					thumb: thumb,
					partNumbers: partNumbers,
					items: {}
				})
			}

			if (!this.cart[item.offer_id].items[item.id]) {
				this.$set(`cart[${item.offer_id}].items[${item.id}]`, item)
				this.$set(`cart[${item.offer_id}].items[${item.id}].count`, 1)	
			} else {
				this.cart[item.offer_id].items[item.id].count += 1
			}

			this.storeCart()
		},

		storeCart() {
			localStorage.cartExperation = Date.now() + (1000 * 60 * 60 * 24);
			localStorage.cart = JSON.stringify(this.cart)
			localStorage.condensedCart = JSON.stringify(this.condenseCart())
		},

		condenseCart() {
			var condensedCart = {}

			for (var offerId in this.cart) {
				condensedCart[offerId] = {}
				var offer = this.cart[offerId]

				for (var itemId in this.cart[offerId].items) {
					var item = offer.items[itemId]
					condensedCart[offerId][itemId] = item.count
				}
			}

			return condensedCart
		},

		restoreCart() {
			if (localStorage.cartExperation && Date.now() > localStorage.cartExperation) {
				delete localStorage.cart
				delete localStorage.cartExperation
				delete localStorage.condensedCart
			}

			if (localStorage.cart) {
				this.$set('cart', JSON.parse(localStorage.cart))
			} else {
				this.$set('cart', {})
			}
		},

		clearCart() {
			var Vue = require('vue')

			for (var offerId in this.cart) {
				var offer = this.cart[offerId]
				for (var itemId in this.cart[offerId].items) {
					var item = offer.items[itemId]
					if (item.count == 0) {
						Vue.delete(this.cart[offerId].items, itemId)
					}
				}
				if (Object.keys(offer.items).length == 0) {
					Vue.delete(this.cart, offerId)
				}
			}

			this.storeCart()
		},
	}
}
</script>