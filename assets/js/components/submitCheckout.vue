<template>
	<div>
		<h2>Order Confirmation:</h2>
		<hr>

		<div class='CheckoutConfirm-item' v-for="offer in cart">
			<div class='CheckoutConfirm-title'>{{{ offer.name }}}</div>
			<!-- <div class='CheckoutConfirm-itemNum' v-if="item.part_number">Part #{{ item.part_number.split(',').join(', #') }}</div> -->

			<span v-for="item in offer.items">
				<div class='CheckoutConfirm-price'>{{ item.price / 100 | currency }} * {{ item.count }}</div>
				<div class='CheckoutConfirm-variant u-thin' v-if="item.name">{{{ item.name }}} -&nbsp;</div>
			</span>

			<hr>
		</div>

		<div class='CheckoutConfirm-subContainer'>
			<div class='Button Button--active Button--thin u-width200 u-floatLeft'  v-link="{ path: '/checkout/cart' }">< Edit Cart</div>
			<div class='CheckoutConfirm-subTotal'>{{ subTotal / 100 | currency }}</div>
			<div class='CheckoutConfirm-subTitle'>Subtotal:&nbsp;</div>
		</div>

		<hr class='u-clear'>

		<h2 v-if="billingInfo.seperate_billing">Shipping Confirmation:</h2>
		<h2 v-else>Shipping &amp; Billing Confirmation:</h2>

		<hr>
		<div class='CheckoutConfirm-shippingAddress'>
			<b>{{ shippingInfo.first_name + " " + shippingInfo.last_name }}
			<span v-if="shippingInfo.company"> of {{ shippingInfo.company }}</span></b><br>
			{{ shippingInfo.street_address_first }}<br>
			<span v-if="shippingInfo.street_address_second">{{ shippingInfo.street_address_second }}<br></span>
			{{ shippingInfo.city + " " + shippingInfo.state + ", " + shippingInfo.zip }}<br>
			{{ shippingInfo.country }}<br>
			<span v-if="shippingInfo.apt">Apt/Suite/Bld # {{ shippingInfo.apt }}</span>
		</div>

		<div class='CheckoutConfirm-contact'>
			<b>{{ shippingInfo.email }}</b>
			<div v-if="shippingInfo.phone">{{ shippingInfo.phone }}</div>
		</div>

		<br class='u-clear'>
		<div class='Button Button--active Button--thin u-width200' v-link="{ path: '/checkout/shipping' }">< Edit Shipping</div>

		<span v-if="billingInfo.seperate_billing">
			<hr>
			<h2>Billing Confirmation:</h2>
			<hr>

			<div class='CheckoutConfirm-shippingAddress'>
				<b>{{ billingInfo.first_name + " " + billingInfo.last_name }}
				<span v-if="billingInfo.company"> of {{ billingInfo.company }}</span></b><br>
				{{ billingInfo.street_address_first }}<br>
				<span v-if="billingInfo.street_address_second">{{ billingInfo.street_address_second }}<br></span>
				{{ billingInfo.city + " " + billingInfo.state + ", " + billingInfo.zip }}<br>
				{{ billingInfo.country }}<br>
				<span v-if="billingInfo.apt">Apt/Suite/Bld # {{ billingInfo.apt }}</span>
			</div>
		</span>

		<span v-if="shippingInfo.notes">
			<hr class='u-clear u-width300'>
			<h3>Notes:</h3>
			<hr class='u-clear u-width300'>
			{{ shippingInfo.notes }}<br><br>
		</span>
		<span v-else>
			<hr class='u-clear'><br>	
		</span>

		<div>
			<div id='prev' class='Button Button--active u-width200 u-floatLeft' @click='$parent.prevStep'>< Edit Billing</div>
			<div class="Button Button--dark u-width200 u-floatRight" v-if="processing"><i class="fa fa-cog fa-spin"></i> Submitting</div>
			<div id='submit' class='Button Button--active u-width200 u-floatRight' @click='submitCheckout' v-else><i class="fa fa-paper-plane"></i> Submit</div>
		</div>
	</div>
</template>

<script>
module.exports = {
	data () {
		if (localStorage.cart) {
			var cart = JSON.parse(localStorage.cart)
		} else {
			var cart = {}
		}

		return {
			cart: cart,
			processing: false,
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
		}
	},

	props: ['shippingInfo', 'billingInfo'],

	methods: {
		submitCheckout () {
			this.processing = true
			var shipping = Object.assign({}, this.shippingInfo)
			var billing = Object.assign({}, this.billingInfo)

			var request = {
				email: shipping.email,
				confirm_email: shipping.confirm_email,
				phone: shipping.phone,
				phone_preferred: shipping.phone_preferred,
				notes: shipping.notes,
				seperate_billing: billing.seperate_billing,
				billing_address: billing,
				shipping_address: shipping,
				cart: JSON.parse(localStorage.condensedCart)
			}
			
			this.$http.post('invoice', request).then(response => {
				delete localStorage.cart
				delete localStorage.cartExperation
				delete localStorage.condensedCart
				
				var info = require('../store/invoiceInfo.js')
				info.clear()

				this.$router.go({ path: '/checkout/success' })
			})
		}
	},
}
</script>