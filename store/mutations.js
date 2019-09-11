
const mutations = {
	changeGld(state, gldObject) { // 改变全局公用数据方法
		for (let key in gldObject) {
			state.gld[key] = gldObject[key];
		}
	},
	changeUpd(state, gldObject) { // 更新前页面栈的数据
		if (!gldObject) {
			for (let key in state.upd) {
				state.upd[key] = '';
			}
		} else {
			for (let key in gldObject) {
				state.upd[key] = gldObject[key];
			}
		}
	}
}

export default mutations;