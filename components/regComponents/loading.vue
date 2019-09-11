<template>
	<view>
		<view class="loadBeating">
			<!-- 优选集团用 -->
			<view :class="['load_img',loadingMarginTop?'loadingMarginTop':'']" style="background-image: url('https://image.yunhuotong.net/yhtplus/file/default/background/load_img.png');"></view>
			<!-- 优选集团用 -->
			<view class='loadText c_grey3'>{{stateText?stateText:'正在加载...'}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			stateText: {
				default: ''
			}
		}
	}
</script>

<style>

</style>

