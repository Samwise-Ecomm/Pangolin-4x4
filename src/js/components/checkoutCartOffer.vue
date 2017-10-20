<template>
<section>
	<div class='CheckoutCart-item'>
		<div class='CheckoutCart-pic'><img :src="`/img/${offer.thumb}`"></div>
		<div class='CheckoutCart-desc'>
			<div class='CheckoutCart-title'><h1>{{ offer.name }}</h1></div>
			<div class='CheckoutCart-partNum'></div>
			<item :item="item" v-for="item in offer.items"></item>
		</div>
	</div>

	<hr class='inCheckoutCart' v-if="item != lastItem">
	<b v-else>
		<hr class='inCheckoutCart'>
	</b>
</section>
</template>

<script>
module.exports = {
	props: ['offer', 'offerId', 'lastOfferId'],

	components: {
		item: require('./CheckoutCartOfferItem.vue')
	}
}
</script>
