<template>
	<section id="SideNav-search">
		<ul v-if="focused">
			<li v-for="result in results" :class="(selected == $index)?'u-light':''">
				<a @click='find(result)'><small>{{{ result.name }}}</small><br>
				<!-- <small class="u-thin" v-if="result.part_numbers">Part #{{ result.part_numbers.split(',').join(', #') }}</small></a> -->
			</li>
		</ul>
	</section>
</template>

<script>
export default {
  data() {
    return {
      focused: false,
      selected: 0,
      results: [],
      searching: false
    }
  },

  computed: {
    icon() {
      return this.$root.$refs.searchIcon
    }
  },

  props: ["query"],

  watch: {
    query() {
      if (this.query.length > 2) {
        this.$http.get("offers", { _query: this.query }).then(
          response => {
            console.log(response)
            ga("send", "event", "search", `Q: ${this.query}`)

            this.$set("results", response.data.body)
            this.selected = 0
            this.searching = false

            if (this.results.length > 0) {
              this.icon.check()
            } else {
              this.icon.fail()
            }
          },
          () => {
            this.icon.fail()
          }
        )
      } else {
        // length is less than 3
        this.results = []
        this.icon.reset()
      }
    }
  },

  events: {
    searchEvent(data) {
      if (data.key == "Down") {
        this.selected++
        if (this.selected >= this.results.length) {
          this.selected = 0
        }
      } else if (data.key == "Up") {
        this.selected--
        if (this.selected < 0) {
          this.selected = this.results.length - 1
        }
      } else if (data.key == "Enter") {
        if (!this.searching) {
          this.find(this.results[this.selected])
        }
      }
    },

    searchFocus() {
      this.focused = true
    },

    searchBlurred() {
      setTimeout(
        function() {
          this.focused = false
        }.bind(this),
        1000
      )
    }
  },

  methods: {
    find(result) {
      ga("send", "event", "search", `Found: ${result.name}`)
      this.$router.go({ path: `/item/${result.id}` })
    }
  }
}
</script>
