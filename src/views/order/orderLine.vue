<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <table>
        	<Table  border :columns="orderLineColumns" :data="orderLineData" style="width: 100%;"></Table>
        </table>
    </div>
</template>
<script>
	import axios from 'axios'
	import {baseUrl} from '@/conf/env'
    export default {
    	props: {
            row: Object
        },
    	data () {
	        return {
	        	orderLineColumns:[
				{
                    type: 'index',
                    title: '序号',
                    width: 60,
                    align: 'center',
                    fixed: 'left'
                },
                {
                    title: 'sku编码',
                    key: "skuCode",
                    width: 120,
                    align: 'center'
                },
                {
                    title: 'sku名称',
                    key: "name",
                    width: 120,
                    align: 'center'
                
	        	},
	        	 {
                    title: '数量',
                    key: "qty",
                    width: 100,
                    align: 'center'
                
	        	},
	        	 {
                    title: '商品编码',
                    key: "productCode",
                    width: 120,
                    align: 'center'
                
	        	},
	        	{
                    title: '实际销售价格',
                    key: "actualPrice",
                    width: 100,
                    align: 'center'
                
	        	},
	        	{
                    title: '实际销售价格',
                    key: "actualPrice",
                    width: 100,
                    align: 'center'
                
	        	},
	        	{
                    title: '实际行总金额',
                    key: "totalPrice",
                    width: 100,
                    align: 'center'
                
	        	},
	        	{
                    title: '优惠券支付总金额',
                    key: "couponAmount",
                    width: 100,
                    align: 'center'
                
	        	},
	        	{
                    title: '积分支付总金额',
                    key: "totalPoint",
                    width: 100,
                    align: 'center'
                
	        	},
	        	{
                    title: '实际支付行总计',
                    key: "totalActual",
                    width: 100,
                    align: 'center'
                
	        	},
	        	{
                    title: '行上积分数量',
                    key: "numberPoint",
                    width: 100,
                    align: 'center'
                
	        	},
	        	{
                    title: '组合商品编码',
                    key: "comboCode",
                    width: 100,
                    align: 'center',
                    fixed: 'right'
                
	        	},
	        	],
	        	orderLineData:this.row.soLineList
	        	,
	        	
	        }
    	},
    	
        
    	}
</script>