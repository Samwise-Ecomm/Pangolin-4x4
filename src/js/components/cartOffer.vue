<template>
<div class="Cart-item">
	<small><b><a v-link="{ path: `/item/${offerId}` }">{{ offer.name }}</a></b></small>
	<item :item="item" v-for="item in offer.items"></item>
	<hr class="u-clear" v-if="offerId != lastOfferId">
	<span class="u-clear" v-else></span>
</div>
</template>

<script>
export default {
  props: ["offer", "offerId", "lastOfferId"],

  components: {
    item: require("./cartOfferItem.vue")
  }
}
</script>