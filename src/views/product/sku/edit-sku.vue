<style lang="less">
    @import "../../../styles/common.less";
</style>

<template>
    <div>      
      <Card>
            <p slot="title">
                <Icon type="ios-list"></Icon>
                更改sku
            </p>
            <Form ref="formValidate" label-position="left" :model="skuFormValidate" :label-width="120" class="margin-top-10">
                <Row type="flex"  align="middle">
                    <Col span="8">                 
                        <FormItem prop="name" label="sku名称" 
                        :rules="{required: true, message: 'sku名称不能为空', trigger: 'blur'}" >
                            <Input v-model="skuFormValidate.name"  placeholder="请填写sku名称..." ></Input>
                        </FormItem>
                    </Col>
                    <Col offset="4" span="8">  
                        <FormItem prop="extCode1" label="sku编码" >
                            <Input v-model="skuFormValidate.extCode1" placeholder="请输入sku编码..." ></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row  type="flex"  align="middle">
                    <Col span="8">  
                        <FormItem prop="barCode" label="条形码">
                            <Input v-model="skuFormValidate.barCode" placeholder="请输入条形码..." ></Input>
                        </FormItem>
                    </Col>
                    <Col offset="4" span="8">  
                        <FormItem prop="color" label="sku颜色">
                            <Input v-model="skuFormValidate.color" placeholder="请输入颜色..." ></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row  type="flex"  align="middle">
                    <Col span="8">  
                        <FormItem prop="price" label="sku价格"  
                        :rules="{ required:true,validator: validatePrice, trigger: 'blur' }">
                            <Input v-model="skuFormValidate.price" placeholder="请输入sku价格..." ></Input>
                        </FormItem>
                    </Col>
                    <Col offset="4" span="8">  
                        <FormItem prop="skuSize" label="sku规格" >
                            <Input v-model="skuFormValidate.skuSize" placeholder="请输入规格..." ></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row class="margin-top-8" type="flex"  align="middle" >
                    <Col span="8" >  
                        <FormItem prop="isRepeat" label="能否重复购买">
                            <i-switch v-model="skuFormValidate.isRepeat" ></i-switch>
                        </FormItem>
                    </Col>
                    <Col span="8" offset="4" v-if="skuFormValidate.isVirtua == true">  
                        <FormItem prop="virtuaPropertyId" label="虚拟信息"
                         :rules="{required: true, message: '虚拟信息不能为空', trigger: 'change',type:'number'}" >
                            <Select v-model="skuFormValidate.virtuaPropertyId">
                                <Option v-for="item in skuVirtuaPropertyList" :value="item.value" :key="item.label">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row  type="flex"  align="middle">
                    <Col span="7" >  
                        <FormItem label="封面图片" prop="url"  :rules="{validator: validateUrl }" class="margin-top-10" >
                            <Upload name="fileField" 
                                    :action='uploadUrl'
                                    :on-success="uploadSuccess"
                                    :on-error="uploadError"
                                    :show-upload-list="false">
                                 <Button type="ghost" icon="ios-cloud-upload-outline" long >上传封面图片</Button>
                            </Upload>
                        </FormItem>
                    </Col>
                    <Col >
                        <img :src="skuFormValidate.url" style="width:auto;height:80px">
                    </Col>
                </Row> 
            </Form> 

            <!--按钮区域-->
            <Row class="margin-top-8" type="flex"  align="middle" justify="end">
                <Button type="primary" @click="editSku('formValidate')">确认修改</Button>
                <Button type="ghost" @click="returnList" style="margin-left: 8px">取消</Button>
            </Row>
        </Card>
    </div>
</template>

<script>
import axios from 'axios';
import {baseUrl} from '../../../conf/env';
import addProductSelect from './sku-product-select.vue'
import {setCookie, getCookie, removeCookie} from '@/conf/cookie'
export default {
    components:{
          addProductSelect
    },
    data () {
        return {
            skuVirtuaPropertyList:[],
            uploadUrl:baseUrl + "/fileController/uploadFile",
            skuFormValidate:{
                id:'',
                extCode1:'',
                name:'',
                barCode:'',
                url:'',
                price:'',
                skuSize:'',
                color:'',
                isVirtua:'',
                isRepeat:'',
                virtuaPropertyId:'',
                userId:'',
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
        //验证图片
        validateUrl(rule, value, callback){
            callback();
        },
        uploadSuccess(res,file){
            if(res.result == 1){
                this.skuFormValidate.url = res.url;
            }else{
                console.log(res);
                this.error("图片上传失败！");
            }
        },
        uploadError(res,file){
            console.log(res);
            this.error("图片上传失败！");
        },
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
        error (nodesc) {
            this.$Notice.error({
                title: '错误',
                desc: nodesc 
            });
        },
        init(){
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
                this.getSkuById();
                
              })
              .catch(res=> {
                   console.log(res);
                   this.error("请求失败,获取虚拟属性列表失败！");
              });
        },
        getSkuById(){
            axios({
                method:'get',
                url:baseUrl + '/sku/findSkuById',
                params:{
                    id:this.$route.query.id
                },
                responseType:'json'
            }).then(res=> {
                //console.log(res);
                this.skuFormValidate.name=res.data.object.name;
                this.skuFormValidate.extCode1=res.data.object.extCode1;
                this.skuFormValidate.barCode=res.data.object.barCode;
                this.skuFormValidate.url=res.data.object.url;
                this.skuFormValidate.price=res.data.object.price;
                this.skuFormValidate.skuSize=res.data.object.skuSize;
                this.skuFormValidate.color=res.data.object.color;
                this.skuFormValidate.isVirtua=res.data.object.isVirtua;
                this.skuFormValidate.isRepeat=res.data.object.isRepeat;
                this.skuFormValidate.virtuaPropertyId=res.data.object.virtuaPropertyId;
            })
            .catch(res=> {
                console.log(res);
                this.error("请求失败,获取更新数据失败！");
            });
        },
        editSku(name){    
            this.skuFormValidate.id = this.$route.query.id;
            this.skuFormValidate.userId = getCookie('userId');
            this.$refs[name].validate((valid) => {
                if (valid) {
                        axios({
                        method:'post',
                        url:baseUrl + '/sku/updateSkuById',
                        params:this.skuFormValidate,
                        responseType:'json'
                        }).then(res=> {
                            console.log(res);
                            if(res.data == true){
                                this.$Message.success('保存成功!');
                                this.$router.push({
                                    name:"sku"
                                })
                            }else{
                                this.error("保存失败");
                            }
                        })
                        .catch(res=> {
                            console.log(res);
                            this.error("保存失败");
                        });
                } else {
                    this.$Message.error('填写有误!');
                    return false;
                }
            })
        },
        returnList(){
            this.$router.push({
                name: 'sku'
            });
        }
    }
};
</script>