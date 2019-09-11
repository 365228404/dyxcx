//商品相关处理

//格式化金额,强制保留2位小数，如：2，会在2后面补上00.即2.00 (全局方法已有)
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
// (全局方法已有)
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

// 获取退款item
function setRefundItem(item) {
  // 已退金额
  item.refundQuantityPrice = formatAmount(item.refundQuantity * item.price);
  // 标记缺货的金额
  item.refundPrice = formatAmount(item.stockOutQuantity * item.price);
  if (item.refundState == 1 || item.refundState == 6) {
    item.refundDesc = "退款中";
    item.currRefundState = 1;
  } else if (item.refundState == 4) {
    item.refundDesc = "已退款";
    item.currRefundState = 2;
  } else if (item.refundState == 5 || item.refundState == 3) {
    item.refundDesc = "退款失败";
    item.currRefundState = 3;
  } else {
    item.refundDesc = "--";
    item.currRefundState = false;
  }
};
// 设置每个商品信息(普通小b使用)
function setGoodsItem(item) {
  item.supplyPrice = item.supplyPrice || '0';
  // 供货价
  item.currPrice = "￥" + formatAmount(item.supplyPrice);
  // 市场价
  item.originalPrice = "￥" + formatAmount(item.marketPrice);
  item.dailyPrice = formatAmount(item.dailyPrice)
  // 折扣(b端折扣=供货价/市场价，c端折扣=售价/市场价)
  item.discount = (item.supplyPrice / item.marketPrice) * 10;
  item.discount = item.discount.toFixed(1);
  // 商家赚=最终售价(最终售价在最低建议售价上可以随便商家加任意价)-供货价
  item.retailPriceRange = "赚￥" + formatAmount(item.dailyPrice - item.supplyPrice);
  item.retailPrice = "赚￥" + formatAmount((item.dailyPrice - item.supplyPrice)) + '';

  // 分佣区间最低价
  item.lowestRetailPrice = item.lowestPrice - item.supplyPrice;
  // 分佣区间最高价
  item.highestRetailPrice = item.highestPrice - item.supplyPrice;
  // 分佣的区间差
  item.intervalPoorPrice = item.highestRetailPrice - item.lowestRetailPrice;

  item.cashBackAmount = formatAmount(item.cashBackAmount);
  item.lastPrice = formatAmount(item.lowestPrice);
  //可售时间
  item.saleStartTimes = formatTime(item.saleStartTime, 'M月D日 h: m');
  item.saleEndTimes = formatTime(item.saleEndTime, 'M月D日 h: m');

  item.saleStartTimeYear = formatTime(item.saleStartTime, 'Y/ M/D h:m');
  item.saleEndTimeYear = formatTime(item.saleEndTime, 'Y/ M/D h:m');
  item.addTimeStr = formatTime(item.addTime, 'Y-M-D h:m');
  //预售时间
  item.preSaleStartTime = formatTime(item.preSaleStartTime, 'M月D日 h: m');
  item.preSaleEndTime = formatTime(item.preSaleEndTime, 'M月D日 h: m');

  // goods_status : 1表示是预售商品 2:表示非预售商品，但是库存不足
  // 当前时间戳
  let nowTimeStamp = new Date().getTime();
  item.totalStock = item.totalStock || 0;
  if (item.totalStock <= 0) { //如果库存为0直接赋值为0
    item.totalStock = 0;
  }

  if (item.saleStartTime - nowTimeStamp > 0) {
    item.goods_status = 1;
  }
  if (item.totalStock <= 0 && item.goods_status != 1) {
    item.goods_status = 2;
  }
  if (item.goods_status == 1 && item.totalStock <= 0) { //预售并缺货
    item.status = 3;
  }
  // 是否可以展开
  item.expandType = false;
  item.description = item.description || '';
  if (item.description.length > 60) {
    // 1是未展开 2是已展开
    item.expandType = 1;
  }
  //京东销售百分比
  // item.soldPercentDesc = Math.round(item.soldPercent * 100);
  return item;
};

// 获取利润价格（商家每一件商品赚多少）
function getProfits(item, price) {
  price = price * 1;
  let finalPrice = item.lowestPrice + price;
  item.retailPriceRange = "赚￥" + formatAmount(finalPrice - item.supplyPrice);
  return item;
};

// 内购相关使用(因为内购会使用的是日常售价来结算，普通订单用的是供货价来结算)
function setPurGoodsItem(item,flag) {
  // 把日常售价直接赋值给供货价，这样就可以不用改变之前的结算逻辑，因为之前全部使用供货价来结算的,而内购会用日常售价来结算
  // if(flag){//店主
  //   // 内购价
  //   item.currPrice = formatAmount(item.supplyPrice);
  //   item.dailyPrice = formatAmount(item.supplyPrice);
  //   // 折扣(b端折扣=供货价/市场价，c端折扣=售价/市场价)
  //   item.discount = (item.supplyPrice / item.marketPrice) * 10;
  //   item.discount = item.discount.toFixed(1);
  // }else{
    item.supplyPrice = item.dailyPrice || 0;
    // 内购价
    item.currPrice = formatAmount(item.dailyPrice);
    item.dailyPrice = formatAmount(item.dailyPrice);
    // 折扣(b端折扣=供货价/市场价，c端折扣=售价/市场价)
    item.discount = (item.dailyPrice / item.marketPrice) * 10;
    item.discount = item.discount.toFixed(1);
  // };
  // item.currPrice = '190483948.98';
  // 市场价
  item.originalPrice = formatAmount(item.marketPrice);

  item.lastPrice = formatAmount(item.lowestPrice);

  item.cashBackAmount = formatAmount(item.cashBackAmount);
  // 添加时间
  item.addTimeStr = formatTime(item.addTime, 'Y-M-D h:m');

  //可售时间
  item.saleStartTimes = formatTime(item.saleStartTime, 'M/D h:m');
  item.saleEndTimes = formatTime(item.saleEndTime, 'M/D h:m');
  //预售时间
  item.preSaleStartTime = formatTime(item.preSaleStartTime, 'M/D h:m');
  item.preSaleEndTime = formatTime(item.preSaleEndTime, 'M/D h:m');
  if (item.totalStock <= 0) { //如果库存为0直接赋值为0
    item.totalStock = 0;
  }
  // goods_status : 1表示是预售商品 2:表示非预售商品，但是库存不足
  // 当前时间戳
  let nowTimeStamp = new Date().getTime();
  if (item.saleStartTime - nowTimeStamp > 0) {
    item.goods_status = 1;
  }
  if (item.totalStock == 0 && item.goods_status != 1) {
    item.goods_status = 2;
  }
  if (item.goods_status == 1 && item.totalStock <= 0) { //预售并缺货
    item.status = 3;
  }
  // 是否可以展开
  item.expandType = false;
  item.description = item.description || '';
  if (item.description.length > 150) {
    // 1是未展开 2是已展开
    item.expandType = 1;
  }
  return item;
};

// 获取品牌名称（过滤[]以及[]内的内容）
function getBrandName(brandName) {
	brandName = brandName || ' ';
	brandName += '';
	let startIndex = brandName.lastIndexOf("[");
	if (startIndex <= 0) {
		startIndex = brandName.lastIndexOf("【");
	}
	let endIndex = brandName.lastIndexOf("]");
	if (endIndex <= 0) {
		endIndex = brandName.lastIndexOf("】");
	}
	if (endIndex > 0 && startIndex > 0) {
		let shearStr = brandName.substr(startIndex, endIndex - startIndex + 1);
		brandName = brandName.replace(shearStr, '');
	}
	//console.log(brandName);
	return brandName;
};

export {
  setRefundItem,
  setGoodsItem,
	getProfits,
	setPurGoodsItem,
	getBrandName
};