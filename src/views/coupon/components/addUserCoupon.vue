<style lang="less">
    @import "../../../styles/common.less";
</style>

<template>
    <div>
    	<Form ref="formValidate" label-position="left" :model="formValidate" :rules="ruleValidate" :label-width="120" >     
    		<Row class="margin-bottom-10">
    			<Alert show-icon>
			        优惠券信息
			        <template slot="desc">
			        	<Row class="margin-top-8">
				    		 <Col span="8">                  
			                    优惠券名称：{{couponName}}
			                </Col>
                            <Col span="8" offset="6">                  
                                优惠券编号：{{couponId}}
                            </Col>
				    	</Row>
			        </template>
			    </Alert>
    		</Row> 
            <FormItem
                v-for="(item, index) in formValidate.items"
                v-if="item.status"
                :key="index"
                :label="'手机号码 ' + item.index"
                :prop="'items.' + index + '.value'"
                :rules="{required: true, validator:phoneValidate, trigger: 'blur'}">
            <Row>
                <Col span="10">
                    <Input type="text" v-model="item.value" placeholder="请输入号码..."></Input>
                </Col>
                <Col span="4" offset="1">
                    <Button type="ghost" @click="handleRemove(index)">删除</Button>
                </Col>
            </Row>
            </FormItem>
            <FormItem>
                <Row>
                    <Col span="10">
                        <Button type="dashed" long @click="handleAdd" icon="plus-round">增加号码</Button>
                    </Col>
                </Row>
            </FormItem>
    	</Form>
        <loading v-bind:spinShow='spinShowComp'></loading>
    </div>
</template>

<script>
import axios from 'axios';
import {baseUrl} from '../../../conf/env';
import loading from '../../loading/loading'
import {setCookie, getCookie, removeCookie} from '@/conf/cookie'
export default {
	props:["couponName","couponId"],
    components:{
        loading
    },
    data () {
        return {
            spinShowComp:false,
            index: 1,
            formValidate: {
                items: [
                    {
                        value: '',
                        index: 1,
                        status: 1
                    }
                ]
            },
			ruleValidate:{

			},
        };
    },
    computed: {
        
    },
    created(){

    },
    methods:{
    	error (nodesc) {
            this.$Notice.error({
                title: '错误',
                desc: nodesc 
            });
        },
        handleSubmit () {
            let phoneList = [];
            for(let i = 0 ; i < this.formValidate.items.length ; i ++){
                if(this.formValidate.items[i].status == 1){
                    phoneList.push(this.formValidate.items[i].value);
                }
            }
            if(phoneList.length == 0){
                this.$Message.error('请填写电话号码');
            }else{
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.spinShowComp = true;
                        axios({
                            method:'post',
                            url:baseUrl + '/coupon/addUserCouponManage',
                            params:{
                                couponId:this.couponId,
                                phoneListStr:JSON.stringify(phoneList)
                            },
                            responseType:'json'
                        }).then(res=> {
                            console.log(res);
                            if(res.data.status == 1){
                                this.$Message.success("发放成功"); 
                                this.$emit("hideModal");
                            }else{
                                this.error(res.data.msg);
                            }
                            this.spinShowComp = false;
                        })
                        .catch(res=> {
                            console.log(res);
                            this.error("服务器请求失败！");
                            this.spinShowComp = false;
                        });
                    } else {
                        console.log(this.formValidate);
                        this.$Message.error('填写有误!');
                    }
                })
            }
        },
        handleReset (name) {
            this.$refs[name].resetFields();
        },
        handleAdd () {
            this.index++;
            this.formValidate.items.push({
                value: '',
                index: this.index,
                status: 1
            });
        },
        handleRemove (index) {
            this.formValidate.items[index].status = 0;
        },
        phoneValidate(rule, value, callback){
            let  re = /^1\d{10}$/    //正则表达式
            let count = 0;
            for(let i = 0 ; i < this.formValidate.items.length ; i ++){
                if(this.formValidate.items[i].status == 1){
                    if(this.formValidate.items[i].value == value){
                        count++;
                    }
                }
            }
            if(count > 1){
                callback(new Error("请勿重复填写"));
            }
            if (!re.test(value)) {      //判断字符是否是11位数字
               callback(new Error("请输入正确的号码"));
            }else{
                callback();
            }
        }
    	
    }
};
</script>