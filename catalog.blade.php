@extends('store.set.master')

@section('title', $catalog['name'])

@section('content')
	{{-- Header image, if it exists --}}

	<h1>{{ $catalog['name'] }}</h1>
	<p>{{ $catalog['description'] }}</p>

	<hr>
	<ul class="u-cols-3">
		<li v-for="tag in catalog.tags">
			<label for='${ tag }' class='Checkbox'>
				<input type='checkbox' id='${ tag }' checked @click='toggleTag(tag)'>
				<i class="fa fa-fw" :class="(selected.indexOf(tag) != -1)?'fa-check-square':'fa-square'"></i> ${ tag }
			</label>
		</li>
	</ul>
	<br>
	<ul class="u-cols-3">
		<li class="u-active" @click="fillTags">
			<i class="fa fa-fw fa-plus-square"></i> Select All
		</li>
		<li class="u-active" @click="clearTags">
			<i class="fa fa-fw fa-minus-square"></i> Select None
		</li>
	</ul>

	<hr>
	<i>
		Note: Shopping cart does not account for shipping. Once we receive your order, we will send you follow-up invoice that includes the calculated shipping amount. Thank you!
	</i>
	<hr>

	<div class="js-catalog" data-tags="${ selected.join(',') }"></div>
@endsection

@section('scripts')
<script>
Vue.config.delimiters = ['${', '}']
Vue.config.unsafeDelimiters = ['!{', '}']

var v = new Vue({
	el: '#Body-content',
	data: {
		catalog: {!! json_encode($catalog) !!},
		selected: {!! json_encode($catalog['tags']) !!}
	},

	watch: {
		selected: function() {
			console.log('catalog')
		}
	},

	methods: {
		fillTags: function() {
			this.selected = []
			for (var i = 0; i < this.catalog.tags.length; i++) {
				this.selected.push(this.catalog.tags[i])
			};
		},

		clearTags: function() {
			this.selected = []
		},

		toggleTag: function(tag) {
			var index = this.selected.indexOf(tag)
			if (index != -1) {
				this.selected.splice(index, 1)
			} else {
				this.selected.push(tag)
			}
		},
	}
})
</script>
@endsection