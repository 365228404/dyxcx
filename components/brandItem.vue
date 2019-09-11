<template>
	<view>
		<view class='brandItem'>
			<image class='brandIcon bg_grey5' v-if="item.imageUrl" :src="item.imageUrl"></image>
			<view :class="['fz14', 'flex1', isSelected?'themeC':'']">{{item.brandName}}</view>
			<image class='brandCheck' src='../static/image/default/check_red.png' v-if="item.isSelected"></image>
		</view>
	</view>
</template>

<script>
	export default {
		props:['item']
	}
</script>

<style>
	/* 选品品牌列表 S */
	.brandItem {
	  display: flex;
	  align-items: center;
	  padding: 30rpx 0;
	  margin: 0 30rpx;
	  border-bottom: 1rpx solid #e6e6e6;
	}
	.brandIcon {
	  margin-right: 40rpx;
	  width: 70rpx;
	  height: 70rpx;
	  border-radius: 50%;
	  margin-left: 10rpx;
	}
	.brandCheck {
	  width: 44rpx;
	  height: 44rpx;
	  margin-left: 78rpx;
	}
	/* 选品品牌列表 E */
</style>

