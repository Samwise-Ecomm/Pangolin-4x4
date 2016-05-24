<template>
<div class="Button Button--active" :class="(!inStock || countMaxed)?'isDisabled':''" @click="addItem">
	<i class="fa" :class="icon"></i> {{ message }}
</div>
</template>

<script>
module.exports = {
	props: ['item'],

	computed: {
		count () {
			if (this.cart.cart[this.item.offer_id] && this.cart.cart[this.item.offer_id].items[this.item.id]) {
				return this.cart.cart[this.item.offer_id].items[this.item.id].count
			} else {
				return 0
			}
		},

		inStock () {
			return (this.item.stock > 0 || this.item.infinite)
		},

		countMaxed () {
			return (!this.item.infinite && this.count >= this.item.stock)
		},

		message () {
			if (!this.inStock) {
				return 'Out of Stock'
			} else if (this.countMaxed) {
				return `All in Cart (${this.count})`
			} else if (this.count > 0) {
				return `${this.count} in Cart`
			} else {
				return 'Add to Cart'
			}
		},

		icon () {
			return 'fa-cart-plus'
		},

		cart () {
			return this.$root.$refs.cart
		}
	},

	methods: {
		addItem () {
			if (!this.inStock || this.countMaxed) {
				return
			}

			this.cart.addItem(this.item)
		}
	}
}
</script>