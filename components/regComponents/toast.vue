<template>
	<view>
		<view class='toast_box'>
		  <view class='toast lh36'>{{showToastTxt}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			showToastTxt: {
				default: ''
			}
		}
	}
</script>

