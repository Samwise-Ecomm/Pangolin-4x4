<template>
	<div>
		<div style="font-size:300px;color:#252525;width:100%;text-align:center;">404</div>
		<h1 style="width:100%;text-align:center;">File Not Found</h1>
		<div style="width:100%;text-align:center;">
			The page you requested could not be found. Either we broke<br> 
			something or the URL you typed/clicked was wrong or outdated.<br>
			We apologize for the inconvenience.<br>
			<br>
			<a v-link="{ path: '/home' }"><div class="Button Button--active u-center">Return Home</div></a>
		</div>
	</div>
</template>

<script>
module.exports = {
	data () {
		return {}
	},
}
</script>