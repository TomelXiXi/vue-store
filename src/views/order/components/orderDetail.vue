<style lang="less">
    @import "../../../styles/common.less";
</style>

<template>
    <div>
    	<Form ref="formValidate" label-position="left" :model="order" :rules="ruleValidate" :label-width="120" >     
    		<Row>
    			<Alert show-icon>
			        订单信息
			        <template slot="desc">
			        	<Row class="margin-top-8">
				    		 <Col span="8">                  
			                    订单编号：{{order.code}}
			                </Col>
			                <Col offset="6" span="8">  
			                    实际支付金额：{{order.totalActual}}元
			                </Col>
				    	</Row>
				    	<Row class="margin-top-8">
				    		<Col span="8">                  
			                    用户编号：{{order.userId}}
			                </Col>
			                <Col offset="6" span="8">  
			                    订单创建时间：{{order.createTime}}
			                </Col>
				    	</Row>
			        </template>
			    </Alert>
    		</Row> 
	    	<!-- <Row>
	    		 <Col span="8">                  
                    <FormItem prop="code" label="订单号:" >
                        <Input v-model="order.code" disabled></Input>
                    </FormItem>
                </Col>
                <Col offset="5" span="8">  
                    <FormItem prop="totalActual" label="实际支付金额:" >
                        <Input v-model="order.totalActual" disabled ></Input>
                    </FormItem>
                </Col>
	    	</Row> -->
	    	<Row>
	    		 <Col offset="1" span="8">                  
                    <FormItem prop="status" label="订单状态:" >
                        <Tag type="dot" :color="statusColor">{{statusText}}</Tag>
                    </FormItem>
                </Col>
                <Col offset="5" span="8">  
                    <FormItem prop="paymentStatus" label="支付状态:" >
                        <Tag type="dot" :color="paymentStatusColor">{{paymentStatusText}}</Tag>
                    </FormItem>
                </Col>
	    	</Row>
	    	<Row v-if="order.isNeedAddress == true">
	    		 <Col offset="1" span="12">                  
                    <FormItem prop="trackingNo" label="快递单号:" >
                        <Input v-model="order.trackingNo" placeholder="请填写快递单号..."></Input>
                    </FormItem>
                </Col>
                <Col  offset="1" span="8">  
                    <FormItem prop="transCode" label="物流公司:" >
                        <Select v-model="order.transCode">
                            <Option v-for="item in expressList" :value="item.transCode" :key="item.transCode">{{ item.name }}</Option> 
                        </Select> 
                    </FormItem>
                </Col>
	    	</Row>
	    	<Row v-if="order.isNeedAddress == true">
	    		 <Col offset="1" span="8">                  
                    <FormItem prop="isTrans" label="是否发货:" >
                        <i-switch v-model="order.isTrans"></i-switch>
                    </FormItem>
                </Col>
                
	    	</Row>
    	</Form>
    </div>
</template>

<script>
import axios from 'axios';
import {baseUrl} from '../../../conf/env';
import {setCookie, getCookie, removeCookie} from '@/conf/cookie'
export default {
	/*props:["code"],*/
    components:{
        
    },
    data () {
        return {
        	code:'',
        	statusText:'',
        	statusColor:'',
        	paymentStatusText:'',
        	paymentStatusColor:'',
        	expressList:[],
        	order:{
        		id:'',
        		code:'',
        		totalActual:'',
        		userId:'',
        		createTime:'',
        		status:'',
        		paymentStatus:'',
				trackingNo:'',
				transCode:'',
				isTrans:true,
                isNeedAddress:'',
        	},
			ruleValidate:{

			},
        };
    },
    computed: {
        
    },
    created(){
        //this.init();
        this.getExpress();
    },
    methods:{
    	setCode(code){
    		this.code = code;
    	},
    	getExpress(){
    		axios({
                method:'get',
                url:baseUrl + '/order/getAllExpressCompany',
                params:{
                    currentPage:1,
                    pageSize:1000
                },
                responseType:'json'
            }).then(res=> {
                //console.log(res);
                this.expressList = res.data.list;
            })
            .catch(res=> {
                console.log(res);
                this.error("获取物流公司列表异常！");
            });
    	},
    	error (nodesc) {
            this.$Notice.error({
                title: '错误',
                desc: nodesc 
            });
        },
    	init(){
    		//console.log(this.code);
    		axios({
                method:'get',
                url:baseUrl + '/order/findSoByCode',
                params:{
                    code:this.code
                },
                responseType:'json'
            }).then(res=> {
                console.log(res);
                this.order.id = res.data.id;
                this.order.code = res.data.code;
                this.order.totalActual = res.data.totalActual;
                this.order.userId = res.data.userId;
                this.order.createTime = res.data.createTime;
                this.order.status = res.data.status;
                this.order.paymentStatus = res.data.paymentStatus;
                this.order.trackingNo = res.data.trackingNo;
                this.order.transCode = res.data.transCode;
                this.order.isNeedAddress = res.data.isNeedAddress;
                if(this.order.status == 0){
                    this.statusText='作废'
                    this.statusColor='red'
                }else if(this.order.status == 1){
                    this.statusText='新建'
                    this.statusColor='green'
                }else if(this.order.status == 2){
                    this.statusText='已发货'
                    this.statusColor='yellow'
                }else if(this.order.status == 3){
                    this.statusText='已完成'
                    this.statusColor='blue'
                }
                if(this.order.paymentStatus == 0){
                    this.paymentStatusText='未付款'
                    this.paymentStatusColor='red'
                }else if(this.order.paymentStatus == 1){
                    this.paymentStatusText='已付款'
                    this.paymentStatusColor='blue'
                }
                //this.order = res.data;  
                console.log(this.order);
            })
            .catch(res=> {
                console.log(res);
                this.error("获取订单信息异常！");
            });
    	},
        updateOrder(){
        	if(this.order.status == 0 ){
        		this.$Message.error("此订单已作废！");
        		return false;
        	}
        	if(this.order.paymentStatus != 1){
        		this.$Message.error("此订单尚未付款！");
        		return false;
        	}
        	axios({
                method:'POST',
                url:baseUrl + '/order/updateTransByCode',
                params:{
                	code:this.order.code,
                	status:this.order.status,
                	paymentStatus:this.order.paymentStatus,
                	trackingNo:this.order.trackingNo,
					transCode:this.order.transCode,
					isTrans:this.order.isTrans
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
                	this.error("维护物流信息失败！");
                }
                
            })
            .catch(res=> {
                console.log(res);
                this.error("维护物流信息失败！");
            });
        },
        reset(){
        	this.order.id = '';
            this.order.code = '';
            this.order.totalActual = '';
            this.order.userId = '';
            this.order.createTime = '';
            this.order.status = '';
            this.order.paymentStatus = '';
            this.order.trackingNo='';
			//this.order.transCode='';
			this.order.isTrans=true;
        }
    }
};
</script>