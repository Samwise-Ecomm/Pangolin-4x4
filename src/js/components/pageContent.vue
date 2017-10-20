<template>
	<div>Loading</div>
</template>

<script>
export default {
  created() {
    this.$options.template = "<div>Loading</div>"
    this.$options.template = this.temp
    console.log("here")
  },
  props: ["temp"],

  components: {
    catalog: require("./catalog.vue")
  },

  route: {
    canReuse() {
      console.log("here")
      return false
    }
  }
}
</script>