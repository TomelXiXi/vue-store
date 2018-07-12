<style lang="less">
    @import "../../styles/common.less";
</style>

<template>
    <div>
    	<Form ref="formValidate" label-position="left" :model="cover" :rules="ruleValidate" :label-width="120" >     
    		<Row>
    			<Alert show-icon>
                    封面页广告信息
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
                            <Button type="ghost" icon="ios-cloud-upload-outline" long>添加封面图片</Button>
                        </Upload>
                    </FormItem>
                </Col>
                <Col offset="7" span="2">
                    <img :src="imgUrl" style="width:auto;height:80px">
                </Col>
	    	</Row>
            <Row>
                <Col span="18" offset="1">  
                    <FormItem prop="url" label="广告链接:" >
                        <Input v-model="url" ></Input>
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
                </Col>
                <Col offset="1" span="11">                  
                    <FormItem prop="isSkip" label="是否可跳过:" >
                        <i-switch v-model="isSkip">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </FormItem>
                </Col>
                <Col offset="1" span="12"> 
                <FormItem prop="startTime" label="生效起始时间:" >
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
        return {
        	id:'',
        	statusText:'',
        	statusColor:'',
        	paymentStatusText:'',
            paymentStatusColor:'',
            isOpen:false,
            timePicker:[],
            imgUrl:'',
            url:'',
            userId:'',
            residenceTime:'',
            isSkip:true,
            skipTime:'',
            status:0,
            startTime:'',
            endTime:'',
			ruleValidate:{

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
            this.startTime=value[0]
            this.endTime=value[1]
        },
    	init(){
    	},
        updateCover(){
            this.spinShow = true;
            console.log(this.isOpen);
        	axios({
                method:'POST',
                url:baseUrl + '/book/addCover',
                params:{
                    status:this.isOpen == false ? 0 : 1,
                    residenceTime:this.residenceTime,
                    isSkip:this.isSkip,
                    skipTime:this.skipTime,
                    startTimeStr:this.startTime,
                    endTimeStr:this.endTime,
                    imgUrl:this.imgUrl,
                    url:this.url
                    
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
        },
        displayUrlSuccess(res,file){
            console.log(res);
            if(res.result == 1){
                this.imgUrl = res.url;
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
        	this.id = '';
            this.code = '';
            this.totalActual = '';
            this.userId = '';
            this.createTime = '';
            this.status = 1;
            this.paymentStatus = '';
            this.trackingNo='';
			//this.order.transCode='';
        }
    }
};
</script>