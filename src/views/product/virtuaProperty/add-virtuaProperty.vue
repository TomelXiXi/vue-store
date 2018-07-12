<style lang="less">
    @import "../../../styles/common.less";
</style>

<template>
    <div>
    	<!--商品信息区域-->
    	<Row>
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        新增虚拟属性       
                    </p>
                    <Form ref="formValidate" label-position="left" :model="formValidate" :rules="ruleValidate" :label-width="120">
                    <Row type="flex"  align="middle">
                        <Col span="8">                  
                            <FormItem prop="name" label="课程名称" >
                                <Input v-model="formValidate.name" placeholder="请输入课程名称..." ></Input>
                            </FormItem>
                        </Col>
                       <Col offset="5" span="8">                
                            <FormItem prop="classType" label="课程类型" >
                                <Select v-model="formValidate.classType" >
                                    <Option v-for="item in classTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex"  align="middle">
                        <Col span="8">               	
	                    	<FormItem prop="type" label="虚拟属性类型" >
	                    	    <Select v-model="formValidate.type" >
	                                <Option v-for="item in skuVirtuaPropertyTypList" :value="item.value" :key="item.value">{{ item.label }}</Option>
	                            </Select>
	                        </FormItem>
                        </Col>
                    </Row>
                    <!--<Row class="margin-top-8" type="flex"  align="middle"></Row> -->
                    <Row class="margin-top-8" type="flex"  align="middle" v-if="formValidate.type == 4">
                    	<Col span="8">               	
	                    	<FormItem prop="startClass" label="充值起始课程" >
	                    	    <Input v-model="formValidate.startClass" placeholder="请输入起始课程..." ></Input>
	                        </FormItem>
                        </Col>
                        <Col offset="5" span="8">  
	                    	<FormItem prop="endClass" label="充值结束课程" >
	                    	    <Input v-model="formValidate.endClass" placeholder="请输入结束课程..." ></Input>
	                        </FormItem>
                        </Col>
                    </Row>
                    <Row class="margin-top-8" type="flex"  align="middle">
                        <Col span="8" v-if="formValidate.type == 3">  
	                    	<FormItem prop="classNum" label="充值课程数" >
	                    	    <Input v-model="formValidate.classNum" placeholder="请输入充值课程数..." ></Input>
	                        </FormItem>
                        </Col>
                    </Row>
                    </Form>
                </Card>
            </Col>
        </Row>
       
        <!--按钮区域-->
        <Row class="margin-top-8" type="flex"  align="middle" justify="end">
        	<Button type="primary" @click="addProduct('formValidate')">{{butName}}</Button>
        	<Button type="ghost" @click="returnList" style="margin-left: 8px">取消</Button>
        </Row>
    </div>
</template>

<script>
import axios from 'axios';
import {baseUrl} from '../../../conf/env';
import {setCookie, getCookie, removeCookie} from '@/conf/cookie'
export default {
    data () {
    	const classNumValidate = (rule, value, callback) => {
    		var reg = /^[+]{0,1}(\d+)$/;
            if(this.formValidate.type == 3){
                if(value == '' || value == 0){
                	callback(new Error('按课程数充值时,充值课程数不能为空！'));
                }else{
                	if(!reg.test(value)){
                        callback(new Error('充值课程必须为正整数！'));
                	}else{
                		callback();
                	}
                	
                }            
            }else{
            	callback();
            }
        };
        const startClassValidate = (rule, value, callback) => {
        	var reg = /^[+]{0,1}(\d+)$/;
            if(this.formValidate.type == 4){
                if(value == '' || value == 0){
                	callback(new Error('按起始课程充值时,起始课程不能为空！'));
                }else{
                	if(!reg.test(value)){
                        callback(new Error('充值课程必须为正整数！'));
                	}else{
                		callback();
                	}
                }            
            }else{
            	callback();
            }
        };
        const endClassValidate = (rule, value, callback) => {
        	var reg = /^[+]{0,1}(\d+)$/;
            if(this.formValidate.type == 4){
                if(value == '' || value == 0){
                	callback(new Error('按起始课程充值时,结束课程不能为空！'));
                }else{
                	if(!reg.test(value)){
                        callback(new Error('充值课程必须为正整数！'));
                	}else{
                		callback();
                	}
                }            
            }else{
            	callback();
            }
        };
        return {
            skuVirtuaPropertyTypList:[],
            classTypeList:[],
            butName:'确认新增',
        	formValidate:{
        		type:'',
                classNum:0,
                startClass:0,
                endClass:0,
                classType:'',
        	},
        	ruleValidate: {
                name:[
                    {required:true,message:'课程名称不能为空', trigger: 'blur'}
                ],
        		type:[
                    {required:true,message:'虚拟属性类型为必选项', trigger: 'change'}
                ],
                classNum:[
                    { validator:classNumValidate, trigger: 'blur' }
                ],
                startClass:[
                    { validator:startClassValidate, trigger: 'blur' }
                ],
                endClass:[
                    { validator:endClassValidate, trigger: 'blur' }
                ],
                classType:[
                    { required:true,message:'课程类型不能为空', trigger: 'change' }
                ],
            }
            
        };
    },
    computed: {
        
    },
    created(){
    	this.init();
    },
    methods:{
    	error (nodesc) {
            this.$Notice.error({
                title: '错误',
                desc: nodesc 
            });
        },
    	init(){
            //console.log(this.$route.query.id)
            this.getVirtuaPropertyTyp();      
    	}, 
        getVirtuaPropertyTyp(){
            //获取所有的虚拟商品类型
            axios({
                method:'get',
                url:baseUrl + '/chooseOption/findChooseOptionByCodeAvailable',
                params:{
                    categoryCode:"skuVirtuaPropertyTyp"
                },
                responseType:'json'
            }).then(res=> {
                //console.log(res)
                if(res.data.result == -2){
                    console.log(res);
                this.error("请求失败,获取虚拟商品类型错误！");
              }else{
                for(var i = 0 ; i < res.data.length ; i ++){
                    var skuVirtuaPropertyTypSingle = {
                        value:res.data[i].optionKey,
                        label:res.data[i].optionValue
                    }
                    this.skuVirtuaPropertyTypList.push(skuVirtuaPropertyTypSingle);
                }
                console.log(this.skuVirtuaPropertyTypList)
                this.getClassType();
              }
                
              })
              .catch(res=> {
                  console.log(res);
                  this.error("请求失败,获取虚拟商品类型错误！");
              });
        },
        getClassType(){
            //获取所有课程类型
              axios({
                method:'get',
                url:baseUrl + '/chooseOption/findChooseOptionByCodeAvailable',
                params:{
                    categoryCode:"classType"
                },
                responseType:'json'
            }).then(res=> {
                //console.log(res)
                if(res.data.result == -2){
                    console.log(res);
                this.error("请求失败,获取课程类型错误！");
              }else{
                for(var i = 0 ; i < res.data.length ; i ++){
                    var classTypeSingle = {
                        value:res.data[i].optionKey,
                        label:res.data[i].optionValue
                    }
                    this.classTypeList.push(classTypeSingle);
                }
                this.getById();
              }
                
              })
              .catch(res=> {
                  console.log(res);
                  this.error("请求失败,获取课程类型错误！");
              });
        },
        getById(){
            if(this.$route.query.id != undefined){
                this.butName='确认修改'
                axios({
                    method:'get',
                    url:baseUrl + '/skuVirtuaProperty/findById',
                    params:{
                        id:this.$route.query.id
                    },
                    responseType:'json'
                }).then(res=> {
                    console.log(res)
                    this.formValidate=res.data;
                    this.formValidate.type = JSON.stringify(res.data.type);
                    
                })
                .catch(res=> {
                      console.log(res);
                      this.error("请求失败,获取虚拟商品类型错误！");
                });
            }
        },
        addProduct(name){
            var data = this.formValidate;         
            this.$refs[name].validate((valid) => {
                if (valid) {
		                axios({
		                method:'post',
		                url:baseUrl + '/skuVirtuaProperty/createSkuVirtuaProperty',
		                params:{
                            id:this.$route.query.id,
		                    type:this.formValidate.type,
			                classNum:this.formValidate.classNum,
			                startClass:this.formValidate.startClass,
			                endClass:this.formValidate.endClass,
			                classType:this.formValidate.classType,
                            name:this.formValidate.name,
			                userId:getCookie("userId")
		                },
		                responseType:'json'
		                }).then(res=> {
			            	console.log(res);
			            	if(res.data.status == 1){
			            		this.$Message.success('保存成功!');
				                this.$router.push({
					                name:"virtuaPropertyList"
					            })
			            	}else{
			            		this.error(res.data.msg);
			            	}
		                })
			            .catch(res=> {
			                  console.log(res);
			                  this.error("服务器请求失败！");
			            });
	            } else {
                    this.$Message.error('填写有误!');
                    return false;
	            }
            })
        },
        returnList () {
            this.$router.push({
                name: 'virtuaPropertyList'
            });
        },
        addSkuList(){
        	var skuSingle = {extCode1:'',
		                     name:'',
		                     barCode:'',
		                     url:'',
		                     price:'',
		                     skuSize:'',
		                     color:'',
		                     virtuaPropertyId:''}
        	this.skuFormValidate.skuList.push(skuSingle);
        },
        delFormSkuList(index){
            this.skuFormValidate.skuList.splice(index,1);
            //console.log(this.skuFormValidate.skuList);
        }
    }
};
</script>