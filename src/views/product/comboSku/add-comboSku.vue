<style lang="less">
    @import "../../../styles/common.less";
</style>

<template>
    <div>      
        <Modal ref="modal"
            v-model="modal"
            v-bind:title='modalTitle'
            width=60%
            loading="loading"
            @on-ok="ok"
            @on-cancel="cancel"
            :transfer="false">      
           <skuSelect ref="choosePro" @showModal="showModal()" @hideModal="hideModal()"
            :selectSkuList="selectSkuList" :isMutilple="isMutilple"></skuSelect>
         </Modal>
        <!--商品信息区域-->
        <Row>
            <Col span="24" >
                <Card >
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        sku列表
                    </p>
                    <Row>
                        <Col span="12">
                            <Steps :current="0" v-if="selectSkuList.length == 0">
                                <Step title="选取sku"></Step>
                                <Step title="维护组合商品信息"></Step>
                                <Step title="验证保存"></Step>
                            </Steps>
                            <Steps :current="1" v-if="selectSkuList.length != 0">
                                <Step title="选取sku"></Step>
                                <Step title="维护组合商品信息"></Step>
                                <Step title="验证保存"></Step>
                            </Steps>
                        </Col>
                    </Row>
                    <Row class="margin-top-20">
                        <Col span="12">
                            <Button type="dashed" size="large" @click="selectSku">点击选取sku</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Collapse v-if="selectSkuList.length != 0" class="margin-top-20">
                            <Panel v-for="(item,index) in selectSkuList" :name="item.name + index" :key="index">
                                {{item.name}}
                                <p slot="content" >
                                    <Row span="24">
                                        <Col >                                      
                                            价格:  &nbsp;&nbsp;{{item.price}}                                       
                                        </Col>
                                        <Col class="margin-top-8"> 
                                            数量:  &nbsp;&nbsp;<InputNumber v-model="item.quantity" :min="1" 
                                            @on-change="quantityChange"></InputNumber>
                                        </Col>
                                    </Row>
                                </p>
                            </Panel>
                        </Collapse>
			        </Row>
                    <Row justify="end" type="flex" v-if="selectSkuList.length != 0" class="margin-top-10">
                        <Col>
                            <p>总价 {{totalMoney}} 元</p>
                        </Col>
                    </Row>
                </Card>
                <Card class="margin-top-10">
                    <Row >
                        <Form ref="formValidate" label-position="left" :model="formValidate" :rules="ruleValidate" :label-width="120">
                            <Row type="flex"  align="middle">
                                <Col span="8">                  
                                    <FormItem prop="name" label="组合商品名称" >
                                        <Input v-model="formValidate.name" placeholder="请填写组合商品名称..." ></Input>
                                    </FormItem>
                                </Col>
                                <Col offset="5" span="8">  
                                    <FormItem prop="price" label="组合商品价格" >
                                        <Input v-model="formValidate.price" placeholder="请输入组合商品价格..." ></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row class="margin-top-8" type="flex"  align="middle">
                                <Col span="8">  
                                    <FormItem prop="status" label="状态" >
                                        <Select v-model="formValidate.status" placeholder="请选择状态...">
                                            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option> 
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col offset="5" span="8">  
                                    <FormItem prop="remark" label="备注"  >
                                        <Input v-model="formValidate.remark" placeholder="请输入备注..." ></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Row>
                </Card>
            </Col>
        </Row>
        <!--按钮区域-->
        <Row class="margin-top-8" type="flex"  align="middle" justify="end">           
            <Button type="primary" @click="addComboSku('formValidate')" v-if="$route.query.id == undefined">确认新增</Button>
            <Button type="primary" @click="updateCombo('formValidate')" v-if="$route.query.id != undefined">确认修改</Button>
            <Button type="ghost" @click="returnList" style="margin-left: 8px">返回</Button>
        </Row>
    </div>
</template>

<script>
import axios from 'axios';
import {baseUrl} from '../../../conf/env';
import skuSelect from '@/views/product/sku/sku-select.vue'
import {setCookie, getCookie, removeCookie} from '@/conf/cookie'
import {accAdd,accSub,accDiv,accMul} from '@/conf/math'
export default {
    components:{
          skuSelect
    },
    data () {
        const priceValite  = (rule, value, callback) => {
            if (!value) {
                callback(new Error('价格不能为空'));
            }
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确金额'));
            } else{
                callback();
            }
        };
        return {
            statusList:[
                {
                    value:0,
                    label:'作废'
                },
                {
                    value:1,
                    label:'有效'
                }
            ],
            butName:'确认新增',
            isMutilple:1,
            totalMoney:0,
        	selectSkuList:[],
            modal:false,
            modalTitle:'选取sku',
            formValidate:{
				name:'',
                price:'',
                status:1,
                remark:'',
            },
            ruleValidate:{
                name: [
                    { required: true, message: '组合商品名称不能为空', trigger: 'blur' }
                ],
                price:[
                   { required: true, trigger: 'blur',validator:priceValite }
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
    	selectSku(){
            this.modal = true;
    	},
        ok(){
            console.log(this.selectSkuList);
            this.getTotalMoney();
            this.modal=false;
        },
        cancel(){

        },
        showModal(){
            this.modal = true;
        },
        hideModal(){
            this.modal = false;
        },
        init(){
            if(this.$route.query.id != undefined){
                this.butName = '确认修改';
                //console.log(this.$route.query.id);
                axios({
                    method:'get',
                    url:baseUrl + '/comboSku/findComboSkuCommandById',
                    params:{
                        id:this.$route.query.id
                    },
                    responseType:'json'
                    }).then(res=> {
                        console.log(res);
                        this.selectSkuList = res.data.details;
                        for(let i = 0 ; i < res.data.details.length ; i ++){
                            this.selectSkuList[i].price = res.data.details[i].unitPrice;
                        }
                        this.formValidate.name=res.data.name;
                        this.formValidate.price=res.data.price;
                        this.formValidate.status=res.data.status;
                        this.formValidate.remark=res.data.remark;
                        this.getTotalMoney();
                    })
                    .catch(res=> {
                          console.log(res);
                          this.error("服务器请求失败！");
                    });
            }
        },
        addComboSku(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(this.selectSkuList.length < 2){
                        this.$Message.error('请至少选择两个sku!');
                    }else{
                        axios({
                        method:'post',
                        url:baseUrl + '/comboSku/createComboSku',
                        params:{
                            price:this.formValidate.price,
                            status:this.formValidate.status,
                            name:this.formValidate.name,
                            remark:this.formValidate.remark,
                            userId:getCookie('userId'),
                            skuListStr:JSON.stringify(this.selectSkuList),
                        },
                        responseType:'json'
                        }).then(res=> {
                            console.log(res);
                            if(res.data.status == 1){
                                this.$Message.success('保存成功!');
                                this.$router.push({
                                    name:"comboSku"
                                })
                            }else{
                                this.error(res.data.msg);
                            }
                        })
                        .catch(res=> {
                              console.log(res);
                              this.error("服务器请求失败！");
                        });
                    }
                }else{
                    this.$Message.error('填写有误!');
                    return false;
                }
            })
        },
        updateCombo(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(this.selectSkuList.length < 2){
                        this.$Message.error('请至少选择两个sku!');
                    }else{
                        for(let i = 0 ; i < this.selectSkuList.length ; i ++ ){
                            this.selectSkuList[i].comboSkuId = this.$route.query.id;
                        }
                        axios({
                        method:'post',
                        url:baseUrl + '/comboSku/updateComboSku',
                        params:{
                            id:this.$route.query.id,
                            price:this.formValidate.price,
                            status:this.formValidate.status,
                            name:this.formValidate.name,
                            remark:this.formValidate.remark,
                            userId:getCookie('userId'),
                            skuListStr:JSON.stringify(this.selectSkuList),
                        },
                        responseType:'json'
                        }).then(res=> {
                            console.log(res);
                            if(res.data.status == 1){
                                this.$Message.success('保存成功!');
                                this.$router.push({
                                    name:"comboSku"
                                })
                            }else{
                                this.error(res.data.msg);
                            }
                        })
                        .catch(res=> {
                              console.log(res);
                              this.error("服务器请求失败！");
                        });
                    }
                }else{
                    this.$Message.error('填写有误!');
                    return false;
                }
            })
        },
        returnList(){
            this.$router.push({
                name:"comboSku"
            })
        },
        getTotalMoney(){
            this.totalMoney = 0;
            for(let i = 0 ; i < this.selectSkuList.length ; i ++ ){
                let priceSingle = accMul(this.selectSkuList[i].price,this.selectSkuList[i].quantity);
                this.totalMoney = this.totalMoney + priceSingle;
            }
        },
        quantityChange(){
            this.getTotalMoney();
        }
    }
};
</script>