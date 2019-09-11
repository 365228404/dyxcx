<template>
	<view>
		<view class="js_dialog">
			<view class="dialog_mask" />
			<view class="dialog_container">
				<view class="dialog_content">
					<view class="dialog_title">提示</view>
					<view class='fz14 c_grey2'>需要您打开设置才能继续使用</view>
					<view class='dialog_footer'>
						<button class='dialog_btn bg_theme'  @click="openSettingList" lang="zh_CN">确认打开</button>
					</view>
				</view>
			</view>
		 </view>
	</view>
</template>

<script>
	export default {
		methods: {
			openSettingList() {
				this.$emit('closeDialog');
				uni.openSetting({
					success(res) {},
					fail(fail) {}
				})
			}
		}
	}
</script>

<style>

</style>
