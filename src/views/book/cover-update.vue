<style lang="less">
    @import "../../styles/common.less";
</style>

<template>
    <div>
    	<Form ref="formValidate" label-position="left" :model="cover" :rules="ruleValidate" :label-width="120" >     
    		<Row>
    			<Alert show-icon v-if="id == undefined">
                    新增封面页广告信息
			    </Alert>
                <Alert show-icon v-if="id != undefined">
                    修改封面页广告信息
			    </Alert>
    		</Row> 
            
	    	<Row>
                <Col offset="1" span="5"> 
                    <FormItem prop="displayUrl" label="封面图片">
                        <Upload name="fileField" 
                                :action='uploadUrl'
                                :on-success="displayUrlSuccess"
                                :on-error="displayUrlError"
                                :show-upload-list="false">
                            <Button type="ghost" icon="ios-cloud-upload-outline" long>选择封面图片</Button>
                        </Upload>
                    </FormItem>
                </Col>
                <Col offset="7" span="2">
                    <img :src="cover.imgUrl" style="width:auto;height:80px">
                </Col>
	    	</Row>
            <Row>
                <Col span="17" offset="1">  
                    <FormItem prop="url" label="广告链接:" >
                        <Input v-model="cover.url" ></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="10" offset="1">  
                    <FormItem prop="residenceTime" label="广告驻留时间:" >
                        <Input v-model="cover.residenceTime" ><span slot="append">s</span></Input>
                    </FormItem>
                </Col>
                <Col span="10" offset="2" v-if="cover.isSkip === true">  
                    <FormItem prop="skipTime" label="允许跳过时间:" >
                        <Input v-model="cover.skipTime" ><span slot="append">s</span></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row>    
	    		<Col offset="1" span="11">                  
                    <FormItem prop="status" label="是否可用:" >
                        <i-switch v-model="isOpen">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </FormItem>   
                </col>    
                <Col offset="1" span="11">                   
                    <FormItem prop="isSkip" label="是否可跳过:" >
                        <i-switch v-model="cover.isSkip">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col offset="1" span="12"> 
                <FormItem prop="time" label="生效起始时间:" >
                    <DatePicker @on-change="getTime" v-model="timePicker" type="datetimerange" placeholder="Select date and time" style="width: 350px"></DatePicker>
                    <br>
                </FormItem>
                    
                </Col>
	    	</Row>
    	</Form>
    </div>
</template>

<script>
import axios from 'axios';
import {baseUrl} from '../../conf/env';
import {setCookie, getCookie, removeCookie} from '@/conf/cookie'
import {timestampToDate} from '@/conf/date-format'
export default {
	/*props:["code"],*/
    components:{
        
    },

    data () {
        const timeValidate = (rule, value, callback) => {
        	if(this.timePicker[0] == '' || this.timePicker[1] == ''){
                callback(new Error('起止时间不能为空！'));
        	}else{
        		callback();
        	}
        };
        return {
        	id:'',
        	statusText:'',
        	statusColor:'',
        	paymentStatusText:'',
            paymentStatusColor:'',
            isOpen:false,
            timePicker:[],
        	cover:{
        		id:'',
        		imgUrl:'',
        		url:'',
        		userId:'',
        		residenceTime:'',
        		isSkip:true,
				skipTime:'',
                status:0,
                startTime:'',
                endTime:''
        	},
			ruleValidate:{
                url:[
                        {required:true, trigger: 'blur',message:'广告链接不能为空'}
                    ],
                time:[
        			{ validator:timeValidate, trigger: 'change' ,required:true}
                ],
                residenceTime:[
        			{ required:true, trigger: 'blur' ,message:'驻留时间不能为空'}
                ],
            },
            spinShowComp:false,
            uploadUrl:baseUrl + "/fileController/uploadFile",
        };
    },
    computed: {
        
    },
    created(){
        //this.init();
        // this.getExpress();
    },
    methods:{
        error (nodesc) {
            this.$Notice.error({
                title: '错误',
                desc: nodesc 
            });
        },
    	setId(id){
    		this.id = id;
        },
        getTime(value) {
            console.log(value);
            this.cover.startTime=value[0]
            this.cover.endTime=value[1]
        },
    	init(){
            console.log(this.id);
            this.spinShow = true;
            this.reset();
            if (this.id != '') {
                    axios({
                    method:'post',
                    url:baseUrl + '/book/getCoverById',
                    params:{
                        id:this.id
                    },
                    responseType:'json'
                }).then(res=> {
                    console.log(res);
                    this.cover.id = res.data.info.id;
                    this.cover.imgUrl = res.data.info.imgUrl;
                    this.cover.url = res.data.info.url;
                    this.cover.userId = res.data.info.userId;
                    this.cover.residenceTime = res.data.info.residenceTime;
                    this.isOpen = res.data.info.status == 1 ? true : false;
                    this.cover.isSkip = res.data.info.isSkip;
                    this.cover.skipTime = res.data.info.skipTime;
                    this.cover.createTime = timestampToDate(res.data.info.createTime);
                    this.cover.updateTime = timestampToDate(res.data.info.updateTime);
                    // if(this.cover.status == 0){
                    //     this.statusText='不可用'
                    //     this.statusColor='red'
                    // }else if(this.cover.status == 1){
                    //     this.statusText='可用'
                    //     this.statusColor='green'
                    // }
                    console.log(res.data.info.startTime);
                    if ('' != res.data.info.startTime) {
                        this.timePicker=[];
                        this.timePicker.push(res.data.info.startTime);
                        this.timePicker.push(res.data.info.endTime);
                    }
                
                    //this.order = res.data;  
                    console.log(this.timePicker);
                    this.spinShow = false;
                })
                .catch(res=> {
                    console.log(res);
                    this.error("获取封面信息异常！");
                    this.spinShow = false;
                });
            }
    	},
        updateCover(){
            this.spinShow = true;
            console.log(this.isOpen);
            this.$refs['formValidate'].validate((valid) => {
            if (!valid) {
                this.$Message.error('填写有误!');
                this.spinShow = false;
            }else {
                axios({
                method:'POST',
                url:baseUrl + '/book/updateCover',
                params:{
                	id:this.cover.id,
                    status:this.isOpen == false ? 0 : 1,
                    residenceTime:this.cover.residenceTime,
                    isSkip:this.cover.isSkip,
                    skipTime:this.cover.skipTime,
                    startTimeStr:this.cover.startTime,
                    endTimeStr:this.cover.endTime,
                    imgUrl:this.cover.imgUrl,
                    url:this.cover.url
                },
                responseType:'json'
                }).then(res=> {
                    console.log(res);
                    //this.expressList = res.data.list;
                    if(res.data.result == 1){
                        this.$emit("hideModal");
                        this.$emit("init");
                        this.$Message.success("更新成功！")
                        this.reset();
                    }else{
                        console.log(res);
                        this.$emit("hideModal");
                        this.$emit("init");
                        this.error("维护封面广告信息失败！");
                    }
                    this.spinShow = false;
                })
                .catch(res=> {
                    this.spinShow = false;
                    console.log(res);
                    this.error("维护封面广告信息失败！");
                });
                }   
            })
        },
            
        displayUrlSuccess(res,file){
            console.log(res);
            if(res.result == 1){
                this.cover.imgUrl = res.url;
                this.$Message.success("上传成功");
            }else{
                this.error("封面图片上传失败！");
            }
        },
        displayUrlError(res,file){
            console.log(res);
            this.error("封面图片上传失败！");
        },
        reset(){
        	this.cover.id = '';
            this.cover.imgUrl = '';
            this.cover.url = '';
            this.cover.userId = '';
            this.cover.residenceTime = '';
            this.isOpen = false;
            this.cover.isSkip = false;
            this.cover.skipTime = '';
            this.timePicker = '';
        }
    }
};
</script>