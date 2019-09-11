<template>
	<view>
		<view class="js_dialog">
		    <view class="dialog_mask" />
			<view class="dialog_container">
				<view class='wg_auth'>
					<image mode='aspectFill' class='maxBox' :src="imgUrl"></image>
					<view class='auth_box'>
						<!-- <view class="b">授权登录</view> -->
						<view class="fz14 mt15">需要您授权用户信息</view>
						<button class='auth_btn' hover-class="auth_hover" lang="zh_CN" @click="authGetUserInfo">开启授权</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapMutations, mapState} from 'vuex';
	export default {
		computed:{
			...mapState(['gld'])
		},
		props:{
			imgUrl: {
				default: 'https://test.ueker.cn/yhtplus/file/group_2/weixinBackground_1/1552976648129_982640.jpg'
			}
		},
		methods: {
			...mapMutations({
				changeGld: 'changeGld'
			}),
			authGetUserInfo() {
				let that = this;
				uni.openSetting({
					success(res) {
						if (res.authSetting['scope.userInfo']) {
							// console.log('用户信息授权开关打开',res);  // 获取用户信息
							uni.getUserInfo({
								success(res) {
									// console.log('授权设置页面成功打开用户信息授权',res);
									that.changeGld({
										userInfo: res.userInfo || {},
										isAuth: true,
									});
									that.$emit('authSuccess');
									// typeof callback == "function" && callback(res.userInfo);
								}
							})
						} else {
							console.log('用户信息授权开关未开启'); // 弹出引导用户去授权设置页面授权
						}
					},
					fail(fail) {
						
					},
				})
			}
		}
	}
</script>

<style>

</style>

