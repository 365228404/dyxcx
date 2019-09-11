<template>
	<!-- 小B店主注册页面 -->
	<view>
		<auth @authSuccess="authSuccess" v-if="!gld.isAuth&&gld.organizationId"></auth>
		<loading v-if="isLoading"></loading>
		<view class='big_box'>
			<!-- 头部 S -->
			<view class='header'>
				<image mode='widthFix' class='maxBox' :src="'file/group_2/weixinBackground_2/1552359409054_169843.jpg' | getImgUrlBySize('', 1)"></image>
			</view>
			<!-- 头部 E -->
			<!-- 信息表 S -->
			<view class='info_box'>
				<view>
					<view class='info_line'></view>
					<view class='title'>手机号</view>
				</view>
				<view class='mt10'>
					<input class='input_info' type="number" maxlength="11" v-model="mobile" placeholder='请填写你的手机号码' placeholder-class="wg_placeholder"></input>
				</view>
			</view>
			<view class='info_box ovh'>
				<view>
					<view class='info_line'></view>
					<view class='title'>图形验证码</view>
				</view>
				<view class='mt10'>
					<input class='input_code dib' type="number" maxlength="8" v-model="numberCode" placeholder='请填写图形验证码'
					 placeholder-class="wg_placeholder"></input>
					<image class='verification_code dib ml20' v-if="imgCode.imgUrl" @click='getValidateCode' :src="imgCode.imgUrl | getImgUrlBySize('',1)"></image>
				</view>
			</view>
			<view class='info_box ovh'>
				<view>
					<view class='info_line'></view>
					<view class='title'>手机短信验证码</view>
				</view>
				<view class='mt10'>
					<input class='input_code bg_grey5 dib' type="number" maxlength="8" v-model="verificationCode" placeholder='请填写短信验证码'
					 placeholder-class="wg_placeholder"></input>
					<view class='verification_code dib ml20' @click='getVerificationCode'>
						{{codeStatus}}
					</view>
				</view>
			</view>
			<view class='info_box'>
				<view>
					<view class='info_line'></view>
					<view class='title'>邀请码</view>
				</view>
				<view class='mt10'>
					<input class='input_info' type="number" maxlength="8" v-model="invitationCode" placeholder='请填写邀请码'
					 placeholder-class="wg_placeholder"></input>
				</view>
			</view>
			<!-- 信息表 E -->
			<form reportSubmit='true' @submit="keepTap">
				<button class='submit_btn' formType="submit">立即申请</button>
			</form>
		</view>
		<toast v-if="toastHidden" :showToastTxt="showToastTxt"></toast>
	</view>
</template>

<script>
	import {mapState, mapMutations} from 'vuex';
	export default {
		computed: {
			...mapState(['gld', 'config'])
		},
		data() {
			return {
				toastHidden: false,
				showToastTxt: '',
				// 姓名
				consignee: '',
				// 号码
				mobile: '',
				// 图形验证码
				numberCode: '',
				// 短信验证码
				verificationCode: '',
				// 邀请码
				invitationCode: '',
				codeStatus: "获取验证码",
				countDown: 60,
				// 图形验证码对象
				imgCode: {},
				isLoading: true,
				isJoin: false,
				channel: '斗米兼职',
				timeStamp: new Date().getTime()
			}
		},
		onLoad(options) {
			this.util.getUserInfo(()=>{
				if (!this.gld.isAuth) return;
				this.getData();
			})
		},
		onShow() {

		},
		methods: {
			...mapMutations({
				changeGld: 'changeGld'
			}),
			authSuccess() {
				this.getData(this.options);
			},
			getData() {
				this.getValidateCode();
			},
			// 获取图形验证码
			getValidateCode() {
				let that = this;
				that.util.sendPostShowTost(that.config.getValidateCode, {}, function(res) {
					that.imgCode = res.resultData || {};
					that.isLoading = false;
					console.log('图形验证码', that.imgCode);
				});
			},
			// 获取验证码
			getVerificationCode() {
				let that = this;
				that.imgCode = that.imgCode || {};
				setTimeout(function() {
					if (that.countDown < 60) {
						return;
					}
					if (!that.mobile) {
						that.util.showToast(that, "手机号码不能为空")
						return;
					} else if (!/^1\d{10}$/.test(that.mobile)) {
						that.util.showToast(that, "手机号码格式不正确")
						return;
					}
					if (!that.numberCode) {
						that.util.showToast(that, "请输入图形验证码")
						return;
					}
					that.util.sendPostShowTost(that.config.sendVerifyCodeByMP, {
						phoneMob: that.mobile,
						verifyType: 5,
						numberCode: that.numberCode,
						imgCodeId: that.imgCode.imgCodeId
					}, function(res) {
						that.util.showToast(that, "验证码已发送");
						setTimeout(function() {
							that.countdown();
						}, 1000);
					}, function(res) {
						if (res.data.resultMsg) {
							// that.util.showToast(that, res.data.resultMsg, function () {
							// 	
							// });
							//重新获取图形验证码
							setTimeout(() => {
								that.getValidateCode();
							}, 1500)
						}
					});
				}, 300);
			},
			// 60秒倒计时
			countdown(endCountDown) {
				let that = this;
				if (that.countDown == 0 || endCountDown) {
					that.countDown = 60;
					that.codeStatus = "重新发送";
				} else {
					if (!endCountDown) {
						that.countDown--;
						that.codeStatus = that.countDown + "s";
						setTimeout(function() {
							that.countdown();
						}, 1000);
					}
				};
			},
			// 校验验证码
			checkVerifyCode(callBack) {
				let that = this;
				// that.util.sendPostShowTost(that.config.checkVerifyCode, {
				// 	phoneMob: that.mobile,
				// 	verifyType: 5,
				// 	code: that.verificationCode
				// }, function (res) {
				// 	if (callBack) {
				// 		callBack();
				// 	}
				// });
				this.checkInvitationCode(function() {
					that.util.sendPostShowTost(that.config.checkVerifyCode, {
						phoneMob: that.mobile,
						verifyType: 5,
						code: that.verificationCode
					}, function(res) {
						if (callBack) {
							callBack();
						}
					});
				})
			},
			// 校验邀请码 (如果后端校验更佳)
			checkInvitationCode(callback) {
				let that = this;
				let param = {
					length: 9999,
					startIndex: 0,
					status: 2 // 未使用的邀请码
				};
				that.app.sendPost(that.config.getExtractList, {
					param
				}, function(res) {
					let inviteCodeList = res.resultData.inviteCodeList || [];
					let isHaveInvitationCode = inviteCodeList.some(item => item.inviteCode == that.invitationCode);
					if (isHaveInvitationCode) {
						if (callBack) {
							callBack();
						}
					} else {
						that.util.showToast(that, '邀请码无效');
					}

				});
			},
			// 号码
			bindMobile(e) {
				this.mobile = e.detail.value;
			},
			// 验证码
			bindCode(e) {
				this.verificationCode = e.detail.value;
			},
			// 图形验证码
			bindImgCode(e) {
				this.numberCode = e.detail.value;
			},
			bindInvitationCode(e) {
				this.invitationCode = e.detail.value;
			},
			//升级会员
			keepTap(e) {
				let that = this;
				//更新用户表单
				// app.updateUserForm({
				// 	formId: e.detail.formId
				// });
				let addrObj = {};
				addrObj.groupId = that.gld.groupId;
				addrObj.organizationName = that.consignee || '';
				addrObj.phone = that.mobile || '';
				addrObj.verificationCode = that.verificationCode || '';
				addrObj.numberCode = that.numberCode || '';
				addrObj.imgCodeId = that.imgCode.imgCodeId || '';
				// addrObj.invitationCode = that.invitationCode || ''; //邀请码
				if (!addrObj.phone) {
					that.util.showToast(that, "手机号码不能为空");
					return false;
				}
				if (!/^1\d{10}$/.test(addrObj.phone)) {
					that.util.showToast(that, "手机号码格式不正确")
					return false;
				}
				if (!addrObj.numberCode.length) {
					that.util.showToast(that, "请输入图形验证码");
					return false;
				}
				if (!addrObj.verificationCode.length) {
					that.util.showToast(that, "请输入短信验证码~");
					return false;
				}
				if (!addrObj.invitationCode.length) {
					that.util.showToast(that, "请输入邀请码~");
					return false;
				}
				if (that.isJoin) {
					that.util.showToast(that, '请不要重复操作');
					return
				} else {
					that.isJoin = true;
				};
				let param = addrObj;
				param.timeStamp = that.timeStamp;
				param.channel = that.channel;
				param.fatherId = 7;
				that.checkVerifyCode(function() {
					//注册店主
					that.util.sendPostShowTost(that.config.bindingUserOrganizationNew, param, function(res) {
						that.changeGld({
							organizationState: 1,
							isOnRegistered: false
						})
						that.util.showToast(that, '注册成功', function() {
							// app.getUserInfoByUserId(function () {
							// 	if (that.gld.organizationId && that.gld.organizationState == 1) { //B端
							// 		wx.switchTab({
							// 			url: '../store/store',
							// 		})
							// 	}
							// });
						}, 1800);
					}, function(res) {
						if (res.data.resultCode != 349) {
							that.isJoin = false;
							that.timeStamp = new Date().getTime();
						} else {
							if (res.data.resultMsg) {
								that.util.showToast(that, res.data.resultMsg);
							}
						};
					});
				})
			}
		}
	}
</script>

<style>
	.submit_btn {
		position: fixed;
		z-index: 1;
		left: 30rpx;
		bottom: 30rpx;
		width: 690rpx;
		height: 100rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 100rpx;
		background-color: #EC3C33;
		color: #fff;
	}

	page {
		background: #FFFCF5;
	}

	.big_box {
		display: block;
		overflow: hidden;
		padding-bottom: 120rpx;
	}

	/* 提交信息 S */
	.info_box {
		padding: 10rpx 30rpx 0 30rpx;
		width: 100%;
	}

	.info_line {
		display: inline-block;
		background: #c73932;
		vertical-align: middle;
		width: 4rpx;
		height: 26rpx;
	}

	.input_info {
		padding-left: 30rpx;
		border-radius: 72rpx;
		border: 1rpx solid #e6e6e6;
		height: 72rpx;
		width: 660rpx;
		background-color: #fff;
	}

	.protocol_info {
		display: flex;
		align-items: center;
		padding: 45rpx 30rpx 0 30rpx;
		width: 100%;
	}

	.title {
		display: inline-block;
		width: 600rpx;
		margin-bottom: 15rpx;
		margin-left: 10rpx;
		font-size: 28rpx;
	}

	.input_code {
		display: inline-block;
		padding-left: 30rpx;
		border-radius: 72rpx;
		border: 1rpx #e0e0e0 solid;
		height: 72rpx;
		width: 432rpx;
		background-color: #fff;
		vertical-align: middle;
	}

	.invite_code {
		padding-left: 30rpx;
		border-radius: 72rpx;
		border: 1rpx #e0e0e0 solid;
		height: 72rpx;
		width: 360rpx;
		vertical-align: middle;
	}

	.verification_code {
		display: inline-block;
		border-radius: 72rpx;
		line-height: 72rpx;
		text-align: center;
		width: 208rpx;
		height: 72rpx;
		color: #fff;
		font-size: 28rpx;
		border: 1rpx #f0f0f0 solid;
		background-color: #EC3C33;
		vertical-align: middle;
	}
</style>
