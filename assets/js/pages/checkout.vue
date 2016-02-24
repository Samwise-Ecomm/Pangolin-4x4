<template>
	<div class="row" v-if="loaded">
		<form id='form' method='post'>
			<input type='hidden' name='stage' id='js-stage' value='<?=$stage?>'>

			<ol id='Checkout-progressBar' data-steps='4'>
				<li :class="(step == 0)?'ProgressBar-current':(step > 0)?'ProgressBar-done':'ProgressBar-todo'">
					<i class='fa fa-shopping-cart'></i> Cart Confirmation
				</li>
				<li :class="(step == 1)?'ProgressBar-current':(step > 1)?'ProgressBar-done':'ProgressBar-todo'">
					<i class='fa fa-truck'></i> Shipping Info
				</li>
				<li :class="(step == 2)?'ProgressBar-current':(step > 2)?'ProgressBar-done':'ProgressBar-todo'">
					<i class='fa fa-credit-card'></i> Billing Info
				</li>
				<li :class="(step == 3)?'ProgressBar-current':(step > 3)?'ProgressBar-done':'ProgressBar-todo'">
					<i class='fa fa-pencil-square-o'></i> Submit Order
				</li>
			</ol>

			<div v-if="errors.length > 0" class="Checkout-errorList">
				<span v-for="error in errors"> - {{ error }}<br></span>
			</div>
			<hr>

			<cart 
				v-if="step == 0" 
				:checkout="true">
			</cart>
			<contact-info 
				v-if="step == 1" 
				:shipping="true"
				:info.sync="shippingInfo">
			</contact-info>
			<contact-info 
				v-if="step == 2" 
				:shipping="false"
				:info.sync="billingInfo">
			</contact-info>
			<submit-checkout 
				v-if="step == 3"
				:shipping-info="shippingInfo"
				:billing-info="billingInfo">
			</submit-checkout>
			<div v-if="step == 4">
				<h1>Thank you for your order!</h1>
				<h4>We will calculate shipping and send the full bill to you as soon as possible.</h4>
				<hr>
				<p>If you have any questions call us at <span class="u-highlight">(541) 606-0095</span>&nbsp;
				or Email us at <span class="u-highlight">Info@Pangolin4x4.com</span>.</p>
				<br>
				<div class="Button Button--active Button--thin u-width400" v-link="{ path: '/home' }">Return Home</div>
			</div>
		</form>
	</div>
</template>

<script>
module.exports = {
	data () {
		var store = require('../store/invoiceInfo.js')
		store.load()

		return {
			step: 0,
			loaded: false,
			shippingInfo: store.shippingInfo,
			billingInfo: store.billingInfo,
			errors: [],
		}
	},

	components: {
		cart: require('../components/cart.vue'),
		contactInfo: require('../components/contactInfo.vue'),
		submitCheckout: require('../components/submitCheckout.vue'),
	},

	route: {
		data() {
			switch(this.$route.params.step) {
				case 'cart':
					this.step = 0
					break
				case 'shipping':
					this.step = 1
					break
				case 'billing':
					this.step = 2
					break
				case 'submit':
					this.step = 3
					break
				case 'success':
					this.step = 4
					break
				default:
					this.step = 0
			}

			this.$parent.search = false
			this.loaded = false
			this.errors = []

			// check the cart against the server to make sure everything is still in stock
			this.$http.post('/api/test/cart', { cart: this.returnCartCount() }).then(function(response) {
				for (var i = 0; i < response.data.length; i++) {
					var cart = JSON.parse(sessionStorage.cart)
					var error = response.data[i]
					if (error.error == 'count_changed') {
						// throw an error for the user
						var item = cart[error.item_id]
						if (item.variants[error.variant_id].name) {
							var variantName = ' (' + item.variants[error.variant_id].name + ')'
						} else {
							var variantName = ''
						}

						if (error.count == 0) {
							this.errors.push('"' + item.name + variantName +'" has been sold out and because of this it has been removed from your cart, we apologize for the inconveniance. ')
						} else {
							this.errors.push('The stock on "' + item.name + variantName +'" has been reduced, most likely due to a purchase since you added it to your cart. The amount in your cart has been reduced to ' + error.count + ' to reflect this change. We are sorry for the inconveniance.')
						}
						
						cart[error.item_id].variants[error.variant_id].count = error.count
						cart[error.item_id].variants[error.variant_id].stock = error.count
					} else if (error.error == "stock_changed") {
						cart[error.item_id].variants[error.variant_id].stock = error['stock']
					}
				}

				if (response.data.length > 0) {
					sessionStorage.cart = JSON.stringify(cart)
				}

				document.title = "Pangolin 4x4 Checkout"
				this.loaded = true
			})
		},
	},

	methods: {
		nextStep() {
			if (this.step == 0) {
				this.$router.go({ path: '/checkout/shipping' })	
			} else if (this.step == 1) {
				this.$router.go({ path: '/checkout/billing' })
			} else if (this.step == 2) {
				this.$router.go({ path: '/checkout/submit' })
			}
		},

		prevStep() {
			if (this.step == 1) {
				this.$router.go({ path: '/checkout/cart' })	
			} else if (this.step == 2) {
				this.$router.go({ path: '/checkout/shipping' })
			} else if (this.step == 3) {
				this.$router.go({ path: '/checkout/billing' })
			}
		},

		returnCartCount() {
			var request = []
			if (sessionStorage.cart) {
				var cart = JSON.parse(sessionStorage.cart)
			} else {
				var cart = {}
			}
			
			for (var itemId in cart) {
				for (var variantId in cart[itemId].variants) {
					var variant = cart[itemId].variants[variantId]
					request.push({ variant_id: variantId, count: variant.count, stock: variant.stock })
				}
			}

			return request
		}
	},
}
</script>