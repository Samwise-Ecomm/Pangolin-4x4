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

			<checkout-cart 
				v-if="step == 0" 
				:checkout="true">
			</checkout-cart>
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
  data() {
    var store = require("../store/invoiceInfo.js")
    store.load()

    return {
      step: 0,
      loaded: false,
      shippingInfo: store.shippingInfo,
      billingInfo: store.billingInfo,
      errors: []
    }
  },

  components: {
    checkoutCart: require("../components/checkoutCart.vue"),
    contactInfo: require("../components/contactInfo.vue"),
    submitCheckout: require("../components/submitCheckout.vue")
  },

  route: {
    data() {
      switch (this.$route.params.step) {
        case "cart":
          this.step = 0
          break
        case "shipping":
          this.step = 1
          break
        case "billing":
          this.step = 2
          break
        case "submit":
          this.step = 3
          break
        case "success":
          this.step = 4
          break
        default:
          this.step = 0
      }

      this.$parent.search = false
      document.title = "Pangolin 4x4 Checkout"
      this.loaded = true
    }
  },

  methods: {
    nextStep() {
      if (this.step == 0) {
        this.$router.go({ path: "/checkout/shipping" })
      } else if (this.step == 1) {
        this.$router.go({ path: "/checkout/billing" })
      } else if (this.step == 2) {
        this.$router.go({ path: "/checkout/submit" })
      }
    },

    prevStep() {
      if (this.step == 1) {
        this.$router.go({ path: "/checkout/cart" })
      } else if (this.step == 2) {
        this.$router.go({ path: "/checkout/shipping" })
      } else if (this.step == 3) {
        this.$router.go({ path: "/checkout/billing" })
      }
    }
  }
}
</script>