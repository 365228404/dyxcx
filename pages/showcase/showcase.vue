<template><!-- 小B橱窗页面 -->
	<view>
		<loading v-if="isLoading"></loading>
		
		<view></view>
		
		<toast v-if="toastHidden" :showToastTxt="showToastTxt"></toast>
		<switchTabBar :tabNum="num" @cutTab="tabItemDidClick"></switchTabBar>
	</view>
</template>

<script>
	import switchTabBar from '../../components/switchTabBar';
	import {mapState, mapMutations} from 'vuex';
	
	export default {
		components:{
			switchTabBar
		},
		computed:{
			...mapState(['gld', 'server', 'config'])
		},
		data() {
			return {
				num: 1,
				isLoading: false,
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
			// 点击自定义tab
			tabItemDidClick(index) {
				if (index == 1) {
					return;
				}
				if (index == 0) {
					uni.redirectTo({
						url: '../store/store'
					});
				} else if (index == 2) {
					uni.redirectTo({
						url: '../mine/mine'
					});
				}
			}
		}
	}
</script>

<style>
	
</style>
