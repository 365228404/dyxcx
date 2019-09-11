// swiperDot.vue
<template>
	<view class="dot-main">
		<view :class="['dot-item',current==index?'active':'']" v-for="(item,index) in list" :key="index"></view>
	</view>
</template>
<style>
	.dot-main {
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.dot-item {
		width: 12rpx;
		height: 4rpx;
		border: 2rpx solid #e0cccc;
		margin: 0 6rpx;
		box-sizing: border-box;
	}
	.active {
		border: 2rpx solid #900c0c;
	}
</style>
<script>
	export default {
		props: [ 'list','current'],
	}
</script>

