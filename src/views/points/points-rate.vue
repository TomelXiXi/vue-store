<style lang="less">
	@import "../../styles/common.less";
</style>

<template>
	<div>
		<Card>
			<p slot="title">
                <Icon type="ios-list"></Icon>
                积分配置信息      
            </p>
            <Form ref="formValidate" label-position="left" :model="formValidate" :rules="ruleValidate" :label-width="150">
                <Row >
                    <Col span="6" class="margin-top-10">
                        <FormItem prop="cashReturnRate" label="购买返现比例:" >
                            <Input v-model="formValidate.cashReturnRate" placeholder="请输入返还积分数量..." ></Input>
                        </FormItem>
                    </Col>
                    <Col offset="1" span="6" class="margin-top-10">
                    <Alert  show-icon>即用户每花费100元可返{{100*formValidate.cashReturnRate}}元,
                    即{{100*formValidate.cashReturnRate*formValidate.cashToPointsRate}}积分</Alert>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span="6" class="margin-top-10">
                        <FormItem prop="cashToPointsRate" label="现金-积分兑换比例:" >
                            <Input v-model="formValidate.cashToPointsRate" placeholder="请输入返还积分数量..." ></Input>
                        </FormItem>
                    </Col>
                    <Col offset="1" span="6" class="margin-top-10">
                    <Alert  show-icon>即1元对应{{1*formValidate.cashToPointsRate}}积分</Alert>
                    </Col>
                </Row>
                <Row class="margin-top-8" type="flex"  align="middle" justify="end">
                    <Button type="primary" @click="updatePoints('formValidate')">确认修改</Button>
                </Row>
            </Form>
            <loading v-bind:spinShow='spinShow'></loading>
		</Card>

        <Card class="margin-top-10">
            <loading v-bind:spinShow='spinShow'></loading>
            <p slot="title">
                <Icon type="ios-list"></Icon>
                用户积分发放      
            </p>
            <Form ref="formValidate2" label-position="left" :model="formValidate2" :rules="ruleValidate2" :label-width="120">
                <Row >
                    <Col span="8" class="margin-top-10">
                        <FormItem prop="phone" label="电话号码：" >
                            <Input v-model="formValidate2.phone" placeholder="请输入电话号码..." ></Input>
                        </FormItem>
                    </Col>
                    <Col offset="4" span="8" class="margin-top-10">
                        <FormItem prop="pointsNum" label="积分数量:" >
                            <Input v-model="formValidate2.pointsNum" placeholder="请输入积分数量..." ></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row class="margin-top-8" type="flex"  align="middle" justify="end">
                    <Button type="primary" @click="addUserPoints('formValidate2')">确认增加</Button>
                </Row>
            </Form>
            <loading v-bind:spinShow='spinShow2'></loading>
        </Card>
	</div>
</template>

<script>
import axios from 'axios';
import {baseUrl} from '@/conf/env';
import loading from '../loading/loading'
import {setCookie, getCookie, removeCookie} from '@/conf/cookie'
	export default{
        components:{
            loading
        },
        data() {
            const pointsReturnRateValidate = (rule, value, callback) => {
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if(reg.test(value) && value <= 1){
                    callback();
                }else{
                    callback(new Error("比例为不大于1的两位小数"));
                }
            }
            const cashToPointsRateValidate = (rule, value, callback) => {
                let reg = /^[1-9]\d*$/;
                if(reg.test(value) ){
                    callback();
                }else{
                    callback(new Error("兑换比例必须为正整数！"));
                }
            }
            const phoneValidate = (rule, value, callback) => {
                let  re = /^1\d{10}$/    //正则表达式
                if (!re.test(value)) {      //判断字符是否是11位数字
                   callback(new Error("请输入正确格式的电话号码"));
                }else{
                    callback();
                }
            }
            const pointsNumValidate = (rule, value, callback) => {
                let reg = /^[1-9]\d*$/;
                if(reg.test(value) ){
                    if(value % this.formValidate.cashToPointsRate != 0){
                        callback(new Error('需填可被' + this.formValidate.cashToPointsRate +'整除的正整数'));
                     }else{
                        callback();
                     }
                }else{
                    callback(new Error("积分数必须为正整数！"));
                }
            }
        	return{
                spinShow:true,
                spinShow2:false,
                formValidate:{
                    cashReturnRate:0,
                    cashToPointsRate:0,
                    id:'',
                },
                ruleValidate:{
                    cashReturnRate:[{validator:pointsReturnRateValidate, trigger: 'change'}],
                    cashToPointsRate:[{validator:cashToPointsRateValidate, trigger: 'change'}]

                },
                formValidate2:{
                    phone:'',
                    pointsNum:0
                },
        		ruleValidate2:{
                    phone:[{validator:phoneValidate, trigger: 'blur'}],
                    pointsNum:[{validator:pointsNumValidate, trigger: 'blur'}]
                },
        	}
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
				axios({
    		        method:'get',
    		        url:baseUrl + '/points/getCashPointsRate',
    		        responseType:'json'
		        })
		        .then(res=> {
		    	    console.log(res);
		    	    this.formValidate.cashReturnRate=res.data.cashReturnRate;
		    	    this.formValidate.cashToPointsRate=res.data.cashToPointsRate;
                    this.id = res.data.id;
                    this.spinShow = false;
		        })
		        .catch(res=> {
		            console.log(res);
		            this.error("更新失败！");
                    this.spinShow = false;
		        });
        	},
            updatePoints(name){
                this.spinShow = true;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        axios({
                            method:'post',
                            url:baseUrl + '/points/updateCashPointsRate',
                            responseType:'json',
                            params:{
                                id:1,
                                cashReturnRate:this.formValidate.cashReturnRate,
                                cashToPointsRate:this.formValidate.cashToPointsRate,
                                userId:getCookie('userId')
                            }
                        })
                        .then(res=> {
                            console.log(res);
                            this.$Message.success("更新成功")
                            this.init();
                            this.spinShow = false;
                        })
                        .catch(res=> {
                            console.log(res);
                            this.error("服务器请求失败！");
                            this.spinShow = false;
                        });
                    }
                })
            },
            addUserPoints(name){
                this.spinShow2 = true;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        axios({
                            method:'post',
                            url:baseUrl + '/points/addUserPointsByPhone',
                            responseType:'json',
                            params:this.formValidate2
                        })
                        .then(res=> {
                            //console.log(res);
                            if(res.data.status == 1){
                                this.$Message.success("更新成功")
                                this.formValidate2.phone = '';
                                this.formValidate2.pointsNum = 0;
                                this.spinShow2 = false;
                            }else{
                                console.log(res);
                                this.$Message.error(res.data.msg)
                                this.spinShow2 = false;
                            }
                            
                        })
                        .catch(res=> {
                            console.log(res);
                            this.error("服务器请求失败！");
                            this.spinShow2 = false;
                        });
                    }
                })
            }
        	
        }
	}
</script>