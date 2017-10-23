<template>
<div class="row" v-if="loaded">
	<div id="Title">
		<h1>{{ offer.name }}</h1>
		<h4 v-if="partNumbers.length > 0">Part #{{ partNumbers.join(', #') }}</h4>
		<hr>

		<i class="u-center">
			Note: Shopping cart does not account for shipping. Once we receive your order, we will send you follow-up invoice that includes the calculated shipping amount. Thank you!
		</i>
		<hr>
	</div>

	<div id="Pictures" v-if="offer.pictures.length > 0">
		<!-- Lightbox links and selected picture img -->
		<a v-for="picture in offer.pictures" :href="`/img/${picture.source.lg}`" id='js-currentPicLink' data-lightbox="pic">
			<img :src="`/img/${picture.source.md}`" id='Pictures-current' class="u-activeImg" v-if="picture.selected">
		</a>

		<!-- Thumbs to set selected picture -->
		<img v-for="picture in offer.pictures" class="u-activeImg Pictures-thumb"
			:src="`/img/${picture.source.sm}`"
			:class="($index % 3 == 0)?'isLeft':($index % 3 == 1)?'':'isRight'"
			@click="selectPic($index)">
	</div>

	<div id="Pictures" v-else>
		<a id="js-currentPicLink" href="/img/inventory/def.jpg" data-lightbox="pic">
			<img src="/img/inventory/def.jpg" id="Pictures-current" class="u-activeImg">
		</a>
	</div>

	<div id="Information">
		<h5>{{ offer.name }}</h5>
		<br>
		<p>
			{{{ offer.description | nl2br }}}
			<br><br>
			<span v-if="partNumbers.length > 0">Part #{{ partNumbers.join(', #') }}.</span>
			<span v-if="ssPartNumbers.length > 0">Supersedes Part #{{ ssPartNumbers.join(', #') }}.</span>
		</p>
	</div>

	<div id="Variations">
		<table id='VariationsTable'>
			<tr v-for="item in offer.items">
				<td>{{ item.name }}</td>
				<td class="VariationsTable-price"><b>
					{{ item.price / 100 | currency }}
					<span v-if="item.unit != 'Unit'" class='u-thin'> / {{ item.unit }}</span>
				</b></td>
				<td class="VariationsTable-button">
					<add-to-cart class="inVariations u-floatRight"
						:item="item"
						:thumb="(offer.pictures.length > 0)?offer.pictures[0].source.sm:'/img/inventory/def.jpg'"
						:part-numbers="partNumbers">
					</add-to-cart>
				</td>
			</tr>
		</table>

		<hr class="u-clear u-paddingTop">
	</div>

	<div id="Applications">
		<div v-if="offer.other_applications">
			<h2>Other Applications:</h2><br>
			<ul>
				<li v-for="application in offer.other_applications.split(',')">{{ application }}</li>
			</ul>
		</div>
	</div>
</div>
</template>

<script>
export default {
  data() {
    return {
      offer: {},
      loaded: false
    }
  },

  components: {
    addToCart: require("../components/addToCart.vue")
  },

  computed: {
    partNumbers() {
      var numbers = []
      for (var i = 0; i < this.offer.items.length; i++) {
        if (this.offer.items[i]["part_number"] == "") {
          continue
        }

        var item_numbers = this.offer.items[i]["part_number"].split(",")

        for (var j = 0; j < item_numbers.length; j++) {
          item_numbers[j] = item_numbers[j].trim()

          if (!numbers.includes(item_numbers[j])) {
            numbers.push(item_numbers[j])
          }
        }
      }

      return numbers
    },

    ssPartNumbers() {
      var numbers = []
      for (var i = 0; i < this.offer.items.length; i++) {
        if (this.offer.items[i]["ss_part_number"] == "") {
          continue
        }

        var item_numbers = this.offer.items[i]["ss_part_number"].split(",")

        for (var j = 0; j < item_numbers.length; j++) {
          item_numbers[j] = item_numbers[j].trim()

          if (!numbers.includes(item_numbers[j])) {
            numbers.push(item_numbers[j])
          }
        }
      }

      return numbers
    }
  },

  route: {
    data() {
      this.getOffer()
    }
  },

  methods: {
    getOffer() {
      this.$http
        .get(`/public-api/offer/${this.$route.params.id}`)
        .then(response => {
          this.$set("offer", response.data)
          for (var i = 0; i < this.offer.pictures.length; i++) {
            this.$set(`offer.pictures[${i}].selected`, false)
          }
          this.selectPic(0)
          document.title = "Pangolin 4x4: " + this.offer.name

          this.loaded = true
        })
    },

    selectPic(index) {
      if (this.offer.pictures.length == 0) {
        return
      }

      for (var i = 0; i < this.offer.pictures.length; i++) {
        this.offer.pictures[i].selected = false
      }
      this.offer.pictures[index].selected = true
    }
  }
}
</script>
