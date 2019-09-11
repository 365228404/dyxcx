<template><!-- 我的订单 -->
	<view>
		<loading v-if="isLoading"></loading>
		
		<view></view>
		
		<toast v-if="toastHidden" :showToastTxt="showToastTxt"></toast>
	</view>
</template>

<script>
	import {mapState, mapMutations} from 'vuex';
	
	export default {
		computed:{
			...mapState(['gld', 'server', 'config'])
		},
		data() {
			return {
				isLoading: true,
				toastHidden: false,
				showToastTxt: ''
			}
		},
		onLoad(options) {
			
		},
		onShow() {
			
		},
		// 页面下拉刷新
		onPullDownRefresh() {
			
		},
		// 页面上拉触底
		onReachBottom() {
			
		},
		// 右上角分享
		onShareAppMessage() {

		},
		// 页面滚动事件
		onPageScroll() {

		},
		methods: {
			
		}
	}
</script>

<style>
	
</style>
