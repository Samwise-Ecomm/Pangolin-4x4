<template>
	<section>
		<span v-if="checkout">
			<section v-for="(itemId, item) in cart">
				<div class='CheckoutCart-item'>
					<div class='CheckoutCart-pic'><img :src="'/img/'+item.images.small[0]"></div>
					<div class='CheckoutCart-desc'>
						<div class='CheckoutCart-title'><h1>{{ item.name }}</h1></div>
						<div class='CheckoutCart-partNum'><h4 v-if="item.part_number">Part #{{ item.part_number.split(',').join(', #') }}</h4></div>
						<div class='CheckoutCart-variant' v-for="variant in item.variants">
							<div class='CheckoutCart-varTitle'><h4 v-if="variant.name">{{{ variant.name }}} -&nbsp;</h4></div>
							<div class='CheckoutCart-price'>
								<h4>{{ variant.price | currency }}<span v-if="variant.unit != 'Unit'"> / {{ variant.unit }}</span></h4>
							</div>
							<div class='CheckoutCart-counter'>
								<div class='CheckoutCart-minus'>
									<i class='fa fa-fw' 
										:class="(variant.count > 0)?'fa-minus-square u-active':'fa-minus-square-o'"
										@click="changeCount(variant, -1)"></i>
								</div>
								<div class='CheckoutCart-cnt'>
									<input type='text' maxlength=4 
										v-model="variant.count"
										@keydown="checkKey"
										@input="checkCount(variant)">
								</div>
								<div class='CheckoutCart-plus'>
									<i class='fa fa-fw' 
										:class="(variant.infinite || variant.count < variant.stock)?'fa-plus-square u-active':'fa-plus-square-o'"
										@click="changeCount(variant, 1)"></i>
								</div>
							</div>
						</div>
					</div>
				</div>

				<hr class='inCheckoutCart' v-if="item != lastItem">
				<b v-else>
					<hr class='inCheckoutCart'>
				</b>
			</section>

			<div class='Subtotal-container' data-subtotal='<?=$subtotal?>'>
				<div class='Subtotal-label'><h4>Subtotal: </h4></div>
				<div id='Subtotal-total'><h1>{{ subTotal | currency }}</h1></div>
			</div>

			<hr>
			<div>
				<a v-link="{ path: '/home' }"><div class='Button Button--active u-width200 u-floatLeft'>< Continue Shopping</div></a>
				<div class='Button Button--active u-width200 u-floatRight' @click="submitCheckout">Next ></div>
			</div>
		</span>

		<span v-else>
			<div id="Cart" v-if="show">
				<div id='Cart-head'>Cart</div>
				<div class='Cart-item' v-for="(itemId, item) in cart">
					<small><b><a v-link="{ path: '/item/'+itemId }">{{ item.name }}</a></b></small><br>
					<div v-for="(variantId, variant) in item.variants">
						<small class="u-thin">{{{ variant.name }}}</small><br v-if="variant.name">
						<small>{{ variant.price | currency }} <span v-if="variant.unit != 'Unit'">/ {{ variant.unit }}</span></small>
						<span class="u-floatRight">
							<i class="fa fa-fw" 
								:class="(variant.count > 0)?'fa-minus-square u-active':'fa-minus-square-o'"
								@click="changeCount(variant, -1)"></i>
							{{ variant.count }}
							<i class="fa fa-fw" 
								:class="(variant.infinite || variant.count < variant.stock)?'fa-plus-square u-active':'fa-plus-square-o'"
								@click="changeCount(variant, 1)"></i>
						</span>
					</div>
					<hr class="u-clear" v-if="itemId != lastObject">
					<span class="u-clear" v-else></span>
				</div>
				<a v-link="{ path: '/checkout/cart' }">
					<div id='Cart-foot' class='u-active'>
						<b>Subtotal:</b> {{ subTotal | currency }}<b class='u-floatRight'>Checkout</b>
					</div>
				</a>
			</div>
		</span>
	</section>
</template>

<script>
module.exports = {
	data () {
		return {
			cart: {},
			show: false
		}
	},

	props: ['checkout'],

	created () {
		this.clearCart()
		this.restoreCart()
	},

	watch: {
		cart () {
			this.setAddToCartButtons()
		}
	},

	computed: {
		lastObject () {
			if (this.cart) {
				return Object.keys(this.cart)[Object.keys(this.cart).length - 1]	
			} else {
				return null
			}
		},

		subTotal () {
			var subTotal = 0
			for (var itemId in this.cart) {
				for (var variantId in this.cart[itemId].variants) {
					subTotal += this.cart[itemId].variants[variantId].count * this.cart[itemId].variants[variantId].price
				}
			}

			return subTotal
		},
	},

	methods: {
		addToCart (cartItem, itemId, variantId) {
			var cart = {}
			if (sessionStorage.cart) {
				cart = JSON.parse(sessionStorage.cart)
			}

			if(cart[itemId]) {
				if (cart[itemId].variants[variantId]) {
					cart[itemId].variants[variantId].count += cartItem.variants[variantId].count

					var variant = cart[itemId].variants[variantId]
					if (!variant.infinite && variant.count > variant.stock ) {
						cart[itemId].variants[variantId].count = variant.stock
					}
				} else {
					cart[itemId].variants[variantId] = cartItem.variants[variantId]
				}
			} else {
				cart[itemId] = cartItem
			}

			this.storeCart(cart)
		},

		storeCart(cart) {
			sessionStorage.cart = JSON.stringify(cart)
			this.restoreCart()
		},

		restoreCart() {
			if (sessionStorage.cart) {
				this.show = true
				this.$set('cart', JSON.parse(sessionStorage.cart))
			} else {
				this.show = false
				return {}
			}
		},

		clearCart() {
			if (!sessionStorage.cart) {
				return 0
			}
			
 			var cart = JSON.parse(sessionStorage.cart)
			for (var itemId in cart) {
				for (var variantId in cart[itemId].variants) {
					if (cart[itemId].variants[variantId].count == 0) {
						delete cart[itemId].variants[variantId]
					}
				}
				if (Object.keys(cart[itemId].variants).length == 0) {
					delete (cart[itemId])
				}
			}
			if (Object.keys(cart).length == 0) {
				sessionStorage.removeItem('cart')
			} else {
				sessionStorage.cart = JSON.stringify(cart)	
			}
		},

		changeCount(variant, change) {
			variant.count = parseInt(variant.count) + change
			if (variant.count < 0) {
				variant.count = 0
			}
			if (!variant.infinite && variant.count > variant.stock) {
				variant.count = variant.stock
			}

			this.storeCart(Object.assign({}, this.cart))
		},

		setAddToCartButtons() {
			for (var itemId in this.cart) {
				for (var variantId in this.cart[itemId].variants) {
					var variant = this.cart[itemId].variants[variantId]
					if (variant.count == 0) {
						$('.js-addToCart[variant-id=' + variantId + ']').removeClass('isDisabled')
						$('.js-addToCart[variant-id=' + variantId + ']').addClass('Button--active')
						$('.js-addToCart[variant-id=' + variantId + ']').html('<i class="fa fa-cart-plus"></i> Add to Cart')
					} else if (!variant.infinite && variant.count >= variant.stock) {
						$('.js-addToCart[variant-id=' + variantId + ']').removeClass('Button--active')
						$('.js-addToCart[variant-id=' + variantId + ']').addClass('isDisabled')
						$('.js-addToCart[variant-id=' + variantId + ']').html('All in Cart (' + variant.count + ')')
					} else {
						$('.js-addToCart[variant-id=' + variantId + ']').removeClass('isDisabled')
						$('.js-addToCart[variant-id=' + variantId + ']').addClass('Button--active')
						$('.js-addToCart[variant-id=' + variantId + ']').html('<i class="fa fa-cart-plus"></i> ' + variant.count + ' in Cart')
					} 
				}
			}
		},

		returnCount(itemId, variantId) {
			if (cart[itemId] == undefined) {
				return 0
			}

			if (cart[itemId].variants[variantId] == undefined) {
				return 0
			}

			return cart[itemId].variants[variantId].count
		},

		checkKey(event) {
			if (event.keyCode == 8) {
				return 0
			} else if (event.keyCode < 48 || 57 < event.keyCode) {
				event.preventDefault()
			}
		},

		checkCount(variant) {
			if (variant.count < 0) {
				variant.count = 0
			} else if (!variant.infinite && variant.count > variant.stock) {
				variant.count = variant.stock
			}

			this.storeCart(Object.assign({}, this.cart))
		},

		submitCheckout() {
			this.clearCart()
			this.$parent.nextStep()
		}
	}
}
</script>