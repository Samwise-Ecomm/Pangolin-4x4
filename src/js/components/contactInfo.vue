<template>
	<div>
		<h2 v-if="shipping">Shipping Information:</h2>
		<h2 v-else>Billing Information:</h2>
		<hr>

		<div v-if="!shipping" 
			@click="info.seperate_billing = !info.seperate_billing">
			<i>Note: Once we receive your order, we will send you follow-up invoice that includes the calculated shipping amount.</i><br>
			<br>
			<span class="u-active">
				<i class="fa fa-fw" :class="info.seperate_billing?'fa-check-square':'fa-square'"></i> Seperate Shipping & Billing Address?
			</span>
			<hr v-if="info.seperate_billing">
		</div>

		<span v-if="shipping || !shipping && info.seperate_billing">
			<div class='js-formField'>
			    <div class='js-formLabel'>First Name:</div>
				<div class='js-formInput u-width300' :class="(selected == 'first_name')?'isSelected':''">
					<input type='text' name='firstName' maxlength='64' placeholder="Required"
						v-model='info.first_name' 
						@input="checkField('first_name')" 
						@focus="selected = 'first_name'"
						@blur="selected = ''">
				</div>
				<div class='js-formWarn' :class="(warn.indexOf('first_name') == -1)?'':'isShown'">First name is required.</div>
			</div>

			<div class='js-formField'>
			    <div class='js-formLabel'>Last Name:</div>
				<div class='js-formInput u-width300' :class="(selected == 'last_name')?'isSelected':''">
					<input type='text' name='lastName' maxlength='64' placeholder="Required"
						v-model='info.last_name' 
						@input="checkField('last_name')"
						@focus="selected = 'last_name'"
						@blur="selected = ''">
				</div>
				<div class='js-formWarn' :class="(warn.indexOf('last_name') == -1)?'':'isShown'">Last name is required</div>
			</div>

			<div class='js-formField'>
			    <div class='js-formLabel'>Company:</div>
				<div class='js-formInput u-width300' :class="(selected == 'company')?'isSelected':''">
					<input type='text' name='company' maxlength='64' 
						v-model='info.company'
						@focus="selected = 'company'"
						@blur="selected = ''">
				</div>
			</div>

			<div class='js-formField'>
				<div class='js-formLabel'>Country:</div>
				<div class='js-formInput u-width400' :class="(selected == 'country')?'isSelected':''">
					<select name="country" 
						v-model="info.country"
						@focus="selected = 'country'"
						@blur="selected = ''">
						<option 
							:value="country" v-for="country in returnCountries()">{{ country }}</option>
					</select>
				</div>
			</div>

			<div class='js-formField'>
				<div class='js-formLabel'>State / Province:</div>
				<div class='js-formInput u-width400' :class="(selected == 'state')?'isSelected':''">
					<select name="state" 
						v-model="info.state"
						@focus="selected = 'state'"
						@blur="selected = ''">
						<option :value="state" v-for="state in returnStates(info.country)">{{ state }}</option>
					</select>
				</div>
			</div>

			<div class='js-formField'>
			    <div class='js-formLabel'>Zip:</div>
				<div class='js-formInput u-width100' :class="(selected == 'zip')?'isSelected':''">
					<input type='text' name='zip' maxlength='32' placeholder="Required"
						v-model='info.zip' 
						@input="checkField('zip')"
						@focus="selected = 'zip'"
						@blur="selected = ''">
				</div>
				<div class='js-formWarn' :class="(warn.indexOf('zip') == -1)?'':'isShown'">Zip code is required.</div>
			</div>

			<div class='js-formField'>
			    <div class='js-formLabel'>City:</div>
				<div class='js-formInput u-width200' :class="(selected == 'city')?'isSelected':''">
					<input type='text' name='city' maxlength='64' placeholder="Required"
						v-model='info.city' 
						@input="checkField('city')"
						@focus="selected = 'city'"
						@blur="selected = ''">
				</div>
				<div class='js-formWarn' :class="(warn.indexOf('city') == -1)?'':'isShown'">City name is required.</div>
			</div>

			<div class='js-formField'>
			    <div class='js-formLabel'>Street Address:</div>
				<div class='js-formInput u-width400' :class="(selected == 'street')?'isSelected':''">
					<input type='text' name='streetFirst' maxlength='128' placeholder="Required"
						v-model='info.street' 
						@input="checkField('street')"
						@focus="selected = 'street'"
						@blur="selected = ''">
				</div>
				<div class='js-formWarn' :class="(warn.indexOf('street') == -1)?'':'isShown'">Street address is required.</div>
			</div>

			<div class='js-formField'>
			    <div class='js-formLabel'></div>
				<div class='js-formInput u-width400' :class="(selected == 'street_second')?'isSelected':''">
					<input type='text' name='streetSecond' maxlength='128' 
						v-model='info.street_second'
						@focus="selected = 'street_second'"
						@blur="selected = ''">
				</div>
			</div>

			<div class='js-formField'>
			    <div class='js-formLabel'>Apt / Suite / Bld #:</div>
				<div class='js-formInput u-width100' :class="(selected == 'apt')?'isSelected':''">
					<input type='text' name='apt' maxlength='32' 
						v-model='info.apt'
						@focus="selected = 'apt'"
						@blur="selected = ''">
				</div>
			</div>
		</span>

		<span v-if="shipping">
			<hr>
			<h2>Contact Information:</h2>
			<hr>

			<div class='js-formField'>
			    <div class='js-formLabel'>Phone:</div>
				<div class='js-formInput u-width200' :class="(selected == 'phone')?'isSelected':''">
					<input type='text' name='phone' maxlength='64' 
						v-model='info.phone'
						@focus="selected = 'phone'"
						@blur="selected = ''">
				</div>
			</div>

			<div class='js-formField'>
			    <div class='js-formLabel'>E-Mail Address:</div>
				<div class='js-formInput u-width300' :class="(selected == 'email')?'isSelected':''">
					<input type='text' name='eMail' maxlength='64' placeholder="Required"
						v-model='info.email' 
						@input="checkField('email')"
						@focus="selected = 'email'"
						@blur="selected = ''">
				</div>
				<div class='js-formWarn' :class="(warn.indexOf('email') == -1)?'':'isShown'">A valid E-Mail address is required.</div>
			</div>

			<div class='js-formField'>
			    <div class='js-formLabel'>Confirm E-Mail:</div>
				<div class='js-formInput u-width300' :class="(selected == 'confirm_email')?'isSelected':''">
					<input type='text' name='cMail' maxlength='64' placeholder="Required"
						v-model='info.confirm_email' 
						@input="checkField('confirm_email')"
						@focus="selected = 'confirm_email'"
						@blur="selected = ''">
				</div>
				<div class='js-formWarn' :class="(warn.indexOf('confirm_email') == -1)?'':'isShown'">Confirmation E-Mail must be identical to E-Mail.</div>
			</div>

			<hr>
			<h2>Notes:</h2>
			<hr>

			<textarea class='js-formTextArea' name='notes' maxlength='1024' placeholder='Notes...' v-model="info.notes"></textarea>
		</span>

		<hr>
		<div>
			<div class='Button Button--active u-width200 u-floatLeft' @click="$parent.prevStep">Prev</div>
			<div class='Button Button--active u-width200 u-floatRight' @click="submit">Next</div>
		</div>
	</div>
</template>

<script>
module.exports = {
  data() {
    return {
      warn: [],
      selected: ""
    }
  },

  props: ["shipping", "info"],

  methods: {
    submit() {
      if (this.checkFields()) {
        this.$parent.nextStep()
      }
    },

    checkFields() {
      if (!this.shipping && !this.info.seperate_billing) {
        return true
      }

      var valid = true

      this.warn = []
      var requiredFields = ["first_name", "last_name", "zip", "city", "street"]
      requiredFields.forEach(
        function(field) {
          if (this.info[field] == "") {
            this.warn.push(field)
            valid = false
          }
        }.bind(this)
      )

      if (this.shipping) {
        if (!/\S+@\S+\.\S+/.test(this.info.email)) {
          this.warn.push("email")
          valid = false
        } else if (this.info.email != this.info.confirm_email) {
          this.warn.push("confirm_email")
          valid = false
        }
      }

      if (valid) {
        if (this.shipping) {
          sessionStorage.shippingInfo = JSON.stringify(this.info)
        } else {
          sessionStorage.billingInfo = JSON.stringify(this.info)
        }
      }
      return valid
    },

    checkField(field) {
      if (field == "email") {
        if (
          this.warn.indexOf("email") != -1 &&
          /\S+@\S+\.\S+/.test(this.info.email)
        ) {
          this.warn.$remove("email")
          return 1
        }
      } else if (field == "confirm_email") {
        if (
          this.warn.indexOf("confirm_email") != -1 &&
          this.info.email == this.info.confirm_email
        ) {
          this.warn.$remove("confirm_email")
          return 1
        }
      } else {
        if (this.warn.indexOf(field) != -1 && this.info[field] != "") {
          this.warn.$remove(field)
          return 1
        }
      }

      return 0
    },

    returnCountries() {
      var geoInfo = require("../store/geoInfo.js")
      return Object.keys(geoInfo)
    },

    returnStates(country) {
      var geoInfo = require("../store/geoInfo.js")
      if (geoInfo[country].length == 0) {
        this.info.state = country
        return [country]
      } else {
        if (country == "United States") {
          if (geoInfo[country].indexOf(this.info.state) == -1) {
            this.info.state = "Oregon"
          }
          return geoInfo[country]
        } else {
          if (geoInfo[country].indexOf(this.info.state) == -1) {
            this.info.state = geoInfo[country][0]
          }
          return geoInfo[country]
        }
      }
    }
  }
}
</script>