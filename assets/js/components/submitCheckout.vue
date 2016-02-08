<template>
	<div>
		<h2>Order Confirmation:</h2>
		<hr>

		<div class='CheckoutConfirm-item' v-for="item in cart">
			<div class='CheckoutConfirm-title'>{{{ item.name }}}</div>
			<div class='CheckoutConfirm-itemNum' v-if="item.part_number">Part #{{ item.part_number.split(',').join(', #') }}</div>

			<span v-for="variant in item.variants">
				<div class='CheckoutConfirm-price'>{{ variant.price | currency }} * {{ variant.count }}</div>
				<div class='CheckoutConfirm-variant u-thin' v-if="variant.name">{{{ variant.name }}} -&nbsp;</div>
			</span>

			<hr>
		</div>

		<div class='CheckoutConfirm-subContainer'>
			<div class='Button Button--active Button--thin u-width200 u-floatLeft'  v-link="{ path: '/checkout/cart' }">< Edit Cart</div>
			<div class='CheckoutConfirm-subTotal'>{{ subTotal | currency }}</div>
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
			<div id='submit' class='Button Button--active u-width200 u-floatRight' @click='submitCheckout'>Submit</div>
		</div>
	</div>
</template>

<script>
module.exports = {
	data () {
		if (sessionStorage.cart) {
			var cart = JSON.parse(sessionStorage.cart)
		} else {
			var cart = {}
		}

		return {
			cart: cart
		}
	},

	computed: {
		subTotal () {
			var subTotal = 0
			for (var itemId in this.cart) {
				for (var variantId in this.cart[itemId].variants) {
					subTotal += this.cart[itemId].variants[variantId].count * this.cart[itemId].variants[variantId].price
				}
			}

			return subTotal
		}
	},

	props: ['shippingInfo', 'billingInfo'],

	methods: {
		submitCheckout () {
			var request = Object.assign({}, this.shippingInfo)
			var billing = Object.assign({}, this.billingInfo)
			for (var field in billing) {
				if (field != 'seperate_billing') {
					request['billing_'+field] = billing[field]	
				} else {
					request[field] = billing[field]
				}
			}
			request['cart'] = this.$parent.returnCartCount()

			this.$http.post('/api/submit/invoice', request).catch(function(response) {
				if (response.status == 422) {
					for (var errorField in response.data) {
						this.$parent.errors.push(response.data[errorField])
					}
				}
			}).then(function(response) {
				if (response.data == 'success') {
					// WOO, We did it!
					sessionStorage.removeItem('cart')
					var info = require('../store/invoiceInfo.js')
					info.clear()

					this.$router.go({ path: '/checkout/success' })
				}
			})
		}
	},
}
</script>