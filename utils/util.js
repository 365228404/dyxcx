// 常用方法
import Vue from 'vue';
import store from 'store';
let state = store.state;

//Toast
function showToast(that, txt, callback, time) {
  time = Number(time) || 800;
  if (typeof txt != 'string' || !txt) return;
	that.showToastTxt = txt;
	that.toastHidden = true;
  setTimeout(function () {
		that.showToastTxt = '';
		that.toastHidden = false;
    typeof callback == "function" && callback();
  }, time)
};

// 时间戳转时间
function formatTime(dateLong, format) {
	function formatNumber(n) {
	  n = n.toString()
	  return n[1] ? n : '0' + n
	}
  let formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  let returnArr = [];
  format = format || 'Y-M-D h:m:s';
  let date = new Date(dateLong);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (let i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
};

//格式化金额,强制保留2位小数，如：2，会在2后面补上00.即2.00
//参考http://www.fed123.com/javascriptnodejs/4832.html
function formatAmount(value) {
  let f = parseFloat(value);
  if (isNaN(f)) {
    return '0.00';
  }
  // f = Math.floor(value * 100) / 100;
  f = parseInt((value * 100).toPrecision(12)) / 100;
  let s = f.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
};

function getImgUrlBySize(imageUrl, size, flag){
	if (!imageUrl) {
	  imageUrl = '../../static/image/default/default.jpg';
	  return imageUrl;
	} else {
	  if (imageUrl.indexOf('.png') > -1 || flag){
	    return state.server + imageUrl;
	  }
	  if (imageUrl.indexOf('qlogo') == -1) {
	    if (imageUrl.lastIndexOf('s') == imageUrl.length - 5) {
	      imageUrl = imageUrl.substring(0, imageUrl.length - 5) + size + '.jpg';
	    } else if (imageUrl.lastIndexOf('c') == imageUrl.length - 5) {
	      imageUrl = imageUrl.substring(0, imageUrl.length - 5) + size + '.jpg';
	    } else if (imageUrl.lastIndexOf('m') == imageUrl.length - 5) {
	      imageUrl = imageUrl.substring(0, imageUrl.length - 5) + size + '.jpg';
	    } else if (imageUrl.lastIndexOf('d') == imageUrl.length - 5) {
	      imageUrl = imageUrl.substring(0, imageUrl.length - 5) + size + '.jpg';
	    } else if (imageUrl.indexOf('.jpg') == -1) {
	      imageUrl = imageUrl + size + '.jpg'
	    } else {
	      imageUrl = imageUrl.substring(0, imageUrl.length - 4) + size + '.jpg';
	    };
	    return state.server + imageUrl;
	  }else{
	    return imageUrl
	  };
	};
}

// 全局请求方法（自带tost）
function sendPostShowTost(url, data, successFn, failFn) {
	data = data || {};
	successFn = successFn || function() {};
	failFn = failFn || function() {};
	uni.showToast({
		title: '请稍等片刻...',
		icon: 'loading',
		duration: state.gld.timeout
	});
	sendPost(url, data, successFn, failFn, true);
};
// 全局请求方法（不会显示toast）
function sendPost(url, data, successFn, failFn, notHiddenToast) {
	let that = this;
	data = data || {};
	// 集团ID
	data.groupId = 2;
	if (state.gld.userId && !data.userId) {
		data.userId = state.gld.userId;
	}
	if (!data.organizationId) {
		if (typeof(state.gld.organizationId) != "undefined" && state.gld.organizationId) {
			data.organizationId = state.gld.organizationId;
		}
	}
	if (state.gld.isTest) {
		//测试
		data.userId = state.gld.testUserId;
		if (!data.targetOrganizationId) {
			data.organizationId = state.gld.testOrganizationId;
		}
		if (url.indexOf('loginByWechat') > -1) {
			data.loginUserId = state.gld.testUserId
		}
	}
	if (state.gld.isAudit) { //如果审核中
		data.organizationId = state.gld.auditOid;
	}
	// 排序，默认传1就行了
	if (data.sortField == null) {
		data.sortField = 1;
	}
	// 版本号，每个新版本加1
	data.versionCode = state.gld.versionCode;
	// 每个页面请求接口的唯一标识
	if (!data.timeStamp) {
		data.timeStamp = new Date().getTime();
	}
	data = JSON.stringify(data);
	uni.request({
		url: state.server + url,
		// url:url,
		method: "POST",
		header: {
			'content-type': 'application/x-www-form-urlencoded',
			'X-AUTH-TOKEN': state.gld.token,
			// 'content-type': 'application/json'
		},
		data: {
			'data': data
			// code: data.code
		},
		// success (res) {
		// 	if (successFn) {
		// 		successFn(res);
		// 	}
		// 	console.log(`request调用成功 ${res}`);
		// },
		// fail (res) {
		// 	if (failFn) { //响应失败
		// 		failFn(res)
		// 	}
		// 	console.log(`request调用失败`);
		// }
		success: function(res) {
			if (notHiddenToast) {
				uni.hideToast();
			}
			if (res.statusCode == 200) {
				if (!res.data) {
					res.data = {}
				}
				if (res.data.resultCode == 0) {
					if (successFn) {
						successFn(res.data);
					}
				} else {
					if (failFn) { //响应失败
						failFn(res)
					}
					switch (res.data.resultCode) {
						case 420: //今日已弹窗
							if (successFn) {
								successFn(res.data);
							}
							break;
						case 421: //弹窗未开启
							if (successFn) {
								successFn(res.data);
							}
							break;
						case 426: //活动不存在
							if (successFn) {
								successFn(res.data);
							}
							break;
						case 434: //优惠券已领完
							if (successFn) {
								successFn(res.data);
							}
							break;
						case 446: //微信步数活动队伍不存在
							if (successFn) {
								successFn(res.data);
							}
							break;
						case 448: //微信步数活动队伍已满员
							if (successFn) {
								successFn(res.data);
							}
							break;
						case 449: //参与的微信步数活动次数超过当天最大值
							if (successFn) {
								successFn(res.data);
							}
							break;
						case 524: //互助计划活动不存在!
							if (successFn) {
								successFn(res.data);
							}
							break;
						case 544: //openGId为空!
							if (successFn) {
								successFn(res.data);
							}
							break;
						case -7: //店铺未在该直播活动范围内或者还未有活动开始的记录
							if (successFn) {
								successFn(res.data);
							}
							break;
						default:
							let msg = res.data.resultMsg;
							if (msg) {
								uni.showToast({
									title: msg,
									icon: 'none',
									duration: 2000
								});
							}
							break;
					}
				};
			} else { //请求状态不是200
				if (!res) {
					res = {}
				}
				if (!res.data) {
					res.data = {}
				}
				if (failFn) { //响应失败
					failFn(res)
				}
			};
		},
		fail: function(res) {
			if (!res) {
				res = {}
			}
			if (!res.data) {
				res.data = {}
			}
			if (notHiddenToast) {
				uni.showToast({
					title: '网络不给力，刷新试试',
					icon: 'none'
				});
			}
			if (failFn) {
				failFn(res)
			}
		}
	})
};

// 获取用户信息
function getUserInfo(callback) {
	// let isAuth = uni.getStorageSync('isAuth');
	if (state.gld.userInfo) {
		typeof callback == "function" && callback(state.gld.userInfo)
	} else {
		// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
		// 所以此处加入 callback 以防止这种情况
		Vue.prototype.userInfoReadyCallback = res => {
			typeof callback == "function" && callback(res);
		}
	};
};

// 获取用于RSA加密的模和公钥指数
function getPublicKeyAndModel(callBack) {
	let that = this;
	sendPostShowTost(state.config.getPublicKeyAndModel, {}, function(res) {
		if (callBack) {
			callBack(res.resultData)
		}
	})
};
// 发起支付
function immediatePayment(otherInfo, url, payParam, success, fail) {
	let that = this;
	otherInfo = otherInfo || {}
	// shoppingType 1表示非购物车下单 2：表示购物车下单 3：表示立即加入时调起支付
	let shoppingType = otherInfo.shoppingType;
	if (!payParam.isUseBalance) {
		payParam.isUseBalance = 0;
	}
	if (shoppingType == 3) { //立即加入测试传type=1，正式不用传
		if (state.server.indexOf('test') != -1) {
			payParam.type = 1;
		}
		console.log('加入参数', payParam)
	}

	sendPostShowTost(url, payParam, function(result) {
		let resultData = result.resultData;
		if (shoppingType == 1) {
			if (resultData.orderBalancePaymentId && resultData.orderPaymentId) { //部分用余额抵扣，一部分需要用微信支付。这时候微信支付的成功或者失败需要通过调yuntongPayWebNotifyUrl这个接口通知后台
				alipayPay(result, success, fail, true);
			} else if (resultData.orderBalancePaymentId && !resultData.orderPaymentId) { //如果这个接口只返回了orderBalancePaymentId，说明订单全部金额被余额抵扣掉了,不需要发起微信支付成功后直接回调
				if (success) { //支付成功
					success({}, result);
				}
			} else if (!resultData.orderBalancePaymentId && resultData.orderPaymentId) { //如果只有orderPaymentId，说明没有用余额抵扣，走以前的逻辑(直接发起微信支付)
				alipayPay(result, success, fail);
			}
		} else if (shoppingType == 2) {
			if (resultData.orderBalancePaymentIdList.length > 0 && resultData.orderPaymentIdList.length > 0) { //部分用余额抵扣，一部分需要用微信支付。这时候微信支付的成功或者失败需要通过调yuntongPayWebNotifyUrl这个接口通知后台
				alipayPay(result, success, fail, true);
			} else if (resultData.orderBalancePaymentIdList.length > 0 && !resultData.orderPaymentIdList.length) { //如果这个接口只返回了orderBalancePaymentId，说明订单全部金额被余额抵扣掉了,不需要发起微信支付成功后直接回调
				if (success) { //支付成功
					success({}, result);
				}
			} else if (!resultData.orderBalancePaymentIdList.length && resultData.orderPaymentIdList.length > 0) { //如果只有orderPaymentId，说明没有用余额抵扣，走以前的逻辑(直接发起微信支付)
				alipayPay(result, success, fail);
			}
		} else if (shoppingType == 3) {
			alipayPay(result, success, fail);
		}
	}, function(res) {
		if (fail) {
			fail(res);
		}
	});
};
// 支付宝支付
function alipayPay(result, success, fail, needNotify) {
	let that = this;
	let param = result.resultData.weiXinOfficialAccountsPayParam;
	if (result.resultData.weiXinOfficialAccountsPayParam) {
		param = result.resultData.weiXinOfficialAccountsPayParam;
	} else if (result.resultData.payResult) {
		param = result.resultData.payResult;
		param = JSON.parse(param);
	}
	if (!param.package) {
		if (fail) {
			fail({}, result, needNotify);
		}
		return
	}
	// 支付id（可用于推送）
	let prepay_id = param.package.replace('prepay_id=', '');
	// console.log('支付信息', param);
	uni.requestPayment({
		'appId': param.appId,
		'timeStamp': param.timeStamp,
		'nonceStr': param.nonceStr,
		'package': param.package,
		'signType': param.signType,
		'paySign': param.paySign,
		'success': function(res) { //result为己方服务器返回的结果，res为微信返回的结果
			console.log(res)
			if (success) { //支付成功
				success(res, result, needNotify);
			}
			// 更新支付id，用于推送
			updateUserForm({
				prepayId: prepay_id
			});
		},
		fail: function(res) { //支付失败
			console.log(res)
			updateUserForm({
				prepayId: prepay_id
			});
			if (fail) {
				fail(res, result, needNotify);
			}
		}
	})
};
// 更新用户表单
function updateUserForm(param) {
	param = param || {};
	let that = this;
	if (!param.prepayId && !param.formId) {
		return;
	}
	if (param.prepayId) { //支付id传2
		param.formType = 2;
	} else { //普通id传1
		param.formType = 1;
	};
	sendPost(state.config.updateUserForm, param);
};
// 如果一部分用余额，一部分用支付宝支付付款，成功后通知后台
function yuntongPayWebNotifyUrl(result, transactionState, callBack) {
	let that = this;
	let notIfyParam = {
		transactionState: transactionState
	};
	if (result.resultData.orderBalancePaymentId) {
		notIfyParam.orderBalancePaymentId = result.resultData.orderBalancePaymentId;
	}
	if (result.resultData.orderBalancePaymentIdList) {
		if (result.resultData.orderBalancePaymentIdList.length) {
			notIfyParam.orderBalancePaymentIdList = result.resultData.orderBalancePaymentIdList;
		}
	}
	sendPost(state.config.yuntongPayWebNotifyUrl, notIfyParam, function(result) {
		if (callBack) {
			callBack();
		}
	}, function() {
		if (callBack) {
			callBack();
		}
	});
};
// 添加内购会操作记录 operationType 3：进入商品详情 4：点击商品列表的立即购买 5：选完规格后点击立即购买
function addPurchaseWouldGoodsReCord(goodsGroupId, goodsItem, operationType, organizationId) {
	let that = this;
	goodsItem = goodsItem || {};
	if (!goodsGroupId || !goodsItem.goodsId) {
		return;
	}
	sendPost(state.config.addPurchaseWouldGoodsReCord, {
		goodsGroupId: goodsGroupId,
		organizationId: organizationId,
		goodsId: goodsItem.goodsId,
		'type': operationType
	});
};
//获得扫码查询字符串参数
function getQueryStringArgs(scene) {
	let items = scene.length ? scene.split("&") : [];
	let args = {};
	let item = null,
		name = null,
		value = null;
	for (let i = 0; i < items.length; i++) {
		item = items[i].split("=");
		name = decodeURIComponent(item[0]);
		value = decodeURIComponent(item[1]);
		if (name.length) {
			args[name] = value;
		}
	};
	return args;
};
// 根据用户id获取用户信息
function getUserInfoByUserId(callBack, fail) {
	let that = this;
	if (!state.gld.userId) {
		return;
	}
	//获取B端盈利数据
	let param = getTodayTime();

	sendPost(state.config.getUserInfoByUserId, param, function (res) {
		// that.globalData.isCTermina = res.resultData.isCTermina;
		let userInfo = res.resultData.user;
		console.log('userInfo', userInfo);
		// userInfo.isCTermina = res.resultData.isCTermina;
		let organization = res.resultData.organization || {};
		store.commit('changeGld',{
			userInfo: userInfo,
			userState: userInfo.userState,
			// 组织信息
			organization: organization,
			organizationId: organization.organizationId ||'',
			organizationState: organization.organizationState || false,
			// 是否在审核状态中 audit=2非审核中 audit=其他表示是审核状态,每次版本提交这个审核状态都要累加，例如上一次是3这一次就要改成4
			audit: res.resultData.audit,
			// 是否强制更新
			isForcedUpdate: res.resultData.isForcedUpdate
		})
		
// 		that.globalData.userInfo = userInfo;
// 		that.globalData.userState = userInfo.userState;
// 		// 组织信息
// 		that.globalData.organization = res.resultData.organization || {};
// 		that.globalData.organizationId = that.globalData.organization.organizationId;
// 		console.log('在app.js更新组织id', that.globalData.organizationId);
// 		that.globalData.organizationState = that.globalData.organization.organizationState || false;
// 		console.log('最新用户信息', res);
// 
// 		// 是否在审核状态中 audit=2非审核中 audit=其他表示是审核状态,每次版本提交这个审核状态都要累加，例如上一次是3这一次就要改成4
// 		that.globalData.audit = res.resultData.audit;
// 		// 是否强制更新
// 		that.globalData.isForcedUpdate = res.resultData.isForcedUpdate;

		// 审核中，并且没有加入，不是审核用的邀请码，就是真正的审核状态,这时候选品那里传的应该是爆款分类
		// reloadAudit(); //刷新审核状态
		forcedUpdate(function () {
			typeof callBack == "function" && callBack(res);
		});
	}, function (res) {
		if (fail) {
			fail(res);
		}
	});
};
// 获取当天开始跟结束时间
function getTodayTime() {
	let todayS = new Date();
	todayS.setHours(0);
	todayS.setMinutes(0);
	todayS.setSeconds(0);
	todayS.setMilliseconds(0);
	todayS = new Date(todayS).getTime();
	let todayE = new Date();
	todayE.setHours(23);
	todayE.setMinutes(59);
	todayE.setSeconds(59);
	todayE.setMilliseconds(999);
	todayE = new Date(todayE).getTime();
	// console.log('开始时间', todayS, '结束时间', todayE)
	return {
		startTime: todayS,
		endTime: todayE
	}
};
// 如果一部分用余额，一部分用微信支付付款，成功后通知后台
function yuntongPayWebNotifyUrl(result, transactionState, callBack) {
	let that = this;
	let notIfyParam = {
		transactionState: transactionState
	};
	if (result.resultData.orderBalancePaymentId) {
		notIfyParam.orderBalancePaymentId = result.resultData.orderBalancePaymentId;
	}
	if (result.resultData.orderBalancePaymentIdList) {
		if (result.resultData.orderBalancePaymentIdList.length) {
			notIfyParam.orderBalancePaymentIdList = result.resultData.orderBalancePaymentIdList;
		}
	}
	sendPost(state.config.yuntongPayWebNotifyUrl, notIfyParam, function (result) {
		if (callBack) {
			callBack();
		}
	}, function () {
		if (callBack) {
			callBack();
		}
	});
};

Vue.prototype.util = {
	formatTime,
	showToast,
	formatAmount,
	getImgUrlBySize,
	sendPostShowTost,
	sendPost,
	getUserInfo,
	getTodayTime,
	getPublicKeyAndModel,
	immediatePayment,
	updateUserForm,
	yuntongPayWebNotifyUrl,
	addPurchaseWouldGoodsReCord,
	getQueryStringArgs,
	getUserInfoByUserId,
	yuntongPayWebNotifyUrl
};