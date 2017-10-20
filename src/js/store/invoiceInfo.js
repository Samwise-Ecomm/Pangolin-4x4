module.exports = {
	shippingInfo: {
		first_name: "",
		last_name: "",
		company: "",
		country: "United States",
		state: "Oregon",
		zip: "",
		city: "",
		street: "",
		street_second: "",
		apt: "",
		email: "",
		confirm_email: "",
		phone: "",
		phone_preferred: false,
		notes: "",
	},
	billingInfo: {
		seperate_billing: false,
		first_name: "",
		last_name: "",
		company: "",
		country: "United States",
		state: "Oregon",
		zip: "",
		city: "",
		street: "",
		street_second: "",
		apt: "",
	},

	load () {
		if (sessionStorage.shippingInfo) {
			this.shippingInfo = JSON.parse(sessionStorage.shippingInfo)
		}
		if (sessionStorage.billingInfo) {
			this.billingInfo = JSON.parse(sessionStorage.billingInfo)
		}
	},

	clear () {
		this.shippingInfo = {
			first_name: "",
			last_name: "",
			company: "",
			country: "United States",
			state: "Oregon",
			zip: "",
			city: "",
			street: "",
			street_second: "",
			apt: "",
			email: "",
			confirm_email: "",
			phone: "",
			phone_preferred: false,
			notes: "",
		}

		this.billingInfo = {
			seperate_billing: false,
			first_name: "",
			last_name: "",
			company: "",
			country: "United States",
			state: "Oregon",
			zip: "",
			city: "",
			street: "",
			street_second: "",
			apt: "",
		}

		sessionStorage.removeItem('shippingInfo')
		sessionStorage.removeItem('billingInfo')
	}
}
