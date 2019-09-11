
import config from '../utils/config';
const state = {
	// 测试服务器
	// server: 'https://test.ueker.cn/yhtplus/',
	// imgServer: 'https://test.ueker.cn/yhtplus/',
	// 预发布服务器quantity
	// server: 'https://dev.yunhuotong.net/yhtplus/',
	// imgServer: 'https://dev.yunhuotong.net/yhtplus/',
	// 正式服务器
	server: 'https://yhtplus.yunhuotong.net/yhtplus/',
	imgServer: 'https://image.yunhuotong.net/yhtplus/',
	config: config, // 接口API
	gld: { // 全局公用数据 globalData
		appName: '十二星选',
		appTheme: '#FF4466',
		isAuth: true,
		versionCode: 1, // 版本号，每个新版本加1
		isAudit: false, // 审核期间
		isForcedUpdate: false, //有新版本时是否强制更新小程序
		auditOid: false,
		userInfo: null,
		dYuserInfo: null,
		userId: 125847,
		organization: {},
		organizationId: 48143,
		// 组织状态。1：正常，2：禁用 ,3:拒绝
		organizationState: 1,
		isOnRegistered: false,
		fromOId: 48143, // 店铺ID(暂时先用模拟的)
		groupId: 2,
		token: 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxMjU4NDciLCJzdWIiOiIxNTgxNDk3OTM3NiIsImlhdCI6MTU2ODE5NTAwMn0.kjN-mUEn03RwCf7qley00TcZ8aYcgGipZ_gNLUuS7g8',
		// 是否是测试模式(上正式时记得注释或者改为false)
		isTest: false,
		testUserId: 1094680, //测试的用户
		testOrganizationId: 38306,  //测试的组织
		inviteUserId: '',//邀请人Id
		// 网络超时时间
		timeout: 60000,
		globalShoppingCartQuantity: 0,
		// 是否需要刷新购物车列表
		needLoadShopping: true,
		ifRegister: true,
		// 获取分组的id，目前传1就行了
		groupOrganizationId: 1,
		specOneName: '颜色', // 规格 1 名称
		specTwoName: '尺码', // 规格 2 名称
		// 是否需要刷新店商品铺列表
		needLoadStore: true,
	},
	upd: { //改变前面页面栈的数据
		areaId: '',
		areaName: '',
		proviceFirstStageName: '',
		addressCitySecondStageName: '',
		addressCountiesThirdStageName: '',
		openingBankCity: '',
		reloadSingle: '',  //小B店铺
		weiXinAddress: '', //manageAddr
		needRefresh: '',
		addressObj: '',
	}
}

export default state;