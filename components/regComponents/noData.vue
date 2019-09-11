<template>
	<view>
		<view class='nodata_box'>
			<image class="nodata_img" src="../static/image/default/nodata_2.png"></image>
			<view class='mt15 c_grey3'>{{txt?txt:'还没有数据哦~'}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			txt: {
				default: ''
			}
		}
	}
</script>

<style>

</style>

