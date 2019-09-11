<template><!-- 小B店铺 -->
	<view id="store_page">
		<loading v-if="isLoading"></loading>
		<auth v-if="!gld.isAuth&&gld.organizationId" @authSuccess="authSuccess"></auth>
		<view class="pt30 mb166">
			<!-- 店铺头部 S -->
			<view class="store_header">
				<view class="store_image" v-if="gld.dYuserInfo.avatarUrl" @click="showToast">
					<image class="maxBox" :src="gld.dYuserInfo.avatarUrl" mode="aspectFill"></image>
				</view>
				<view class="store_describe">
					<view class="store_title fz20 b cf" v-if="gld.dYuserInfo.nickName">{{gld.dYuserInfo.nickName}}的店铺橱窗</view>
				</view>
			</view>
			<!-- 店铺头部 E -->
			<!-- 列表 S -->
			<view class="list_box">
				<view v-for="(item, index) in groupGoodsList" :key="item.goodsSpecId" class='goodsItem bgf' @click='goodsDetail(item, index)'>
					<view class='goodsItem_imgBox'>
						<image class='goodsItem_img' mode='aspectFill' :src="item.goodsDefaultImage | getImgUrlBySize('s')" lazy-load></image>
						<image class='sold_out' src='../../static/image/goods/icon_sold_out.png' v-if="item.totalStock==0"></image>
					</view>
					<view class='goods_bottom'>
						<view class='goods_name'>{{item.goodsName}}</view>
						<view class='goods_footer'>
							<view class='goods_price'>
								<view class='c_FD7D6F mr10'>
									<text class='fz16 b'>￥{{item.dailyPrice}}</text>
								</view>
								<view class='t_line fz12 c_grey3'>￥{{item.originalPrice}}</view>
							</view>
						</view>
						<view class='sales_box bg_FFF5CA'>
							<view class="flexbox">
								<view>
									<image class="icon_money ml10" src='../../static/image/store/icon_store_money.png'></image>
								</view>
								<view>
									<text class="ml10 mr10 fz12 c_AD8C4E">带货赚￥{{item.cashBackAmount}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class='nodata' v-if="groupGoodsList.length==0" style='width:750rpx;line-height:300rpx;'>暂无商品~</view>
				<button class='loadmore' v-if="isLoad&&hasMoreData&&groupGoodsList.length>0" loading='true'>
					正在努力加载更多~
				</button>
				<view class='loadmore' v-if="!isLoad&&!hasMoreData&&groupGoodsList.length>0">
					已经到底了~
				</view>
			</view>
			<!-- 列表 E -->
		</view>
		<!-- 返回顶部 -->
		<image class='scrollTop' mode='aspectFill' v-if="floorstatus" @click='pageScrollToTop' src='../../static/image/default/icon_top.png'></image>
		<toast v-if="toastHidden" :showToastTxt="showToastTxt"></toast>
		<switchTabBar :tabNum="num" @cutTab="tabItemDidClick"></switchTabBar>
	</view>
</template>

<script>
	import switchTabBar from '../../components/switchTabBar';
	import {mapState, mapMutations} from 'vuex';
	import {setPurGoodsItem} from '../../utils/goodsTools';
	export default {
		components:{
			switchTabBar
		},
		computed:{
			...mapState(['gld', 'server', 'config'])
		},
		data() {
			return {
				num: 0,
				isLoading: true,
				toastHidden: false,
				showToastTxt: '',
				groupGoodsList: [],
				isLoad: false,
				hasMoreData: false,
				length: 10,
				goodsGroupId: 17467,
				floorstatus: false,
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
		// 页面下拉刷新
		onPullDownRefresh() {
			this.getGroupGoodsList(true);
		},
		// 页面上拉触底
		onReachBottom() {
			if (this.hasMoreData) {
				if (!this.isLoad) {
					this.isLoad = true;
					this.getGroupGoodsList();
				}
			}
		},
		// 右上角分享
		onShareAppMessage() {

		},
		// 页面滚动事件
		onPageScroll(e) {
			if (e.scrollTop > 330 && !this.floorstatus) {
				this.floorstatus = true;
			} else if (e.scrollTop <= 330 && this.floorstatus) {
				this.floorstatus = false;
			}
		},
		methods: {
			showToast() {
				this.util.showToast(this,'显示Toast');
			},
			getData() {
				this.getGroupGoodsList();
			},
			getGroupGoodsList(onPullDown) {
				let that = this;
				let startIndex = onPullDown ? 0 : that.groupGoodsList.length;
				that.util.sendPost(that.config.getNewOranizationStoreGoodsList, {
					goodsGroupId: that.goodsGroupId,
					length: that.length,
					startIndex: startIndex,
					gcategory: 1,
					organizationId:that.gld.organizationId
				}, function(res) {
					uni.stopPullDownRefresh();
					let groupGoodsList = res.resultData.goodsList || [];
					if (groupGoodsList.length < that.length) { //如果返回的数据小于分页长度表示没有更多数据了
						that.hasMoreData = false;
					} else {
						that.hasMoreData = true;
					}
					for (let i = 0; i < groupGoodsList.length; i++) {
						let item = groupGoodsList[i];
						item = setPurGoodsItem(item);
					};
					if (onPullDown) {
						that.groupGoodsList = groupGoodsList;
					} else {
						that.groupGoodsList = that.groupGoodsList.concat(groupGoodsList);
					};
					that.isLoading = false;
					that.isSwitchLoading = false;
					that.isLoad = false;
					//开启弹幕倒计时
					// that.startOnlineInterval();
				}, function() {
					uni.stopPullDownRefresh();
				});
			},
			pageScrollToTop() {
				if (uni.createSelectorQuery()) {
					uni.createSelectorQuery().select('#store_page').boundingClientRect(function(rect) {
						uni.pageScrollTo({
							scrollTop: rect.top
						})
					}).exec()
				} else {
					uni.pageScrollTo({
						scrollTop: 0
					})
				}
			},
			authSuccess() {
				this.getData(this.options);
			},
			// 点击自定义tab
			tabItemDidClick(index) {
				if (index == 0) {
					return;
				}
				if (index == 1) {
					uni.redirectTo({
						url: '../showcase/showcase'
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
	/* 店铺头部 S */
	.store_header {
		display: flex;
		align-items: center;
		padding: 40rpx 30rpx;
		background: #FFD662;
		border-radius: 40rpx;
		margin: 0 30rpx;
	}
	.store_image {
		width: 100rpx;
		height: 100rpx;
		overflow: hidden;
		border-radius: 50%;
	}
	.store_describe {
		padding: 0 30rpx;
		flex: 1;
	}
	.store_title {
		font-family: PingFangSC;
	}
	/* 店铺头部 E */
	
	/* 店铺列表 S */
	.list_box {
		padding: 30rpx 30rpx 0;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.list_box .goodsItem {
		position: relative;
		width: 330rpx;
		margin-bottom: 30rpx;
		border-radius: 16rpx;
	}
	.goodsItem .goodsItem_imgBox {
	  position: relative;
	  width: 100%;
	  height: 330rpx;
	}
	.goodsItem .goodsItem_img {
	  position: absolute;
	  width: 100%;
	  height: 100%;
	  left: 0;
	  top: 0;
	  z-index: 1;
	  border-radius: 16rpx 16rpx 0 0;
	}
	.goodsItem .sold_out {
	  position: absolute;
	  top: 65rpx;
	  left: 65rpx;
	  z-index: 2;
	  width: 200rpx;
	  height: 200rpx;
	}
	.goodsItem .goods_bottom {
	  padding: 0 20rpx;
	}
	.goods_bottom .goods_name {
	  height:72rpx;
		font-family:PingFangSC;
	  display:-webkit-box;
	  text-overflow:ellipsis;
	  -webkit-box-orient:vertical;
	  -webkit-line-clamp:2;
	  overflow:hidden;
	  margin-top: 20rpx;
	  font-size: 26rpx;
	  line-height: 36rpx;
	  color: #27292B;
	}
	.goodsItem .goods_footer {
	  margin-top: 16rpx;
	  display: flex;
	  align-items: center;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #DEDEDE;
	}
	.goods_footer .goods_price {
	  flex: 1;
	  display: flex;
	  align-items: baseline;
	}
	.sales_box {
	  display: inline-block;
	  margin: 12rpx 0;
		border-radius: 13rpx;
	}
	.sales_box .icon_money {
		width: 20rpx;
		height: 20rpx;
	}
	/* 店铺列表 E */
</style>
