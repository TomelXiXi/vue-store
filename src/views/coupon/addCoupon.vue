<style lang="less">
    @import "../../styles/common.less";
    @import 'addCoupon.less';
</style>

<template>
    <div>
        <Modal ref="modal"
            v-model="modal"
            v-bind:title='modalTitle'
            width=70%
            loading="loading"
            @on-ok="ok"
            @on-cancel="cancel"
            :transfer="false">      
           <skuSelect  @showModal="showModal()" @hideModal="hideModal()"
            :selectSkuList="selectSkuList" :isMutilple="isMutilple"></skuSelect>
        </Modal>
        <Modal ref="ComboModal"
            v-model="ComboModal"
            v-bind:title='comboModalTitle'
            width=70%
            loading="loading"
            @on-ok="comboOk"
            @on-cancel="comboCancel"
            :transfer="false">      
           <comboSkuSelect @showComboModal="showComboModal()" @hideComboModal="hideComboModal()"
            :comboSkuList="comboSkuList" :isMutilple="isMutilple"></comboSkuSelect>
        </Modal>
        <Modal ref="productModal"
            v-model="productModal"
            v-bind:title='productModalTitle'
            width=60%
            loading="loading"
            @on-ok="productOk"
            @on-cancel="productCancel">      
           <addProductSelect ref="choosePro" @showModal="showProductModal()" @hideModal="hideProductModal()"
           :isMutilple="isMutilple" :productList="productList" ></addProductSelect>
         </Modal>
        <Modal ref="productTypeModal"
            v-model="productTypeModal"
            v-bind:title='productTypeTitle'
            width=60%
            loading="loading"
            @on-ok="productTypeOk"
            @on-cancel="productTypeCancel">      
           <productTypeSelect ref="chooseProType" @showModal="showProductTypeModal()" @hideModal="hideProductTypeModal()"
           :isMutilple="isMutilple" :productTypeList="productTypeList" ></productTypeSelect>
         </Modal>
    	<!--商品信息区域-->
    	<Row>
            <Col span="24">
                <Card>
                    <p slot="title" v-if="$route.query.id == undefined">
                        <Icon type="ios-list"></Icon>
                        新增优惠券      
                    </p>
                    <p slot="title" v-if="$route.query.id != undefined">
                        <Icon type="ios-list" ></Icon>
                        编辑优惠券      
                    </p>
                    <Form ref="formValidate" label-position="left" :model="formValidate" :rules="ruleValidate" :label-width="120">
                    <Row type="flex"  align="middle">
                        <Col span="8">                  
                            <FormItem prop="title" label="优惠券名称：" >
                                <Input v-model="formValidate.title" placeholder="请输入优惠券名称..." ></Input>
                            </FormItem>
                        </Col>
                       <Col offset="5" span="8">                
                            <FormItem prop="time" label="起止时间：" >
	                            <DatePicker type="datetimerange" placeholder="选择起止时间" style="width: 300px" v-model="couponTime"
	                             @on-change="timeChange"></DatePicker>
                            </FormItem>
                        </Col>
                    </Row>

                    <Row class="margin-top-8" type="flex"  align="middle">
                    	<Col span="8">               	
	                    	<FormItem prop="minUsePrice" label="最低使用价：" >
	                    	    <Input v-model="formValidate.minUsePrice" placeholder="请输入最低使用价..." ></Input>
	                        </FormItem>
                        </Col>
                        <Col offset="5" span="8">  
	                    	<FormItem prop="price" label="优惠价：" >
	                    	    <Input v-model="formValidate.price" placeholder="请输入优惠价..." ></Input>
	                        </FormItem>
                        </Col> 
                    </Row>
                    <Row class="margin-top-8" type="flex"  align="middle">
                    	<Col span="8">               	
	                    	<FormItem prop="getType" label="获取类型：" >
	                    	    <Select v-model="formValidate.getType">
                                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option> 
                                </Select>
	                        </FormItem>
                        </Col>
                        <Col offset="5" span="8">  
	                    	<FormItem prop="content" label="备注：" >
	                    	    <Input v-model="formValidate.content" placeholder="请输入备注..." ></Input>
	                        </FormItem>
                        </Col>
                    </Row>
                    <Row class="margin-top-8" type="flex"  align="middle">
                    	<Col span="8">               	
	                    	<FormItem prop="isCommon" label="是否通用：" >
	                    	    <i-switch v-model="formValidate.isCommon" @on-change="changeIsCommon"></i-switch>
	                        </FormItem>
                        </Col>
                        <Col offset="5" span="4">  
	                    	<FormItem prop="imgUrl" label="封面图：" >
	                    	    <Upload name="fileField" 
                                        :action='uploadUrl'
                                        :on-success="uploadUrlSuccess"
                                        :on-error="uploadUrlError"
                                        :show-upload-list="false">
                                    <Button type="ghost" icon="ios-cloud-upload-outline" long>上传封面图片</Button>
                                </Upload>
	                        </FormItem>
                        </Col>
                        <Col offset="1">
                            <img :src="formValidate.imgUrl" style="width:auto;height:80px">
                        </Col>
                    </Row>
                     <Row class="margin-top-8" type="flex"  align="middle" v-if="formValidate.isCommon == false">
                         <Col span="8">               	
	                    	<FormItem prop="isCombo" label="组合商品专用：" >
	                    	    <i-switch v-model="isCombo" @on-change="changeIsCombo"></i-switch>
	                        </FormItem>
                        </Col>
                    	<!-- <Col span="8">               	
	                    	<FormItem prop="popupId" label="配置信息：" >
	                    	    <Select v-model="formValidate.popupId">
                                    <Option v-for="item in popupList" :value="item.id" :key="item.id">{{ item.remark }}</Option> 
                                </Select>
	                        </FormItem>
                        </Col> -->
                    </Row> 
                    </Form>
                </Card>
            </Col>
        </Row>
         <!--选取区域-->
        <Row class="margin-top-8" v-if="isCombo == true && formValidate.isCommon == false">
            <Col span="12" >
                <Card>
                    <p slot="title">
                        <Icon type="ios-paper-outline"></Icon>
                        选取组合商品
                    </p>
                    <Row class="margin-bottom-10"  type="flex" justify="center" >
                        <Button type="primary" size="large" @click="selectComboSku" >选取组合商品</Button>
                    </Row>
                    <div style="height: 300px;">
                        <ul class="iview-admin-draggable-list">
                            <li v-for="(item, index) in comboSkuList" :key="index" class="notwrap" :data-index="index">
                                {{ item.name}}
                            </li>
                        </ul>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-8" v-if="isCombo == false && formValidate.isCommon == false">
            <Col span="8" >
                <Card>
                    <p slot="title">
                        <Icon type="ios-paper-outline"></Icon>
                        选取sku
                    </p>
                    <Row class="margin-bottom-10"  type="flex" justify="center" >
                        <Button type="primary" size="large" @click="selectSku" >选取sku</Button>
                    </Row>
                    <div style="height: 300px;">
                        <ul class="iview-admin-draggable-list">
                            <li v-for="(item, index) in selectSkuList" :key="index" class="notwrap" :data-index="index">
                                {{ item.name}}
                            </li>
                        </ul>
                    </div>
                </Card>
            </Col>
            <Col span="8" class="padding-left-8">
                <Card>
                    <p slot="title">
                        <Icon type="ios-paper-outline"></Icon>
                        选取商品
                    </p>
                    <Row class="margin-bottom-10"  type="flex" justify="center" >
                        <Button type="primary" size="large" @click="showProductModal" >选取商品</Button>
                    </Row>
                    <div style="height: 300px;">
                        <ul class="iview-admin-draggable-list">
                            <li v-for="(item, index) in productList" :key="index" class="notwrap" :data-index="index">
                                {{ item.name}}
                            </li>
                        </ul>
                    </div>
                </Card>
            </Col>
            <Col span="8" class="padding-left-8">
                <Card>
                    <p slot="title">
                        <Icon type="ios-paper-outline"></Icon>
                        选取商品类型
                    </p>
                    <Row class="margin-bottom-10"  type="flex" justify="center" >
                        <Button type="primary" size="large" @click="showProductTypeModal" >选取商品类型</Button>
                    </Row>
                    <div style="height: 300px;">
                        <ul class="iview-admin-draggable-list">
                            <li v-for="(item, index) in productTypeList" :key="index" class="notwrap" :data-index="index">
                                {{ item.name}}
                            </li>
                        </ul>
                    </div>
                </Card>
            </Col>
        </Row>
        <!--按钮区域-->
        <Row class="margin-top-8" type="flex"  align="middle" justify="end">
            <Button type="primary" @click="addPopup('formValidate')" v-if="$route.query.id == undefined">确认新增</Button>
            <Button type="primary" @click="addPopup('formValidate')" v-if="$route.query.id != undefined">确认编辑</Button>
            <Button type="ghost" @click="cancleAdd" style="margin-left: 8px">取消</Button>
        </Row>
        <loading v-bind:spinShow='spinShow'></loading>
    </div>
</template>

<script>
import Sortable from 'sortablejs'
import axios from 'axios'
import {baseUrl} from '@/conf/env'
import loading from '../loading/loading'
import {setCookie, getCookie, removeCookie} from '@/conf/cookie'
import skuSelect from '@/views/product/sku/sku-select.vue'
import comboSkuSelect from '@/views/product/comboSku/comboSku-select.vue'
import addProductSelect from '@/views/product/sku/sku-product-select'
import productTypeSelect from '@/views/type/productType-select.vue'
export default {
    name: 'add-coupon',
    components:{
        loading,skuSelect,comboSkuSelect,addProductSelect,productTypeSelect
    },
    data () {
    	const timeValidate = (rule, value, callback) => {
        	if(!this.formValidate.startTimeStr || !this.formValidate.endTimeStr){
                callback(new Error('起止时间不能为空！'));
        	}else{
        		callback();
        	}
        };
        const minUsePriceValidate = (rule, value, callback) => {
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确金额'));
            } else{
                if(value < this.formValidate.price){
            		callback(new Error('优惠价不能大于最低使用价'));
            	}else{
            		callback();
            	}
            }
        };
        const priceValidate = (rule, value, callback) => {
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确金额'));
            } else{
            	if(value > this.formValidate.minUsePrice){
            		callback(new Error('优惠价不能大于最低使用价'));
            	}else{
            		callback();
            	}
            }
        };
        return {
            couponTime:[],
            isCombo:false,
            modal:false,
            modalTitle:'选取sku',
            ComboModal:false,
            comboModalTitle:'选取组合商品',
            productModal:false,
            productModalTitle:'选取商品',
            productTypeModal:false,
            productTypeTitle:'选取商品类型',
            isMutilple:1,
            selectSkuList:[],
            comboSkuList:[],
            productList:[],
            productTypeList: [],
            step:0,
        	popupList:[],
        	spinShow:false,
        	typeList:[
        		{
	        		value:0,
	        		label:'不可重复获取'
        		},
        		{
        			value:1,
        			label:'可重复获取'
        		}
        	],
        	uploadUrl:baseUrl + "/fileController/uploadFile",
            skuVirtuaPropertyTypList:[],
        	formValidate:{
        		id:'',
        		title:'',
        		couponId:'',
        		couponType:1,
/*        		startTime:'',
        		endTime:'',*/
        		isCommon:false,
        		minUsePrice:0,
        		imgUrl:'',
        		price:0,
        		content:'',
        		resUrl:'',
        		discount:'',
        		getType:0,
        		useType:0,
        		popupId:3,
        		status:1,
        		couponUseType:1,
        		startTimeStr:'',
	    		endTimeStr:''
        	},
        	ruleValidate:{
        		title:[
					{required:true, trigger: 'blur',message:'优惠券名称不能为空'}
        		],
        		time:[
        			{ validator:timeValidate, trigger: 'change' ,required:true}
        		],
        		minUsePrice:[
        			{ validator:minUsePriceValidate, trigger: 'blur' ,required:true}
        		],
        		price:[
        			{ validator:priceValidate, trigger: 'blur' ,required:true}
        		]
        	}
        };
    },
    computed: {
        
    },
    created(){
        //this.spinShow = true;
        this.init();
    },
    methods:{
        changeIsCombo(value){
            //console.log(value);
            if(value == false){
                this.comboSkuList = [];
            }else{
                this.selectSkuList = [];
                this.productList = [];
                this.productTypeList = [];
            }
        },
    	changeIsCommon(value){
            if(value){
                this.comboSkuList = [];
                this.selectSkuList = [];
                this.productList = [];
                this.productTypeList = [];
            }
    	},
    	timeChange(value){
	    	this.formValidate.startTimeStr=value[0];
	    	this.formValidate.endTimeStr=value[1];
	    	//console.log(this.formValidate.startTime,this.formValidate.endTime)
	    },
    	error (nodesc) {
            this.$Notice.error({
                title: '错误',
                desc: nodesc 
            });
        },
    	init(){
            this.spinShow = true;
            this.findAllPopup();
            if(this.$route.query.id != undefined){
                this.findCouponById();
            }            
        },
        findCouponById(){
            let id = this.$route.query.id;
            console.log(id);
            axios({
                method:'get',
                url:baseUrl + '/coupon/findCouponSkuCommandById',
                params:{
                    id:id
                },
                responseType:'json'
            }).then(res=> {
                console.log(res);
                //this.formValidate = res.data;
                this.formValidate.id=res.data.id
        		this.formValidate.title=res.data.title
        		this.formValidate.couponId=res.data.couponId
        		this.formValidate.couponType=res.data.couponType
        		this.formValidate.isCommon=res.data.isCommon
        		this.formValidate.minUsePrice=res.data.minUsePrice
        		this.formValidate.imgUrl=res.data.imgUrl
        		this.formValidate.price=res.data.price
        		this.formValidate.content=res.data.content
        		this.formValidate.discount=res.data.discount
        		this.formValidate.getType=res.data.getType
        		this.formValidate.useType=res.data.useType
        		this.formValidate.popupId=res.data.popupId
        		this.formValidate.status=res.data.status
        		this.formValidate.couponUseType=res.data.couponUseType
                this.couponTime = [];
                this.couponTime.push(res.data.startTime);
                this.couponTime.push(res.data.endTime);
                this.formValidate.startTimeStr=res.data.startTime;
	    	    this.formValidate.endTimeStr=res.data.endTime;
                if(res.data.comboSkuList.length > 0){
                    this.isCombo = true;
                    this.comboSkuList = res.data.comboSkuList;
                }else{
                    this.selectSkuList = res.data.skuList;
                    for(let i = 0 ; i < this.selectSkuList.length ; i ++ ){
                        this.selectSkuList[i].skuId = this.selectSkuList[i].id
                    }
                    this.productList = res.data.productList;
                    this.productTypeList = res.data.productTypeList;
                }
            })
            .catch(res=> {
                console.log(res);
                this.error("获取更新数据失败！");
                this.spinShow = false;
            });
        },
    	//查询配置信息列表
        findAllPopup(){
            axios({
                method:'post',
                url:baseUrl + '/popup/findAllPopup',
                params:{
                    currentPage:1,
                    pageSize:10000,
                    extCondition1:3,
                },
                responseType:'json'
            }).then(res=> {
                //console.log(res);
                this.popupList = res.data.list;
                this.spinShow = false;
            })
            .catch(res=> {
                console.log(res);
                this.error("获取配置信息列表失败！");
                this.spinShow = false;
            });
        },
        addPopup(name){
        	this.spinShow = true;
            this.$refs[name].validate((valid) => {
                if (!valid) {
                    this.$Message.error('填写有误!');
                    this.spinShow = false;
                }else{
                    for(let i = 0 ; i < this.selectSkuList.length ; i ++ ){
                        this.selectSkuList[i].id = this.selectSkuList[i].skuId;
                    }
                    this.formValidate.skuListStr = JSON.stringify(this.selectSkuList);
                    this.formValidate.comboSkuListStr = JSON.stringify(this.comboSkuList);
                    this.formValidate.productListStr = JSON.stringify(this.productList);
                    this.formValidate.productTypeListStr = JSON.stringify(this.productTypeList);
                    console.log(this.formValidate);
                    axios({
                        method:'post',
                        url:baseUrl + '/coupon/addOrUpdateCoupon',
                        params:this.formValidate,
                        responseType:'json'
                    }).then(res=> {
                        console.log(res)
                        this.spinShow = false;
                        if(res.data.status == 1){
                            this.$Message.success("保存成功");
                            this.$router.push({
                                name: 'coupon',
                            });
                        }else{
                            this.$Message.error(res.data.msg);
                        }
                        this.spinShow = false;
                        //console.log(this.popupSourceList)
                    })
                    .catch(res=> {
                        console.log(res);
                        this.error("保存失败");
                        this.spinShow = false;
                    });
                }
            })
        },
        uploadUrlSuccess(res,file){
        	console.log(res);
            if(res.result == 1){
                this.formValidate.imgUrl = res.url;
                this.$Message.success("上传成功");
            }else{
                this.error("封面图片上传失败！");
            }
        },
        uploadUrlError(res,file){
        	console.log(res);
            this.error("封面图片上传失败！");
        },
        cancleAdd(){
        	this.$router.push({
                name: 'coupon',
            });
        },
        ok(){
            this.modal=false;
            console.log(this.selectSkuList);
        },
        cancel(){

        },
        showModal(){
            this.modal=true;
        },
        hideModal(){
            this.modal=false;
        },
        selectSku(){
            this.modal=true;
        },
        comboOk(){
            this.ComboModal=false;
        },
        comboCancel(){

        },
        showComboModal(){
            this.ComboModal = true;
        },
        hideComboModal(){
            this.ComboModal = false;
        },
        selectComboSku(){
            this.ComboModal = true;
        },
        productOk(){
            this.productModal=false;
        },
        productCancel(){
        },
        showProductModal(){
            this.productModal = true;
        },
        hideProductModal(){
            this.productModal = false;
        },
        productTypeOk(){
            this.productTypeModal=false;
        },
        productTypeCancel(){
        },
        showProductTypeModal(){
            this.productTypeModal = true;
        },
        hideProductTypeModal(){
            this.productTypeModal = false;
        },
        minUsePriceValidate(rule, value, callback) {
        	if (value == '') {
                callback(new Error('最低使用价不能为空'));
            }
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确金额'));
            } else{
            	callback();
            }
        },
        priceValidate(rule, value, callback) {
        	if (value == '') {
                callback(new Error('优惠价不能为空'));
            }
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确金额'));
            } else{
            	callback();
            }
        }
    }
};
</script>