<template>
	<i class="fa" :class="activeIcons.join(' ')"></i>
</template>

<script>
export default {
  data() {
    return {
      activeIcons: [this.icon]
    }
  },

  props: ["icon"],

  methods: {
    working() {
      this.activeIcons = ["fa-cog", "fa-spin"]
    },

    reset() {
      this.activeIcons = [this.icon]
    },

    check() {
      this.activeIcons = ["fa-check"]

      setTimeout(
        function() {
          this.activeIcons = [this.icon]
        }.bind(this),
        1000
      )
    },

    fail() {
      this.activeIcons = ["fa-times"]

      setTimeout(
        function() {
          this.activeIcons = [this.icon]
        }.bind(this),
        1000
      )
    }
  }
}
</script>