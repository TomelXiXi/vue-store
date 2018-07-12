<style lang="less">
    @import "../../styles/common.less";
</style>

<template>
	<div>
        <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
	</div>
</template>

<script>
	export default {
		props:["spinShow"]
    }
</script>

        