<template>
<section>
	<span>
		<offer :offer="offer" :offer-id="offerId" :last-offer-id="lastOfferId" v-for="(offerId, offer) in cart"></offer>

		<div class='Subtotal-container' data-subtotal='<?=$subtotal?>'>
			<div class='Subtotal-label'><h4>Subtotal: </h4></div>
			<div id='Subtotal-total'><h1>{{ subTotal / 100 | currency }}</h1></div>
		</div>

		<hr>
		<div>
			<a v-link="{ path: '/home' }"><div class='Button Button--active u-width200 u-floatLeft'>Continue Shopping</div></a>
			<div class='Button Button--active u-width200 u-floatRight' @click="submitCheckout">Next</div>
		</div>
	</span>
</section>
</template>

<script>
export default {
  data() {
    return {
      cart: {}
    }
  },

  ready() {
    this.restoreCart()
  },

  computed: {
    subTotal() {
      var subTotal = 0
      for (var offerId in this.cart) {
        for (var itemId in this.cart[offerId].items) {
          var item = this.cart[offerId].items[itemId]
          subTotal += item.count * item.price
        }
      }
      return subTotal
    },

    lastOfferId() {
      if (this.cart) {
        return Object.keys(this.cart)[Object.keys(this.cart).length - 1]
      } else {
        return null
      }
    }
  },

  components: {
    offer: require("./checkoutCartOffer.vue")
  },

  methods: {
    storeCart() {
      localStorage.cartExperation = Date.now() + 1000 * 60 * 60 * 24
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
      if (
        localStorage.cartExperation &&
        Date.now() > localStorage.cartExperation
      ) {
        delete localStorage.cart
        delete localStorage.cartExperation
        delete localStorage.condensedCart
      }

      if (localStorage.cart) {
        this.$set("cart", JSON.parse(localStorage.cart))
      } else {
        this.$set("cart", {})
      }
    },

    clearCart() {
      var Vue = require("vue")

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

    submitCheckout() {
      this.clearCart()
      this.$parent.nextStep()
    }
  }
}
</script>