<style lang="less">
    @import "../../styles/common.less";
</style>

<template>
    <div>
    	<!--商品信息区域-->
    	<Row>
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        新增配置信息      
                    </p>
                    <Form ref="formValidate" label-position="left" :model="formValidate" :rules="ruleValidate" :label-width="120">
                    <Row type="flex"  align="middle">
                        <Col span="8">                  
                            <FormItem prop="remark" label="配置名称：" >
                                <Input v-model="formValidate.remark" placeholder="请输入配置信息名称..." ></Input>
                            </FormItem>
                        </Col>
                       <Col offset="5" span="8">                
                            <FormItem prop="extCondition1" label="配置来源：" >
                                <Select v-model="formValidate.extCondition1"   placeholder="选择配置来源">
	                                <Option v-for="item in popupSourceList" :value="item.optionKey" :key="item.optionKey">{{ item.optionValue }}</Option> 
	                            </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row class="margin-top-8" type="flex"  align="middle">
                    	<Col span="8">               	
	                    	<FormItem prop="channelsId" label="渠道：" >
	                    	    <Select v-model="formValidate.channelsId" placeholder="选择渠道...">
		                            <Option v-for="item in channelsList" :value="item.optionKey" :key="item.optionKey">{{ item.description }}</Option>
		                        </Select>
	                        </FormItem>
                        </Col>
                        <Col offset="5" span="8">  
	                    	<FormItem prop="versionsId" label="版本号：" >
	                    	    <Select v-model="formValidate.versionsId"   placeholder="选择版本号">
	                                <Option v-for="item in versionsList" :value="item.optionKey" :key="item.optionKey">{{ item.optionValue }}</Option> 
	                            </Select>
	                        </FormItem>
                        </Col>
                    </Row>
                    <Row class="margin-top-8" type="flex"  align="middle">
                    	<Col span="8">               	
	                    	<FormItem prop="appNamesId" label="包名：" >
	                    	    <Select v-model="formValidate.appNamesId"   placeholder="选择包名">
	                                <Option v-for="item in appNamesList" :value="item.optionKey" :key="item.optionKey">{{ item.description }}</Option> 
	                            </Select>
	                        </FormItem>
                        </Col>
                        <Col offset="5" span="8">  
	                    	<FormItem prop="deviceTypesId" label="设备类型：" >
	                    	    <Select v-model="formValidate.deviceTypesId"   placeholder="选择打开方式">
	                                <Option v-for="item in deviceTypesList" :value="item.optionKey" :key="item.optionKey">{{ item.optionValue }}</Option> 
	                            </Select>
	                        </FormItem>
                        </Col> 
                    </Row>
                    <Row class="margin-top-8" type="flex"  align="middle">
                    	<Col span="8">               	
	                    	<FormItem prop="popupIndex" label="优先级：" >
	                    	    <InputNumber :max="10" :min="1" v-model="formValidate.popupIndex"></InputNumber>
	                        </FormItem>
                        </Col>
                        <Col offset="5" span="8">  
                            <FormItem prop="openMode" label="打开方式：" >
                                <Select v-model="formValidate.openMode"   placeholder="选择打开方式">
                                    <Option v-for="item in openModeList" :value="item.optionKey" :key="item.optionKey">{{ item.optionValue }}</Option> 
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    </Form>
                    <Row class="margin-top-8" type="flex"  align="middle" justify="end">
                        <Button type="primary" @click="addPopup('formValidate')">确认新增</Button>
                        <Button type="ghost" @click="cancleAdd" style="margin-left: 8px">取消</Button>
                    </Row>
                    <loading v-bind:spinShow='spinShow'></loading>
                </Card>
            </Col>
        </Row>
        <!--按钮区域-->
    </div>
</template>

<script>
import axios from 'axios';
import {baseUrl} from '@/conf/env';
import loading from '../loading/loading';
import {setCookie, getCookie, removeCookie} from '@/conf/cookie';
export default {
    components:{
        loading
    },
    data () {
        const remarkValidate = (rule, value, callback) => {
            if(!value){
                callback(new Error('配置名称不能为空'));
            }
            axios({
                method:'get',
                url:baseUrl + '/popup/findByRemark',
                params:{
                    remark:value
                },
                responseType:'json'
            }).then(res=> {
                console.log(res)
                if(res.data.status != 1){
                    callback(new Error(res.data.msg));
                }else{
                    callback();
                }
            })
            .catch(res=> {
                console.log(res);
                this.error("服务器请求失败！");
            });
        };
    	const popupIndexValidate = (rule, value, callback) => {
    		var reg = /^[+]{0,1}(\d+)$/;
        	if(!reg.test(value)){
                callback(new Error('充值课程必须为正整数！'));
        	}else{
        		callback();
        	}
        };
        return {
            skuVirtuaPropertyTypList:[],
            classTypeList:[],

            channelsList:[],
        	versionsList:[],
        	appNamesList:[],
        	deviceTypesList:[],
        	popupSourceList:[],
        	openModeList:[],
        	formValidate:{
        		channelsId:'1',
        		addressesId:'1',
                versionsId:'1',
                appNamesId:'1',
                deviceTypesId:'1',
                openMode:'1',
                popupIndex:2,
                timeLimit:'1',
                extCondition1:'1',
                remark:'',
                status:1,

        	},
        	ruleValidate:{
        		remark:[
					{required:true, trigger: 'blur',validator:remarkValidate}
        		],
        		popupIndex:[
        			{ validator:popupIndexValidate, trigger: 'change' ,required:true}
        		]
        	}
        };
    },
    computed: {
        
    },
    created(){
        this.spinShow = true;
    	this.getChannels();
        this.getVersions();
        this.getAppNames();
        this.getDeviceTypes();
        this.getPopupSource();
        this.getOpenMode();
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
    		
    	}, 
        //查询渠道
        getChannels(){
			axios({
                method:'get',
                url:baseUrl + '/chooseOption/findChooseOptionByCodeAvailable',
                params:{
                    categoryCode:"channels"
                },
                responseType:'json'
            }).then(res=> {
            	//console.log(res)
              	this.channelsList = res.data;
            })
            .catch(res=> {
                console.log(res);
                this.error("请求失败,获取虚渠道列表失败！");
            });
        },
        //查询版本号
        getVersions(){
			axios({
                method:'get',
                url:baseUrl + '/chooseOption/findChooseOptionByCodeAvailable',
                params:{
                    categoryCode:"versions"
                },
                responseType:'json'
            }).then(res=> {
            	//console.log(res)
              	this.versionsList = res.data;
            })
            .catch(res=> {
                console.log(res);
                this.error("请求失败,获取版本列表失败！");
            });
        },
        //查询包名
        getAppNames(){
			axios({
                method:'get',
                url:baseUrl + '/chooseOption/findChooseOptionByCodeAvailable',
                params:{
                    categoryCode:"appNames"
                },
                responseType:'json'
            }).then(res=> {
            	//console.log(res)
              	this.appNamesList = res.data;
            })
            .catch(res=> {
                console.log(res);
                this.error("请求失败,获取包名列表失败！");
            });
        },
        //查询设备类型
        getDeviceTypes(){
			axios({
                method:'get',
                url:baseUrl + '/chooseOption/findChooseOptionByCodeAvailable',
                params:{
                    categoryCode:"deviceTypes"
                },
                responseType:'json'
            }).then(res=> {
            	//console.log(res)
              	this.deviceTypesList = res.data;
            })
            .catch(res=> {
                console.log(res);
                this.error("请求失败,获取设备类型列表失败！");
            });
        },
        //查询所有配置信息来源
        getPopupSource(){
			axios({
                method:'get',
                url:baseUrl + '/chooseOption/findChooseOptionByCodeAvailable',
                params:{
                    categoryCode:"popupSource"
                },
                responseType:'json'
            }).then(res=> {
            	//console.log(res)
              	this.popupSourceList = res.data;
              	//console.log(this.popupSourceList)
            })
            .catch(res=> {
                console.log(res);
                this.error("请求失败,获取配置信息来源列表失败！");
            });
        },
        //查询所有打开方式
        getOpenMode(){
			axios({
                method:'get',
                url:baseUrl + '/chooseOption/findChooseOptionByCodeAvailable',
                params:{
                    categoryCode:"openMode"
                },
                responseType:'json'
            }).then(res=> {
            	//console.log(res)
              	this.openModeList = res.data;
                this.spinShow = false;
              	//console.log(this.popupSourceList)
            })
            .catch(res=> {
                console.log(res);
                this.error("请求失败,获取打开方式列表失败！");
                this.spinShow = false;
            });
        },
        cancleAdd(){
            this.$router.push({
                name: 'popup',
            });
        },
        addPopup(name){
        	this.spinShow = true;
            this.$refs[name].validate((valid) => {
                if (!valid) {
                    this.$Message.error('填写有误!');
                }else{
                    axios({
                        method:'post',
                        url:baseUrl + '/popup/addPopup',
                        params:this.formValidate,
                        responseType:'json'
                    }).then(res=> {
                        console.log(res)
                        this.spinShow = false;
                        if(res.data.status == 1){
                            this.$Message.success("保存成功");
                            this.$router.push({
                                name: 'popup',
                            });
                        }else{
                            this.$Message.error(res.data.msg);
                        }
                        
                        //console.log(this.popupSourceList)
                    })
                    .catch(res=> {
                        console.log(res);
                        this.error("请求失败,新增配置信息失败！");
                        this.spinShow = false;
                    });
                }
            })
        }
    }
};
</script>