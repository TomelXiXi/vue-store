<style lang="less">
    @import "../../../styles/common.less";
    @import "./add-product.less";
</style>

<template>
    <div>
    	<!--商品信息区域-->
    	<Row>
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        新增商品       
                    </p>
                    <Form ref="formValidate" label-position="left" :model="formValidate" :rules="ruleValidate" :label-width="120">
                    <Row type="flex"  align="middle">
                        <Col span="8">               	
	                    	<FormItem prop="name" label="商品名称" >
	                    	    <Input disabled v-model="formValidate.name" placeholder="请填写商品名称..." class="form-element-base" ></Input>
	                        </FormItem>
                        </Col>
                        <Col offset="5" span="8">  
	                    	<FormItem prop="supplierCode" label="商品编码" >
	                    	    <Input disabled v-model="formValidate.supplierCode" placeholder="请输入商品编码..." ></Input>
	                        </FormItem>
                        </Col>
                    </Row>
                    <!--<Row class="margin-top-8" type="flex"  align="middle"></Row> -->
                    <Row class="margin-top-8" type="flex"  align="middle">
                    	<Col span="8">  
		                    <FormItem prop="brandId" label="品牌" >
		                	    <Select disabled v-model="formValidate.brandId">
		                            <Option v-for="item in formValidate.brandIdList" :value="item.value" :key="item.value">{{ item.label }}</Option>
		                        </Select>
		                    </FormItem>
                        </Col>
                        <Col offset="5" span="8">  
	                        <FormItem prop="productTypeId" label="商品类别"  >
	                            <Select disabled v-model="formValidate.productTypeId" >
	                                <Option v-for="item in formValidate.productTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
	                            </Select>
	                        </FormItem>
	                    </Col>
                    </Row>
                    <!--  <Row class="margin-top-8" type="flex"  align="middle"></Row> -->
                    <Row class="margin-top-8" type="flex"  align="middle">
                    	<Col span="8">  
	                    	<FormItem prop="isVirtua" label="是否虚拟商品" >
	                    	     <i-switch disabled  v-model="formValidate.isVirtua" ></i-switch>
	                        </FormItem>
                        </Col>
                    </Row>
                    </Form>
                </Card>
            </Col>
        </Row>
        <!--skuList区域-->
        <Row >
            <div v-for="(item,index) in skuFormValidate.skuList" >
	            <Col span="12" class="margin-top-8 padding-left-10">
	                <Card>
	                    <p slot="title">
	                        <Icon type="ios-list"></Icon>
	                        sku详细信息-{{index + 1}}
	                        <a href="#" slot="extra" @click.prevent="delFormSkuList(index)" class="ivu-card-extra" v-if="index+1 > skuInitSize">
					            <Icon type="close-circled"></Icon>
					            关闭
					        </a> 
	                    </p>
	                    <Form :ref="'skuListForm-' + index" label-position="left" :model="skuFormValidate" :label-width="90" >
	                    <Row type="flex"  align="middle">
	                        <Col span="11">               	
		                    	<FormItem :prop="'skuList.' + index + '.name'" label="sku名称" 
                                :rules="{required: true, message: 'sku名称不能为空', trigger: 'blur'}"  v-if="index+1 <= skuInitSize">
		                    	    <Input v-model="item.name" disabled placeholder="请填写sku名称..." class="form-element-base"></Input>
		                        </FormItem>
                                <FormItem :prop="'skuList.' + index + '.name'" label="sku名称" 
                                :rules="{required: true, message: 'sku名称不能为空', trigger: 'blur'}"  v-if="index+1 > skuInitSize">
                                    <Input v-model="item.name"  placeholder="请填写sku名称..." class="form-element-base"></Input>
                                </FormItem>
	                        </Col>
	                        <Col offset="2" span="11">  
		                    	<FormItem :prop="'skuList.' + index + '.extCode1'" label="sku编码"  v-if="index+1 <= skuInitSize">
		                    	    <Input disabled v-model="item.extCode1" placeholder="请输入sku编码..." ></Input>
		                        </FormItem>
                                <FormItem :prop="'skuList.' + index + '.extCode1'" label="sku编码"   v-if="index+1 > skuInitSize">
                                    <Input v-model="item.extCode1" placeholder="请输入sku编码..." ></Input>
                                </FormItem>
	                        </Col>
	                    </Row>
	                    <Row  type="flex"  align="middle">
	                    	<Col span="11">  
		                    	<FormItem :prop="'skuList.' + index + '.barCode'" label="条形码" v-if="index+1 <= skuInitSize">
		                    	    <Input disabled v-model="item.barCode" placeholder="请输入条形码..." ></Input>
		                        </FormItem>
                                <FormItem :prop="'skuList.' + index + '.barCode'" label="条形码" v-if="index+1 > skuInitSize">
                                    <Input v-model="item.barCode" placeholder="请输入条形码..." ></Input>
                                </FormItem>
	                        </Col>
	                        <Col offset="2" span="11">  
                                <FormItem :prop="'skuList.' + index + '.color'" label="sku颜色" v-if="index+1 <= skuInitSize">
                                    <Input disabled v-model="item.color" placeholder="请输入颜色..." ></Input>
                                </FormItem>
                                <FormItem :prop="'skuList.' + index + '.color'" label="sku颜色" v-if="index+1 > skuInitSize">
                                    <Input v-model="item.color" placeholder="请输入颜色..." ></Input>
                                </FormItem>
	                        </Col>
	                    </Row>
	                    <Row  type="flex"  align="middle">
	                    	<Col span="11">  
		                    	<FormItem :prop="'skuList.' + index + '.price'" label="sku价格"  
                                :rules="{ required:true,validator: validatePrice, trigger: 'blur' }" v-if="index+1 <= skuInitSize">
		                    	    <Input disabled v-model="item.price" placeholder="请输入sku价格..." ></Input>
		                        </FormItem>
                                <FormItem :prop="'skuList.' + index + '.price'" label="sku价格"  
                                :rules="{ required:true,validator: validatePrice, trigger: 'blur' }" v-if="index+1 > skuInitSize">
                                    <Input v-model="item.price" placeholder="请输入sku价格..." ></Input>
                                </FormItem>
	                        </Col>
	                        <Col offset="2" span="11">  
		                    	<FormItem :prop="'skuList.' + index + '.skuSize'" label="sku规格" v-if="index+1 <= skuInitSize">
		                    	    <Input disabled v-model="item.skuSize" placeholder="请输入规格..." ></Input>
		                        </FormItem>
                                <FormItem :prop="'skuList.' + index + '.skuSize'" label="sku规格" v-if="index+1 > skuInitSize">
                                    <Input v-model="item.skuSize" placeholder="请输入规格..." ></Input>
                                </FormItem>
	                        </Col>
	                    </Row>
	                    <Row class="margin-top-8" type="flex"  align="middle" >
                            <Col span="11">
                                <FormItem :prop="'skuList.' + index + '.isRepeat'" label="重复购买" v-if="index+1 <= skuInitSize">
                                     <i-switch v-model="item.isRepeat" disabled></i-switch>
                                </FormItem>
                                <FormItem :prop="'skuList.' + index + '.isRepeat'" label="重复购买" v-if="index+1 > skuInitSize">
                                     <i-switch v-model="item.isRepeat" ></i-switch>
                                </FormItem>
                            </Col>
	                    	<Col span="11" offset="2" v-if="formValidate.isVirtua == true">  
                                <FormItem :prop="'skuList.' + index + '.virtuaPropertyId'" label="虚拟信息"
                                 :rules="{required: true, message: '虚拟信息不能为空', trigger: 'change',type:'number'}" v-if="index+1 <= skuInitSize">
                                    <Select disabled v-model="item.virtuaPropertyId">
                                        <Option v-for="item in skuVirtuaPropertyList" :value="item.value" :key="item.label">{{ item.label }}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem :prop="'skuList.' + index + '.virtuaPropertyId'" label="虚拟信息"
                                 :rules="{required: true, message: '虚拟信息不能为空', trigger: 'change',type:'number'}" v-if="index+1 > skuInitSize">
                                    <Select v-model="item.virtuaPropertyId">
                                        <Option v-for="item in skuVirtuaPropertyList" :value="item.value" :key="item.label">{{ item.label }}</Option>
                                    </Select>
                                </FormItem>
	                        </Col>
	                    </Row>
                        <Row  type="flex"  align="middle">
                            <Col span="10" >  
                                <FormItem label="封面图片" :prop="'skuList.' + index + '.url'"  :rules="{validator: validateUrl }" class="margin-top-10" >
                                    <Upload name="fileField" 
                                            :action='uploadUrl'
                                            :on-success="uploadSuccess"
                                            :on-error="uploadError"
                                            :show-upload-list="false"
                                            :default-file-list="defaultList">
                                        <Button type="ghost" icon="ios-cloud-upload-outline" long @click="changeCurrentIndex($event)"
                                         :name="'upload_url_but' + index" disabled v-if="index+1 <= skuInitSize">上传封面图片</Button>
                                         <Button type="ghost" icon="ios-cloud-upload-outline" long @click="changeCurrentIndex($event)"
                                         :name="'upload_url_but' + index" v-if="index+1 > skuInitSize">上传封面图片</Button>
                                    </Upload>
                                </FormItem>
                            </Col>
                            <Col>
                                <img :src="item.url" style="width:auto;height:80px">
                            </Col>
                        </Row>
	                    </Form> 
	                </Card>
	            </Col>
            </div>
        	<Col span="12" class="margin-top-8 padding-left-10">
                <Card>
                   <div  style="height:380px" class="flex-middle-but">
                   	    <Button type="dashed" icon="plus-round" @click="addSkuList" size="large">添加sku</Button>
                   </div>
                </Card>
            </Col>
        </Row>
        <!--按钮区域-->
        <Row class="margin-top-8" type="flex"  align="middle" justify="end">
        	<Button type="primary" @click="addProduct('formValidate')">确认新增</Button>
        	<Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </Row>
    </div>
</template>

<script>
import axios from 'axios';
import {baseUrl} from '../../../conf/env';
import {setCookie, getCookie, removeCookie} from '@/conf/cookie'
export default {
    data () {
        return {
            currentIndex:'',
            uploadUrl:baseUrl + "/fileController/uploadFile",
            defaultList:[],
        	skuVirtuaPropertyList:[],
            productId:'',
            skuInitSize:0,
        	skuFormValidate:{
        		skuList:[
                    {
                        extCode1:'',
                        name:'',
                        barCode:'',
                        url:'',
                        price:'',
                        skuSize:'',
                        color:'',
                        virtuaPropertyId:'',
                        isRepeat:true,
                     }
        		],
        	},
        	formValidate:{
        		name:'',
	            isVirtua:true,
	            supplierCode:'',
	            brandId:'',
	            productTypeId:'',
	            productTypeList:[],
	            brandIdList:[],
        	},
        	ruleValidate: {
                    name: [
                        { required: true, message: '商品名称不能为空', trigger: 'blur' }
                    ],
                    /*supplierCode:[
                        { required: true, message: '商品编码不能为空', trigger: 'blur' }
                    ],*/
                    brandId:[
                        { required: true, message: '所属品牌为必选项', trigger: 'change', type:'number' }
                    ],
                    productTypeId:[
                        { required: true, message: '商品类型为必选项', trigger: 'change', type:'number' }
                    ]
            }
            
        };
    },
    computed: {
        
    },
    created(){
    	this.init();
    },
    methods:{
        //验证价格
        validatePrice (rule, value, callback){
            if (!value) {
                callback(new Error('价格不能为空'));
            }
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确金额'));
            } else{
                callback();
            }
        },
        changeCurrentIndex(event){
            let name = event.currentTarget.name;
            this.currentIndex = name.substring(name.indexOf("upload_url_but")+14,name.length);
            //console.log("currentIndex===:" + this.currentIndex);
        },
        //验证图片
        validateUrl(rule, value, callback){
            callback();
        },
        uploadSuccess(res,file){
            if(res.result == 1){
                this.skuFormValidate.skuList[this.currentIndex].url = res.url;
            }else{
                console.log(res);
                this.error("图片上传失败！");
            }
        },
        uploadError(res,file){
            console.log(res);
            this.error("图片上传失败！");
        },
    	error (nodesc) {
            this.$Notice.error({
                title: '错误',
                desc: nodesc 
            });
        },
    	init(){
    		//获取所有的商品类型
            axios({
                method:'get',
                url:baseUrl + '/product/findAllProductType',
                params:{
                    currentPage:1,
                    pageSize:1000
                },
                responseType:'json'
            }).then(res=> {
            	  this.formValidate.productTypeList = [];
            	  for(var i = 0 ; i < res.data.list.length ; i++){
            	  	var productTypeSingle = {
            	  	    value:res.data.list[i].id,
            	  	    label:res.data.list[i].name
            	  	}
            	  	this.formValidate.productTypeList.push(productTypeSingle);
            	  }
              })
              .catch(res=> {
                  console.log(res);
                  this.error("服务器请求失败！");
              });
            //获取所有的品牌
            axios({
                method:'get',
                url:baseUrl + '/product/findAllBrand',
                params:{
                    currentPage:1,
                    pageSize:1000
                },
                responseType:'json'
            }).then(res=> {
            	//console.log(res);
            	this.formValidate.brandIdList = [];
            	  for(var i = 0 ; i < res.data.list.length ; i++){
            	  	var brandIdSingle = {
            	  	    value:res.data.list[i].id,
            	  	    label:res.data.list[i].name
            	  	}
            	  	this.formValidate.brandIdList.push(brandIdSingle);
            	  }

              })
              .catch(res=> {
                  console.log(res);
                  this.error("服务器请求失败！");
              });
             //获取所有虚拟商品属性
              axios({
                method:'get',
                url:baseUrl + '/skuVirtuaProperty/findAllSkuVirtuaProperty',
                params:{
                    currentPage:1,
                    pageSize:1000
                },
                responseType:'json'
            }).then(res=> {
            	//console.log(res);
            	this.skuVirtuaPropertyList = [];
            	for(var i = 0 ; i < res.data.list.length ; i ++){
            		var skuVirtuaPropertySingle = {
            			value:res.data.list[i].id,
            			label:res.data.list[i].name
            		}
            		//console.log(skuVirtuaPropertySingle);
                    this.skuVirtuaPropertyList.push(skuVirtuaPropertySingle);
            	}
                
              })
              .catch(res=> {
                  console.log(res);
                  this.error("服务器请求失败！");
              });
              //通过productId获取商品信息
              axios({
                method:'get',
                url:baseUrl + '/product/findProductById',
                params:{
                    id:this.$route.query.productId
                },
                responseType:'json'
            }).then(res=> {
                //console.log(res);
                this.productId=res.data.id;
                this.formValidate.name=res.data.name;
                this.formValidate.isVirtua=res.data.isVirtua;
                this.formValidate.supplierCode=res.data.supplierCode;
                this.formValidate.productTypeId=res.data.productTypeId;
                this.formValidate.brandId=res.data.brandId;
                this.skuFormValidate.skuList=res.data.skuList;
                this.skuInitSize=this.skuFormValidate.skuList.length;
                for(var i = 0 ; i < this.skuFormValidate.skuList.length ; i ++){
                    this.skuFormValidate.skuList[i].createTime='';
                    this.skuFormValidate.skuList[i].updateTime='';
                }
              })
              .catch(res=> {
                  console.log(res);
                  this.error("服务器请求失败！");
              });
                /*this.productId=1;
                this.formValidate.name="麦田数学";
                this.formValidate.isVirtua=true;
                this.formValidate.supplierCode="product-code-01";
                this.formValidate.productTypeId=1;
                this.formValidate.brandId=1;*/
    	}, 
        addProduct(name){
        	var skuFormValidFlag = 1;
        	for(var i = 0 ; i < this.skuFormValidate.skuList.length ; i ++ ){
        		var skuFormName = 'skuListForm-' + i;
                this.$refs[skuFormName][0].validate((valid) => {
                	if(!valid){
                		skuFormValidFlag = 0;
                	}
                })
        	}
         
            this.$refs[name].validate((valid) => {
                if (valid) {
                	if(skuFormValidFlag == 1){
                        var skuListAdd = [];
                        for(var i = this.skuInitSize ; i < this.skuFormValidate.skuList.length ; i ++){
                            var skuListAddSingle = {
                                extCode1:this.skuFormValidate.skuList[i].extCode1,
                                name:this.skuFormValidate.skuList[i].name,
                                barCode:this.skuFormValidate.skuList[i].barCode,
                                url:this.skuFormValidate.skuList[i].url,
                                price:this.skuFormValidate.skuList[i].price,
                                skuSize:this.skuFormValidate.skuList[i].skuSize,
                                color:this.skuFormValidate.skuList[i].color,
                                virtuaPropertyId:this.skuFormValidate.skuList[i].virtuaPropertyId
                            }
                            skuListAdd.push(skuListAddSingle);
                        }
                        //console.log(skuListAdd);
		                axios({
		                method:'post',
		                url:baseUrl + '/product/createProduct',
		                params:{
                            id:this.productId,
		                    supplierCode:this.formValidate.supplierCode,
		                    brandId:this.formValidate.brandId,
		                    name:this.formValidate.name,
		                    productTypeId:this.formValidate.productTypeId,
		                    isVirtua:this.formValidate.isVirtua,
		                    userId:getCookie('userId'),
		                    skuListStr:JSON.stringify(skuListAdd),
		                },
		                responseType:'json'
		                }).then(res=> {
			            	//console.log(res);
			            	if(res.data.status == 1){
			            		this.$Message.success('保存成功!');
				                this.$router.push({
					                name:"productList"
					            })
			            	}else{
			            		this.error(res.data.msg);
			            	}
		                })
			            .catch(res=> {
			                  console.log(res);
			                  this.error("服务器请求失败！");
			            });
                	}else{
                		this.$Message.error('填写有误!');
                	}
	            } else {
                    this.$Message.error('填写有误!');
                    return false;
	            }
            })
        },
        handleReset (name) {
            this.$refs[name].resetFields();
            for(var i = 0 ; i < this.skuFormValidate.skuList.length ; i ++ ){
        		var skuFormName = 'skuListForm-' + i;
                this.$refs[skuFormName][0].resetFields();
        	}
        },
        addSkuList(){
        	var skuSingle = {
                                extCode1:'',
    		                    name:'',
    		                    barCode:'',
    		                    url:'',
    		                    price:'',
    		                    skuSize:'',
    		                    color:'',
    		                    virtuaPropertyId:'',
                                isRepeat:true
                                }
        	this.skuFormValidate.skuList.push(skuSingle);
        },
        delFormSkuList(index){
            this.skuFormValidate.skuList.splice(index,1);
        }
    }
};
</script>