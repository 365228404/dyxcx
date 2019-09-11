<template>
	<view>
		<view class='tabBar_box'>
			<block v-for="(item, index) in tabItemList" :key="index">
				<view class='tab_item' @click='tabItemDidClick(index)'>
					<image class='tab_img' :src="item.isSelected?item.selImg:item.dfImg" mode="aspectFill"></image>
					<view :class="['tab_text',item.isSelected?'themeC':'c_grey3']">{{item.title}}</view>
					<!-- <view v-if="index==1&&shopCarNumber" class="bar_ba_dge_bottom bar_ba_dge_all bg_theme cf">{{shopCarNumber > 99 ?'...':shopCarNumber}}</view> -->
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabItemList: [{
					title: '橱窗',
					isSelected: false,
					selImg: '../static/image/tab/icon_tab_index_pink.png',
					dfImg: '../static/image/tab/icon_tab_index_grey.png'
				}, {
					title: '购物车',
					isSelected: false,
					selImg: '../static/image/tab/icon_tab_shoppingcart_pink.png',
					dfImg: '../static/image/tab/icon_tab_shoppingcart_grey.png'
				}, {
					title: '个人中心',
					isSelected: false,
					selImg: '../static/image/tab/icon_tab_wode_pink.png',
					dfImg: '../static/image/tab/icon_tab_wode_grey.png'
				}]
			}
		},
		props:['tabNum'],
		created() {
			this.$set(this.tabItemList[this.tabNum], 'isSelected', true);
			// console.log(this.tabItemList);
		},
		methods: {
			tabItemDidClick(index) {
				this.$emit('cutTab',index);
			}
		}
	}
</script>

<style>

</style>

