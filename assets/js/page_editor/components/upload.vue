<template>
	<div class="upload-mask" v-show="show" transition="upload">
    <div class="upload-wrapper">
      <div class="upload-container">

        <div class="upload-header">
          <i class="fa fa-upload"></i> Image Upload<br>
          <i class="u-thin">Select image below to insert.</i>
        </div>
        
        <div class="upload-body">
          <ul>
          	<li v-for="image in images">
          		[<span class="fa fa-minus fa-sm u-active"></span>]
          		&nbsp;<span class="u-active" @click="insertImage(image)">${ image }</span>
          	</li>
          	<li>
							<label for="uploader">
								<span class="u-active">[<span class="fa fa-plus"></span>] Upload new picture</span>
							</label>
							<input type="file" name="img" accept="image/bmp,image/gif,image/jpeg,image/png" id="uploader" class="u-hide">
          	</li>
          </ul>
        </div>

        <div class="upload-footer">
          <slot name="footer">
            <div class="Button Button--thin Button--dark"
							@click='show = false'>
							Cancel</div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
	module.exports = {
		data: function() {
			return {
				images: [
					'foo', 'bar', 'baz'
				]
			}
		},
	  props: {
	    show: {
	      type: Boolean,
	      required: true,
	      twoWay: true    
	    }
	  },
	  methods: {
	  	insertImage: function(image) {
	  		console.log(image)
	  	}
	  }
	}
</script>