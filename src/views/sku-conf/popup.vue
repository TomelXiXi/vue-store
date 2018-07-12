 <style lang="less">
    @import "../../styles/common.less";
</style>

<template>
    <div>
    	<Row>
            <Col span="24" >
                <Card>
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        配置信息列表
                    </p>
<!--                     <Row :style="{marginBottom: '10px'}">
                         <Col span="4" >
                            <Select v-model="selectData.channelsId" placeholder="选择渠道...">
                                <Option v-for="item in channelsList" :value="item.optionKey" :key="item.optionKey">{{ item.optionValue }}</Option>
                            </Select>
                        </Col> 
                        <Col span="4" offset="1">
                            <Select v-model="selectData.versionsIs"   placeholder="选择版本号">
                                <Option v-for="item in versionsList" :value="item.optionKey" :key="item.optionKey">{{ item.optionValue }}</Option> 
                            </Select>
                        </Col> 
                        <Col span="4" offset="1">
                            <Select v-model="selectData.appNamesId"   placeholder="选择包名">
                                <Option v-for="item in appNamesList" :value="item.optionKey" :key="item.optionKey">{{ item.optionValue }}</Option> 
                            </Select>
                        </Col> 
                        <Col span="4" offset="1">
                            <Select v-model="selectData.deviceTypesId"   placeholder="选择设备类型">
                                <Option v-for="item in deviceTypesList" :value="item.optionKey" :key="item.optionKey">{{ item.optionValue }}</Option> 
                            </Select>
                        </Col> 
                        <Col span="4" offset="1">
                            <Select v-model="selectData.extCondition1"   placeholder="选择配置来源">
                                <Option v-for="item in popupSourceList" :value="item.optionKey" :key="item.optionKey">{{ item.optionValue }}</Option> 
                            </Select>
                        </Col> 
                        <Col span="4" offset="1">
                            <Button @click="refresh" type="primary" icon="search">搜索</Button>
                            <Button @click="selectReset" type="ghost">重置</Button>
                        </Col>
                    </Row> -->

	            	<Row :style="{marginBottom: '10px'}">
                     <Col span="4" >
                        <Select v-model="selectData.channelsId" placeholder="选择渠道...">
                            <Option v-for="item in channelsList" :value="item.optionKey" :key="item.optionKey">{{ item.description }}</Option>
                        </Select>
                        </Col> 
                        <Col span="4" offset="1">
                            <Select v-model="selectData.versionsId"   placeholder="选择版本号">
                                <Option v-for="item in versionsList" :value="item.optionKey" :key="item.optionKey">{{ item.optionValue }}</Option> 
                            </Select>
                        </Col>  
                        <Col span="4" offset="1">
                            <Select v-model="selectData.deviceTypesId"   placeholder="选择设备类型">
                                <Option v-for="item in deviceTypesList" :value="item.optionKey" :key="item.optionKey">{{ item.optionValue }}</Option> 
                            </Select>
                        </Col> 
                        <Col span="4" offset="1">
                            <Select v-model="selectData.extCondition1"   placeholder="选择配置来源">
                                <Option v-for="item in popupSourceList" :value="item.optionKey" :key="item.optionKey">{{ item.optionValue }}</Option> 
                            </Select>
                        </Col>
                    </Row>
                    <Row :style="{marginBottom: '10px'}">
                        <Col span="4" >
                            <Select v-model="selectData.appNamesId"   placeholder="选择包名">
                                <Option v-for="item in appNamesList" :value="item.optionKey" :key="item.optionKey">{{ item.description }}</Option> 
                            </Select>
                        </Col>
                        <Col span="4" offset="16">
                            <Button @click="refresh" type="primary" icon="search">搜索</Button>
                            <Button @click="selectReset" type="ghost">重置</Button>
                        </Col>
                    </Row>
                    <Row :style="{marginBottom: '10px'}">
                        <Table border :columns="popupColumns" :data="popupData" style="width: 100%;"></Table>
                    </Row>
                    <Row class="paging">
                        <Col>
                            <Page :total="totalRecord" :page-size="pageSize" show-total  @on-change="changepage"></Page>
                        </Col>
                        <Col>
                            <Select v-model="pageSize"  style="width:100px" @on-change="changePageSize" class="padding-left-8">
                                <Option key="1条/页" :value="1">1条/页</Option>
                                <Option key="10条/页" :value="10">10条/页</Option>
                                <Option key="20条/页" :value="20">20条/页</Option>
                                <Option key="50条/页" :value="50">50条/页</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row type="flex" justify="end">
                        <Col class="margin-right-10">
                            <Button type="primary" @click="addPopup" >新增配置信息</Button>
                            <Button @click="refresh" >刷新</Button>
                        </Col>
                    </Row>
                    <loading v-bind:spinShow='spinShow'></loading>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import axios from 'axios'
import {baseUrl} from '../../conf/env'
import loading from '../loading/loading'
import {setCookie, getCookie, removeCookie} from '@/conf/cookie'
export default {
    components:{
        loading
    },
    data () {
        return {
        	channelsList:[],
        	versionsList:[],
        	appNamesList:[],
        	deviceTypesList:[],
        	popupSourceList:[],
            selectData:{
                channelsId:'',
                versionsId:'',
                appNamesId:'',
                deviceTypesId:'',
                extCondition1:''
            },
            totalRecord:0,
            pageSize:10,
            pageNum:1,
            spinShow:true,
            primaryDiplayList:[],
            displayTypeList:[],
            popupColumns: [
                {
                    type: 'index',
                    title: '序号',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '配置名称',
                    key: 'remark',
                    align: 'center'
                },
                {
                    title:'渠道',
                    key:'channelsId',
                    align: 'center',
                    render: (h, params) => {
                        let texts = '';
                        for(let i = 0 ; i < this.channelsList.length ; i ++){
                        	if(this.channelsList[i].optionKey == params.row.channelsId){
                        		texts = this.channelsList[i].description;
                        		break;
                        	}
                        }
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },
                {
                    title:'版本',
                    key:'versionsId',
                    align: 'center',
                    render: (h, params) => {
                        let texts = '';
                        for(let i = 0 ; i < this.versionsList.length ; i ++){
                        	if(this.versionsList[i].optionKey == params.row.versionsId){
                        		texts = this.versionsList[i].optionValue;
                        		break;
                        	}
                        }
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },
                {
                    title:'包名',
                    key:'appNamesId',
                    align: 'center',
                    render: (h, params) => {
                        let texts = '';
                        for(let i = 0 ; i < this.appNamesList.length ; i ++){
                        	if(this.appNamesList[i].optionKey == params.row.appNamesId){
                        		texts = this.appNamesList[i].description;
                        		break;
                        	}
                        }
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },
                {
                    title:'设备类型',
                    key:'deviceTypesId',
                    align: 'center',
                    render: (h, params) => {
                        let texts = '';
                        for(let i = 0 ; i < this.deviceTypesList.length ; i ++){
                        	//console.log(this.deviceTypesList[i].optionKey,params.row.deviceTypesId)
                        	if(this.deviceTypesList[i].optionKey == params.row.deviceTypesId){
                        		texts = this.deviceTypesList[i].optionValue;
                        		break;
                        	}
                        }
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },
                {
                    title:'优先级',
                    key:'popupIndex',
                    align: 'center'
                },
                {
                    title:'配置信息来源',
                    key:'extCondition1',
                    align: 'center',
                    render: (h, params) => {
                        let texts = '';
                        for(let i = 0 ; i < this.popupSourceList.length ; i ++){
                        	//console.log(this.popupSourceList[i].optionKey,params.row.extCondition1)
                        	if(this.popupSourceList[i].optionKey == params.row.extCondition1){
                        		texts = this.popupSourceList[i].optionValue;
                        		break;
                        	}
                        }
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },
                /*{
                    title:'操作',
                    align: 'center',
                    render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {

                                        }
                                    }
                                }, '查看'),
                            ]);
                        }
                }*/
            ],
            popupData: [
            ]
        };
    },
    computed: {
        avatorImage () {
            return localStorage.avatorImgPath;
        }
    },
    created(){
    	this.getChannels();
        this.getVersions();
        this.getAppNames();
        this.getDeviceTypes();
        this.getPopupSource();
        this.init();
    },
    methods:{
        selectReset(){
            this.selectData.channelsId = '';
            this.selectData.appNamesId = '';
            this.selectData.deviceTypesId = '';
            this.selectData.extCondition1 = '';
            this.selectData.versionsId = '';
            this.init();
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
        },
        //查询配置信息列表
        findAllPopup(){
			axios({
                method:'post',
                url:baseUrl + '/popup/findAllPopup',
                params:{
                    currentPage:this.pageNum,
                    pageSize:this.pageSize,
                    channelsId:this.selectData.channelsId,
                    appNamesId:this.selectData.appNamesId,
                    deviceTypesId:this.selectData.deviceTypesId,
            		extCondition1:this.selectData.extCondition1,
            		versionsId:this.selectData.versionsId
                },
                responseType:'json'
            }).then(res=> {
                //console.log(res);
                this.totalRecord=res.data.total;
                this.popupData=res.data.list;
                this.$Message.success("获取成功");
            	this.spinShow = false;
            })
            .catch(res=> {
                console.log(res);
                this.error("服务器请求失败！");
                this.spinShow = false;
            });
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
                this.error("请求失败,获取设备类型列表失败！");
            });
        },
        changePageSize(){
            this.pageNum=1;
            this.init();
        },
        changepage(curPage){
            this.pageNum = curPage;
            this.init();
        },
        addPopup(){
            this.$router.push({
                name: 'addPopup',
            });
        },
        refresh(){
            this.init();
        },

    }
};
</script>