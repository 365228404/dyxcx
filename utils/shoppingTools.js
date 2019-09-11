// 购物相关js模块
import store from 'store';
let state = store.state;
// 购物相关 S
// 获取点击的规格 
function getDidClickSpec(that, index, specType) {
  if (specType == 1) { //点击规格1
    let specOneItem = that.goodsSpecMap.specOneList[index];
    if (that.goodsSpecMap.specTwoList.length == 0 || specOneItem.specTwoList.length == 0) { //如果是单规格
      if (specOneItem.totalStock <= 0) {
        that.util.showToast(that, '该规格没有库存了呢~', "", 1000);
        return;
      }
    }
    if (specOneItem.notChoose) {
      return;
    }
    if (that.onASpecOneItemIndex != index) {
      let onAitem = that.goodsSpecMap.specOneList[that.onASpecOneItemIndex];
      onAitem.isSelected = false;
    }
    specOneItem.isSelected = !specOneItem.isSelected;
    that.onASpecOneItemIndex = index;

    if (specOneItem.isSelected) { //选中了规格1

      let specTwoList = that.goodsSpecMap.specTwoList;
      if (specTwoList.length == 0) { //如果规格2数组为0直接设置规格1为购买商品
        setPurchaseGoods(specOneItem, false, that);
      }
      for (let i = 0; i < specTwoList.length; i++) {
        let specTwoItem = specTwoList[i];
        if (specOneItem.specTwoList.length == 0) { //如果规格2数组为0，则规格2全部为不可选状态
          specTwoItem.notChoose = true;
          if (specTwoItem.isSelected) {
            specTwoItem.isSelected = false;
          }
          setPurchaseGoods(specOneItem, false, that);
        } else {
          let tempSpecTwo = "";
          for (let j = 0; j < specOneItem.specTwoList.length; j++) { //遍历规格1包含的规格2
            let tempItem = specOneItem.specTwoList[j];
            if (tempItem.specTwo == specTwoItem.specTwo) {
              tempSpecTwo = specTwoItem.specTwo;
              if (tempItem.totalStock > 0) { //库存大于0该规格才可选
                specTwoItem.notChoose = false;
                if (specTwoItem.isSelected && tempItem.supplyPrice >= 0 && tempItem.goodsSpecId && tempItem.specOne == specOneItem.specOne) { //如果已经有选中的规格2
                  setPurchaseGoods(tempItem, false, that);
                }
              } else { //库存小于等于0该规格为不可选状态
                specTwoItem.notChoose = true;
                if (specTwoItem.isSelected) {
                  specTwoItem.isSelected = false;
                  setPurchaseGoods({}, false, that);
                }
              };
            }
          }
          if (!tempSpecTwo.length) {
            specTwoItem.notChoose = true;
            if (specTwoItem.isSelected) {
              specTwoItem.isSelected = false;
            }
          }
        }
      }
      that.goodsSpecMap.specOneName = state.gld.specOneName + " 已选择“" + specOneItem.specOne + "”";
    } else {
      that.goodsSpecMap.specOneName = state.gld.specOneName;
      setPurchaseGoods({}, false, that);
      for (let i = 0; i < that.goodsSpecMap.specTwoList.length; i++) {
        let item = that.goodsSpecMap.specTwoList[i];
        item.notChoose = false;
      }
    }
  } else if (specType == 2) { //点击规格2
    let specTwoItem = that.goodsSpecMap.specTwoList[index];
    if (specTwoItem.specOneList.length == 0 || specTwoItem.specOneList.length == 0) { //如果是单规格2
      if (specTwoItem.totalStock <= 0) {
        that.util.showToast(that, '该规格没有库存了呢~', "", 1000);
        return;
      }
    }
    if (specTwoItem.notChoose) {
      return;
    }
    if (that.onASpecTwoItemIndex != index) {
      let onAitem = that.goodsSpecMap.specTwoList[that.onASpecTwoItemIndex];
      onAitem.isSelected = false;
    }
    specTwoItem.isSelected = !specTwoItem.isSelected;
    that.onASpecTwoItemIndex = index;

    if (specTwoItem.isSelected) { //选中规格2
      let specOneList = that.goodsSpecMap.specOneList;
      if (specOneList.length == 0) { //如果规格1数组为0直接设置规格2为购买商品
        setPurchaseGoods(specTwoItem, false, that);
      }
      for (let i = 0; i < specOneList.length; i++) {
        let specOneItem = specOneList[i];
        if (specTwoItem.specOneList.length == 0) { //如果规格1数组为0，则规格1全部为不可选状态
          setPurchaseGoods(specTwoItem, false, that);
          specOneItem.notChoose = true;
          if (specOneItem.isSelected) {
            specOneItem.isSelected = false;
          }
        } else {
          let tempSpecOne = "";
          for (let j = 0; j < specTwoItem.specOneList.length; j++) { //筛选出可选的规格1
            let tempItem = specTwoItem.specOneList[j];
            if (tempItem.specOne == specOneItem.specOne) {
              tempSpecOne = specTwoItem.specOne;
              specOneItem.notChoose = false;
              if (specOneItem.isSelected) {
                for (let k in specOneItem.specTwoList) {
                  let tempSpecTwo = specOneItem.specTwoList[k];
                  if (tempSpecTwo.specTwo == specTwoItem.specTwo) {
                    setPurchaseGoods(tempSpecTwo, false, that);
                  }
                }
              }
            }
          }
          if (!tempSpecOne.length) {
            specOneItem.notChoose = true;
            if (specOneItem.isSelected) {
              specOneItem.isSelected = false;
              setPurchaseGoods({}, false, that);
            }
          }
        }
      }
      that.goodsSpecMap.specTwoName = state.gld.specTwoName + " 已选择“" + specTwoItem.specTwo + "”";
    } else {
      that.goodsSpecMap.specTwoName = state.gld.specTwoName;
      setPurchaseGoods({}, false, that);
      for (let i = 0; i < that.goodsSpecMap.specOneList.length; i++) {
        let item = that.goodsSpecMap.specOneList[i];
        item.notChoose = false;
      }
    }
  }
  setPurchaseGoods(that.purchaseGoods, false, that);

	that.goodsSpecMap = that.goodsSpecMap;
};
/*
 * 显示购物车弹框
 * status 1.显示 0 隐藏
 * itemType 1:表示在普通列表中使用 2:表示在商品详情中使用
 */
function setShopModalStatus(status, that, itemType) {
  if (itemType == 1) {
    //获取商品详情前先清空商品显示信息
		that.goodsSpecMap = {
			specOneName: state.gld.specOneName,
			specOneList: [],
			specTwoName: state.gld.specTwoName,
			specTwoList: []
		};
		that.onASpecOneItemIndex = 0;
		that.onASpecTwoItemIndex = 0;
		that.quantity = 1;
		that.purchaseGoods = { };
		that.organizationGoods = {
			sellingPoint: '--',
			goodsName: '--'
		};
		that.imageList = [{}];
  }
  setTimeout(function() {
    if (status == 0) {
			that.showShopModal = false;
    }
  }.bind(that), 100);
  if (status == 0) return;
  if (!that.goodsSpecId) {
    return
  }
  // 获取商品详情
  that.app.sendPostShowTost(state.config.getGoodsDetailByGoodsSpecId, {
    inviteUserId: state.gld.inviteUserId,
    organizationId: state.gld.fromOId,
    goodsSpecId: that.goodsSpecId,
    goodsGroupId: that.goodsGroupId
  }, function(res) {
    dealGoodsSpec(that, res, itemType);
		that.showShopModal = true;
  });
};
/*
 * 处理订单规格
 * res 商品详情数据
 * itemType 1:表示在普通列表中使用 2:表示在购物车列表中使用(暂无) 没有则表示商品详情
 */
function dealGoodsSpec(that, res, itemType) {
  res = res || {};
  let goodsGroup = res.resultData.goodsGroup;
  //分组是否开启返佣
  that.cashBackEnable = res.resultData.cashBackEnable || 2;
  //品牌渠道
  that.sourceType = res.resultData.goodsGroup.sourceType || 0;
  // 组织商品
  let organizationGoods = res.resultData.organizationGoods;
  let goodsSpecList = res.resultData.goodsSpecList;
  that.goodsSpecList = goodsSpecList;

  that.goodsSpecMap.specOneList = [];
  that.goodsSpecMap.specTwoList = [];
  // 临时规格1map，有标记是否存在相同规格1
  let tempGoodsSpec = {};
  // 临时规格2map，有标记是否存在相同规格2
  let tempGoodsSpecTwo = {};
  for (let i = 0; i < goodsSpecList.length; i++) {
    let goodsSpec = goodsSpecList[i];
    goodsSpec.brandId = organizationGoods.brandId;
    //筛选显示的规格1，如果之前没有存在该规格1，则把该规格添加到规格1数组
    if (!tempGoodsSpec[goodsSpec.specOne] && goodsSpec.specOne) {
      tempGoodsSpec[goodsSpec.specOne] = goodsSpec.specOne;
      let specOne = that.getSpecObj(goodsSpec);
      specOne.length = specOne.specOne.length;
      if (specOne.specTwo) { //双规格
        specOne.goodsSpecId = false;

        specOne.specTwoList = [];
        for (let j in goodsSpecList) { //记录规格1中包含的所有的规格2
          let item = goodsSpecList[j];
          if (item.specOne == specOne.specOne) {
            specOne.specTwoList.push(item);
          }
        };
      } else { //只有规格1
        if (specOne.totalStock <= 0) {
          specOne.notChoose = true;
        }
        specOne.specTwoList = [];
      };
      that.goodsSpecMap.specOneList.push(specOne);
    }
    // 筛选显示的规格2，如果之前没有存在该规格2，则把该规格添加到规格2数组
    if (!tempGoodsSpecTwo[goodsSpec.specTwo] && goodsSpec.specTwo) {
      tempGoodsSpecTwo[goodsSpec.specTwo] = goodsSpec.specTwo;
      let specTwo = that.getSpecObj(goodsSpec);

      specTwo.length = specTwo.specTwo.length;
      if (specTwo.specOne) { //双规格
        specTwo.specOneList = [];
        for (let j in goodsSpecList) { //记录规格2中包含的所有的规格1
          let item = goodsSpecList[j];
          if (item.specTwo == specTwo.specTwo) {
            specTwo.specOneList.push(item);
          }
        }
      } else { //只有规格2
        if (specTwo.totalStock <= 0) {
          specTwo.notChoose = true;
        }
        specTwo.specOneList = [];
      };
      that.goodsSpecMap.specTwoList.push(specTwo);
    }
  };
  goodsGroup.actDiscount = goodsGroup.actDiscount || {};
  goodsGroup.actDiscount.actDiscountId = goodsGroup.actDiscount.actDiscountId || -1;
	
	that.goodsGroupName = goodsGroup.groupName;
	that.actDiscount = goodsGroup.actDiscount;
  if (itemType) { //如果是列表使用
    // 组织商品无法作为购买商品下单,所以置空
    organizationGoods.goodsSpecId = false;
    if (that.isPurchasing) { //如果是内购会
      organizationGoods.supplyPrice = organizationGoods.dailyPrice;
    }
    
		that.organizationGoods = organizationGoods;
		that.imageList = res.resultData.imageList;
    setPurchaseGoods(that.organizationGoods, true, that);
    // console.log('组织商品', that.organizationGoods)
  }else{
    setPurchaseGoods({}, true, that);
  };
};
/*
 * 设置购买的商品
 * purchaseGoods 选中的商品item
 * initialize 第一次加载
 */
function setPurchaseGoods(purchaseGoods, initialize, that) {
  console.log('选中的商品', purchaseGoods);
  purchaseGoods = purchaseGoods || {};
  that.organizationGoods = that.organizationGoods || {};
  if (purchaseGoods.goodsSpecId) {
    getBuyResult(purchaseGoods);
    //如果设置的数量大于等于总库存，直接设置购买数量为最大库存
    if (that.quantity >= that.purchaseGoods.totalStock) { 
      that.quantity = that.purchaseGoods.totalStock;
    }
  } else {
    that.purchaseGoods = {};
    that.quantity = 1;
  };
  if (initialize) { //数据刚请求回来
    let specOneListLength = that.goodsSpecMap.specOneList.length;
    let specTwoListLength = that.goodsSpecMap.specTwoList.length;
    if (specOneListLength == 1 && specTwoListLength == 1) { //规格2和规格1数组只有一个的情况
      let specOneItem = that.goodsSpecMap.specOneList[0];
      let specTwoItem = that.goodsSpecMap.specTwoList[0];
      if (specTwoItem.totalStock > 0) {
        specTwoItem.isSelected = true;
        specOneItem.isSelected = true;
        getBuyResult(specTwoItem);
      }
    } else if (specOneListLength == 1 && !specTwoListLength) { //规格1数组只有一个对象，规格2数组为0的情况
      let specOneItem = that.goodsSpecMap.specOneList[0];
      if (specOneItem.totalStock > 0) {
        specOneItem.isSelected = true;
        getBuyResult(specOneItem);
      }
    } else if (!specOneListLength && specTwoListLength == 1) { //规格2数组只有一个对象，规格1数组为0的情况
      let specTwoItem = that.goodsSpecMap.specTwoList[0];
      if (specTwoItem.totalStock > 0) {
        specTwoItem.isSelected = true;
        getBuyResult(specTwoItem);
      }
    } else if (!specOneListLength && !specTwoListLength) { //两个规格数组都为空
      if (that.organizationGoods.totalStock > 0) {
        getBuyResult(that.organizationGoods);
      }
    } else if (specOneListLength > 1 && specTwoListLength > 1) { //两个规格数组都大于1的情况（多色多码）

    } else if (specOneListLength > 1 && specTwoListLength == 1) { //规格1数组大于1规格2数组只有1个的情况
      let specTwoItem = that.goodsSpecMap.specTwoList[0] || {};
      let specOneItem = that.goodsSpecMap.specOneList[0] || {};
      if (specTwoItem.totalStock > 0) {
        specTwoItem.isSelected = true;
        specOneItem.isSelected = true;
        that.onASpecOneItemIndex = 0;
        that.onASpecTwoItemIndex = 0;
        getBuyResult(specTwoItem);
      }
    } else if (specOneListLength == 1 && specTwoListLength > 1) { //规格2数组大于1规格1数组只有1个的情况
      let specTwoList = that.goodsSpecMap.specTwoList;
      let specOneItem = that.goodsSpecMap.specOneList[0] || {};
      specOneItem.isSelected = true;
      that.onASpecOneItemIndex = 0;
      getBuyResult(specOneItem);
      for (let i = 0; i < specTwoList.length; i++) {
        let specTwoItem = specTwoList[i];
        let tempSpecTwo = "";
        for (let j = 0; j < specOneItem.specTwoList.length; j++) { //遍历规格1包含的规格2
          let tempItem = specOneItem.specTwoList[j];
          if (tempItem.specTwo == specTwoItem.specTwo) {
            tempSpecTwo = specTwoItem.specTwo;
            if (tempItem.totalStock > 0) { //库存大于0该规格才可选
              specTwoItem.notChoose = false;
            } else { //库存小于等于0该规格为不可选状态
              specTwoItem.notChoose = true;
            };
          }
        }
        if (!tempSpecTwo.length) {
          specTwoItem.notChoose = true;
        }
      };
    }
    
    if (that.purchaseGoods.goodsSpecId) {
      that.goodsSpecMap.specOneName = state.gld.specOneName + " 已选择“" + that.purchaseGoods.specOne || '' + "”";
      that.goodsSpecMap.specTwoName = state.gld.specTwoName + " 已选择“" + that.purchaseGoods.specTwo || '' + "”";
    }else{
      if (that.purchaseGoods.specOne){
        that.goodsSpecMap.specOneName = state.gld.specOneName + " 已选择“" + that.purchaseGoods.specOne + "”";
      }
    }
  }

  if (that.purchaseGoods && that.purchaseGoods.goodsSpecId) {
    that.purchaseGoods.currPrice = formatAmount(that.purchaseGoods.supplyPrice);
    that.purchaseGoods.marketPrices = formatAmount(that.purchaseGoods.marketPrice);
    // 折扣(b端折扣=供货价/市场价，c端折扣=售价/市场价)
    that.purchaseGoods.discount = (that.purchaseGoods.supplyPrice / that.purchaseGoods.marketPrice) * 10;
    that.purchaseGoods.discount = that.purchaseGoods.discount.toFixed(1);
    if (that.purchaseGoods.dailyPrice) {
      that.purchaseGoods.originalPrice = "￥" + formatAmount(that.purchaseGoods.dailyPrice);
      that.purchaseGoods.originalPrices = formatAmount(that.purchaseGoods.dailyPrice);
    } else if (that.purchaseGoods.lowestPrice) {
      that.purchaseGoods.originalPrice = "￥" + formatAmount(that.purchaseGoods.lowestPrice);
      that.purchaseGoods.originalPrices = formatAmount(that.purchaseGoods.lowestPrice);
    }
  } else {
    that.purchaseGoods.currPrice = formatAmount(that.organizationGoods.supplyPrice);
    that.purchaseGoods.marketPrices = formatAmount(that.organizationGoods.marketPrice);
    // 折扣(b端折扣=供货价/市场价，c端折扣=售价/市场价)
    that.purchaseGoods.discount = (that.organizationGoods.supplyPrice / that.organizationGoods.marketPrice) * 10;
    that.purchaseGoods.discount = that.purchaseGoods.discount.toFixed(1);
    if (that.organizationGoods.dailyPrice) {
      that.purchaseGoods.originalPrice = "￥" + formatAmount(that.organizationGoods.dailyPrice);
      that.purchaseGoods.originalPrices = formatAmount(that.organizationGoods.dailyPrice);
    } else if (that.organizationGoods.lowestPrice) {
      that.purchaseGoods.originalPrice = "￥" + formatAmount(that.organizationGoods.lowestPrice);
      that.purchaseGoods.originalPrices = formatAmount(that.organizationGoods.lowestPrice);
    }
  };

  function getBuyResult(resultItem) {
    if (that.isPurchasing) { //如果是内购,把日常售价直接赋值给供货价就可以延用之前的逻辑,内购用日常售价来结算，其他情况暂时用供货价
      resultItem.supplyPrice = resultItem.dailyPrice
    }
    that.purchaseGoods = resultItem;
  };
  // that.setData({
  //   purchaseGoods: that.purchaseGoods,
  //   quantity: that.quantity
  // })
};
/*
 * shoppingType 1.确认添加购物车 2.确认购买
 * isCTermina 1.C端购买、2.B端购买
 * fromUserId 推手Id
 * gioType 统计类型 1.选品会场，2.选品商品详情，3.品牌会场，4.商品详情
 */
function keepTap(that, shoppingType, isCTermina, fromUserId, gioType) {
  that.purchaseGoods = that.purchaseGoods || {};
  console.log('购买商品', that.purchaseGoods);
  if (!that.purchaseGoods.goodsSpecId || that.purchaseGoods.supplyPrice < 0) {
    that.util.showToast(that, '请勾选商品类型');
    return;
  }
  if (shoppingType == 1) { //添加购物车
    let param = {
      isCTermina: isCTermina,
      quantity: that.quantity,
      goodsSpecId: that.purchaseGoods.goodsSpecId,
      goodsGroupId: that.goodsGroupId,
      organizationId: state.gld.fromOId
    };
    if (fromUserId && that.cashBackEnable == 1) {
      param.fromUserId = fromUserId;
    }
    uni.showToast({
      title: '正在添加...',
      icon: 'loading',
      duration: state.gld.timeout
    });
    console.log('添加购物车fromUserId=', fromUserId)
    that.app.sendPost(state.config.addNewShoppingCartGoods, param, function(res) {
      console.log('添加到购物车');
      uni.hideToast();
      that.util.showToast(that, '添加成功',function(){
				that.showShopModal = false;
     //    that.util.getShopCarQuantity(function (globalShoppingCartQuantity){
     //      state.gld.globalShoppingCartQuantity = globalShoppingCartQuantity;
					// that.shopCarNumber = globalShoppingCartQuantity;
     //    });
				store.commit('changeGld',{
					needLoadShopping: true
				})
        var gioBName = gioType == 1 ? 'B_selbrand_addcart' : gioType == 2 ? 'B_selgoods_addcart' : gioType == 3 ? 'B_brand_addcart' : gioType == 4 ? 'B_goods_addcart' : ''; 
        var gioCName = gioType == 1 ? 'C_selbrand_addcart' : gioType == 2 ? 'C_selgoods_addcart' : gioType == 3 ? 'C_brand_addcart' : gioType == 4 ? 'C_goods_addcart' : ''; 
        // if (that.util.gio) {
        //   if (state.gld.organizationId) {
        //     that.util.gio('track', gioBName, {
        //       quantity: that.quantity,
        //       goods_price: that.purchaseGoods.supplyPrice
        //     })
        //   } else {
        //     that.util.gio('track', gioCName, {
        //       quantity: that.quantity,
        //       goods_price: that.purchaseGoods.supplyPrice
        //     })
        //   };
        // }
      });
    }, function() { //失败
      uni.hideToast();
    });
  } else if (shoppingType == 2) { //确认购买
    var gioBName = gioType == 1 ? 'B_selbrand_buy' : gioType == 2 ? 'B_selgoods_buy' : gioType == 3 ? 'B_brand_buy' : gioType == 4 ? 'B_goods_buy' : '';
    var gioCName = gioType == 1 ? 'C_selbrand_buy' : gioType == 2 ? 'C_selgoods_buy' : gioType == 3 ? 'C_brand_buy' : gioType == 4 ? 'C_goods_buy' : '';
    // if (that.util.gio) {
    //   if (state.gld.organizationId) {
    //     that.util.gio('track', gioBName, {
    //       quantity: that.quantity,
    //       goods_price: that.purchaseGoods.supplyPrice
    //     })
    //   } else {
    //     that.util.gio('track', gioCName, {
    //       quantity: that.quantity,
    //       goods_price: that.purchaseGoods.supplyPrice
    //     })
    //   };
    // }
    let nextGoodsInfo = that.purchaseGoods;
    nextGoodsInfo.goodsGroupId = that.goodsGroupId;
    nextGoodsInfo.isCTermina = isCTermina;
    nextGoodsInfo.couponList = [];
    // 结算全部用供货价supplyPrice字段
    nextGoodsInfo.groupName = that.goodsGroupName;
    nextGoodsInfo.goodsName = that.organizationGoods.goodsName;
    nextGoodsInfo.currPrice = formatAmount(that.purchaseGoods.supplyPrice);
    nextGoodsInfo.quantity = that.quantity;
    nextGoodsInfo.dailyPrice = that.purchaseGoods.supplyPrice;
    nextGoodsInfo.supplyPrice = that.purchaseGoods.supplyPrice;
    nextGoodsInfo.goodsDefaultImage = that.imageList[0].imageUrl;
    // 提交用的价格
    nextGoodsInfo.price = formatAmount(that.purchaseGoods.supplyPrice);
    nextGoodsInfo.specName = '';
    if (nextGoodsInfo.specOne && nextGoodsInfo.specTwo) {
      nextGoodsInfo.specName = nextGoodsInfo.specOne + '，' + nextGoodsInfo.specTwo;
    } else if (!nextGoodsInfo.specOne && nextGoodsInfo.specTwo) {
      nextGoodsInfo.specName = nextGoodsInfo.specTwo;
    } else if (nextGoodsInfo.specOne && !nextGoodsInfo.specTwo) {
      nextGoodsInfo.specName = nextGoodsInfo.specOne;
    }
    //会场名称、商品名称跟规格名称编码后再传
    nextGoodsInfo.groupName = encodeURIComponent(nextGoodsInfo.groupName);
    nextGoodsInfo.goodsName = encodeURIComponent(nextGoodsInfo.goodsName);
    nextGoodsInfo.specName = encodeURIComponent(nextGoodsInfo.specName);
    nextGoodsInfo.specOne = encodeURIComponent(nextGoodsInfo.specOne);
    nextGoodsInfo.specTwo = encodeURIComponent(nextGoodsInfo.specTwo);
    nextGoodsInfo.specOneList = '';
    nextGoodsInfo.specTwoList = '';

    nextGoodsInfo.organizationId = state.gld.fromOId || state.gld.organizationId;
    if (state.gld.isAudit) { //如果是审核期间组织id直接给12
      nextGoodsInfo.organizationId = state.gld.auditOid;
    }
    nextGoodsInfo.actDiscount = JSON.stringify(that.actDiscount);

		that.showShopModal = false;
    //记录品牌渠道
    let sourceType = '';
    if (that.sourceType) {
      sourceType = '&sourceType=' + that.sourceType
    }
    let fromUser = ''
    if (fromUserId && that.cashBackEnable == 1) {
      fromUser = '&fromUserId=' + fromUserId;
    }
    if (that.isPurchasing) { //内购会结算
      that.goodsGroup = that.goodsGroup || {};
      console.log('内购会信息', that.goodsGroup)
      wx.navigateTo({
        url: '../orderDetail/sureOrder?goodsGroupId=' + that.goodsGroupId + '&isCTermina=' + isCTermina + fromUser + '&cashBackEnable=' + that.cashBackEnable + sourceType + '&goodsInfo=' + JSON.stringify(nextGoodsInfo)
      })
    } else {
      wx.navigateTo({
        url: '../orderDetail/sureOrder?goodsGroupId=' + that.goodsGroupId + sourceType + fromUser + '&goodsInfo=' + JSON.stringify(nextGoodsInfo)
      })
    };
  }
};
// 购物相关 E
// 格式化金额(小数点后面只保留大于0的小数，最多两位)
function formatAmount(value) {
  if (value) {
    return Number(value).toFixed(2);
  } else {
    return '0.00';
  };
};

export {
  getDidClickSpec,
  setPurchaseGoods,
  setShopModalStatus,
  keepTap,
  dealGoodsSpec
};