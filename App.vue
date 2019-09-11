<script>
	import {mapState, mapMutations} from 'vuex';
	export default {
		computed:{
			...mapState(['gld','server','config'])
		},
		globalData: {
			code: null
		},
		onLaunch() {
			
		},
		onShow() {
			let that = this;
			if (this.gld.userInfo) return;
			uni.login({
				success(res) {
					that.$options.globalData.code = res.code;
					that.getUserSetting((userInfo)=>{
						if (that.userInfoReadyCallback) {
							that.userInfoReadyCallback(userInfo)
						}
					});
				},
				fail(res) {
					console.log(`uni.login调用失败`);
				}
			});
		},
		methods: {
			...mapMutations({
				changeGld: 'changeGld'
			}),
			// 获取用户授权
			getUserSetting(callback) {
				let that = this;
				// console.log('that111',that,that.util);
				that.loginByWechat(()=>{
					if (!that.gld.organizationId) {
						typeof callback == "function" && callback();
						return;
					}
					uni.getUserInfo({
						success(res) {
							console.log('获取用户信息授权成功',res);
							that.changeGld({
								dYuserInfo: res.userInfo || {},
								isAuth: true
							});
							uni.setStorageSync('isAuth', true);
							typeof callback == "function" && callback();
							
						},
						fail(fail) {
							console.log('拒绝获取用户信息授权失败',fail);
							that.changeGld({
								isAuth: false
							});
							uni.setStorageSync('isAuth', false);
							typeof callback == "function" && callback(false);
						},
						complete() {
							
						}
					})
					
				})
			},
			loginByWechat(callback) {
				let that = this;
				//从后台获取sessionKey||userId||token
				console.log(that.$options.globalData.code);
				// this.util.sendPost('http://nas.eamon.top:18080/ClientLogin/login', {
				// 	code: that.$options.globalData.code
				// },(result)=>{
				// 	that.changeGld({
				// 		userInfo: {},
				// 	});
				// 	console.log(result);
				// 	typeof callback == "function" && callback();
				// },(error)=>{
				// 	that.changeGld({
				// 		userInfo: {},
				// 	});
				// 	typeof callback == "function" && callback();
				// })
				
				that.changeGld({
					userInfo: {}
				});
				typeof callback == "function" && callback();
			},
			// 强制更新小程序 (已经迁移到 utils->appPrototypeApi.js)
			forcedUpdate(callback) {
				let that = this;
				if (uni.getUpdateManager && that.gld.isForcedUpdate) {
					const updateManager = uni.getUpdateManager()
					updateManager.onCheckForUpdate((res)=>{
						// 请求完新版本信息的回调
						// console.log('版本信息:' + res.hasUpdate)
						if (res.hasUpdate){//有新版本
							updateManager.onUpdateReady(()=>{
								uni.showModal({
									title: '更新提示',
									content: '新版本已经准备好，是否重启应用？',
									showCancel: false,
									success(res) {
										if (res.confirm) {
											// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
											updateManager.applyUpdate();
											// typeof callback == "function" && callback();
										}
									}
								})
							});
							updateManager.onUpdateFailed(()=>{
								// 新版本下载失败
								uni.showModal({
									title: '更新提示',
									content: '新版本下载失败',
									showCancel: false
								})
								typeof callback == "function" && callback();
							});
						}else{
							typeof callback == "function" && callback();
						};
					});
				}else{
					typeof callback == "function" && callback();
				};
			},
		},
		onHide() {
			// console.log('App Hide')
		},
		// 页面下拉刷新
		// onPullDownRefresh() {
		// 	// uni.startPullDownRefresh(); // 取消下拉刷新
		// },
		// // 页面上拉触底
		// onReachBottom() {
		// 	
		// },
		// // 右上角分享
		// onShareAppMessage() {
		// 	
		// },
		// // 页面滚动事件
		// onPageScroll() {
		// 	
		// },
	}
</script>

<style>
	/*每个页面公共css */
	@import url("style/dialog.css");
	@import url("style/drawer.css");
	@import url("style/form.css");
	@import url("style/tabBar.css");
	@import url("style/theme.css");
	@import url("style/button.css");
	@import url("./style/common.css");
	/* z-index 使用：
	*1.页面上的内容不能超出101
	*2.页面的弹窗 101-1000之间
	*3.toast 层级为1000
	*/
	@import url("style/reset.css");
	@import url("style/loading.css");
	@import url("style/toast.css");
	@import url("style/crad.css");
	@import url("style/address.css");
	page {
	  background-color: #f7f7f7;
	  color: #27292B;
	  font-family: Arial, sans-serif;
	  font-size: 32rpx;
	  line-height:1;
	  -webkit-overflow-scrolling: touch;
	}

	/* 橙色提示条 */
	.orange_tip{
	  display:flex;
	  align-items:center;
	  font-size:26rpx;
	  margin:0 30rpx;
	  height:80rpx;
	  line-height:80rpx;
	  border-radius:80rpx;
	  overflow:hidden;
	  padding-left: 30rpx;
	}
	.orange_tip_text{
	  flex:1;
	  overflow:hidden;
	  text-overflow:ellipsis;
	  white-space:nowrap;
	  margin-left: 10rpx;
	}
	/**加载更多**/
	.loadmore {
	  width: 100%;
	  height: 96rpx;
	  font-size: 22rpx;
	  line-height: 96rpx;
	  color: #808080;
	  text-align: center;
	  white-space: nowrap;
	}
	
	/* 没有数据 S */
	.nodata_box {
	  position: fixed;
	  top: 50%;
	  left: 50%;
	  z-index: 1;
	  width: 300rpx;
	  /* height: 200rpx; */
	  margin-left: -150rpx;
	  margin-top: -240rpx;
	  text-align: center;
	  font-size: 24rpx;
	}
	.nodata_img {
	  width: 240rpx;
	  height: 240rpx;
	}
	.nodata {
	  text-align: center;
	  font-size: 24rpx;
	  color: #808080;
	  line-height: 800rpx;
	}
	/* 没有数据 E*/
	
	/* 底部按钮 S */
	.page_footer_pd{
	  padding-bottom: 170rpx;
	}
	.page_footer {
	  display: block;
	  position: fixed;
	  z-index: 100;
	  left: 0;
	  bottom: 0;
	  width: 100%;
	  padding: 30rpx 0;
	}
	.page_footer_btn{
	  height: 90rpx;
	  line-height: 90rpx;
	  font-size: 32rpx;
	  text-align: center;
	  color: #fff;
	  border-radius: 90rpx;
	  margin: 0 40rpx;
	}
	.pb100{
	  padding-bottom: 100rpx;
	}
	.page_footer_100 {
	  position: fixed;
	  z-index: 100;
	  left: 0;
	  bottom: 0;
	  width: 100%;
	  height: 100rpx;
	  background: #fff;
	}
	/* 底部按钮 E */
	
	/* 常用样式 S */
	/* 商品描述  */
	.goodsDesc {
	  height: 72rpx;
	  display: -webkit-box;
	  text-overflow: ellipsis;
	  -webkit-box-orient: vertical;
	  -webkit-line-clamp: 2;
	  overflow: hidden;
	  margin-bottom: 10rpx;
	}
	/* 大头像 */
	.portrait_url{
	  width: 108rpx;
	  height: 108rpx;
	  border-radius: 50%;
	}
	/* 一键回到顶部 */
	.scrollTop_icon{
	  width:108rpx;
	  height:108rpx;
	  border-radius:50%;
	  margin-top: 20rpx;
	}
	/* 常用样式 E */
	
	/* iPhone 全面屏 */
	.pb168{
	  padding-bottom: 168rpx;
	}
	.ip_pb64 {
	  padding-bottom: 64rpx;
	}
</style>
