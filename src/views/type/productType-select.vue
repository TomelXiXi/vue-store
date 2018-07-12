 <style lang="less">
	.slide-fade-enter-active {
	  transition: all .5s ease;
	}
	.slide-fade-leave-active {
	  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}
	.slide-fade-enter, .slide-fade-leave-to{
	  transform: translateX(10px);
	  opacity: 0;
	}
    @import "../../styles/common.less";
</style>

<template>
	<div>
		<Row span="24">
			<Col span="24" class="padding-right-4">
				<Card>
					<loading v-bind:spinShow='typeShow'></loading>
					<p slot="title">
                        <Icon type="ios-list"></Icon>
                        商品类型
                    </p>
                    <Row>
						<Table :data="productTypeData" :columns="productTypeColumns"
					height="500" @on-row-click="chooseComboSku" :row-class-name="rowClassName"></Table>
					</Row>
				</Card>
			</Col>
		</Row>
	</div>
</template>

<script>
import loading from '../loading/loading'
import axios from 'axios'
import {baseUrl} from '../../conf/env'
import {setCookie, getCookie, removeCookie} from '@/conf/cookie'
export default {
    props:["productTypeList","isMutilple"],
    components: {
        loading
    },
    data () {
    	 const primaryIdValite  = (rule, value, callback) => {
            if (!value) {
                callback(new Error('所属一级类别为必选！'));
            }
            callback();         
        };
        return {
        	//商品类型
        	typeShow:false,
        	isAddType:false,
            productType:{
            	name:'',
            	description:'',
            },
            productTypeValidate:{
            	name:[
            		{ required: true, message: '类型名称不能为空', trigger: 'blur' }
            	],
            },
            productTypeData: [],
            productTypeColumns:[
                {
                    type: 'index',
                    title: '序号',
                },
            	{
                    title: '名称',
                    key: 'name'
                },
                {
                    title: '描述',
                    key: 'description'
                },
            ],
        };
    },
    computed: {
        
    },
    created(){
    	this.init();
    },
    methods:{
        chooseComboSku(row,index){
            //判断是否多选
            if(this.isMutilple == 1){
                let flag = true;
                for(let i = 0 ; i < this.productTypeList.length ; i ++){
                    if(this.productTypeList[i].id == row.id){
                        this.productTypeList.splice(i,1);
                        flag = false;
                    }
                }
                if(flag == true){
                    this.productTypeList.push(row);
                }
            }else{
                this.productTypeList.splice(0,this.productTypeList.length);
                this.productTypeList.push(row);
                this.$emit("chooseProductType");
            }
        },
        rowClassName(row, index){
            //console.log(this.productTypeList);
            for(let i = 0 ; i < this.productTypeList.length ; i ++){
            	if(this.productTypeList[i].id == row.id){
                    return 'demo-table-info-row';
            	}
            }
	        return '';
    	},
    	error (nodesc) {
            this.$Notice.error({
                title: '错误',
                desc: nodesc 
            });
        },
    	init(){
    		this.getProductType();
    	},
    	getProductType(){
            axios({
                method:'get',
                url:baseUrl + '/product/findAllProductType',
                params:{
                    pageSize:1000,
                    currentPage:1
                },
                responseType:'json'
            }).then(res=> {
                //console.log(res)
                if(res.data.result == -2){
                    console.log(res);
                    this.error("请求失败,获取商品类型错误！");
              }else{
                    //this.productTypeData = res.data;
                    this.productTypeData = res.data.list;
              }
              })
              .catch(res=> {
                  console.log(res);
                  this.error("请求失败,获取商品类型错误！");
              });
             
    	}
    }
};

</script>