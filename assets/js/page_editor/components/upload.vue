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
          		[<span class="fa fa-minus fa-sm u-active" @click="deleteImage(image)"></span>]
          		<span class="u-active" @click="insertImage(image)">{{ image }}</span>
          	</li>
          	<li>
							<label for="uploader">
								<span class="u-active">[<span class="fa fa-plus"></span>] Upload new Image</span>
							</label>
							<input type="file" name="img" accept="image/bmp,image/gif,image/jpeg,image/png" id="uploader" class="u-hide" 
								@change="upload"
								v-el:uploader>
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

<style>
.upload-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.upload-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.upload-container {
  width: 600px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
}

.upload-header h3 {
  margin-top: 0;
  color: #42b983;
}

.upload-body {
  margin: 20px 0;
}

.upload-default-button {
  float: right;
}

.upload-enter, .upload-leave {
  opacity: 0;
}

.upload-enter .upload-container,
.upload-leave .upload-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

<script>
	module.exports = {
		data: function() {
			this.getImages()
			return {
				images: []
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
	  	getImages () {
	  		this.$http.get('/admin/upload').then(function(response) {
	  			this.$set('images',response.data)
	  		})
	  	},

	  	deleteImage (image) {
	  		this.$http.delete('/admin/upload', { image: image }).then(function(response) {
	  			this.getImages()
	  		})
	  	},

	  	insertImage (image) {
	  		this.$dispatch('insert', '/img/uploads/'+image)
	  		this.show = false
	  	},

	  	upload () {
	  		var request = new FormData()
      	request.append('uploader', this.$els.uploader.files[0])

      	this.$http.post('/admin/upload', request).then(function(response) {
      		if (response.data !== 0) {
      			this.images.push(response.data)
      		}
      	})
	  	}
	  },
	}
</script>