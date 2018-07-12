<style lang="less">
    @import "../../../styles/common.less";
</style>

<template>
    <div>
        <Modal ref="productModal"
            v-model="productModal"
            v-bind:title='productModalTitle'
            width=60%
            loading="loading"
            @on-ok="productOk"
            @on-cancel="productCancel">      
           <addProductSelect ref="choosePro" @showModal="showProductModal()" @hideModal="hideProductModal()"
           :isMutilple="isMutilple" :productList="productList" @chooseProduct="chooseProduct"></addProductSelect>
         </Modal>
        <Row>
<!--             <Card>
                <p slot="title">
                        <Icon type="ios-list"></Icon>
                        筛选列表
                    </p>

                    <Collapse>
                        <Panel name="1">
                            筛选条件
                            <p slot="content">                    
                                
                                <Row>
                                    
                                </Row>
                            </p>
                        </Panel>
                    </Collapse>

            </Card> -->
        </Row>
        <Row>
            <Col span="24" class="margin-top-10">
                <Card>
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        商品sku列表
                    </p>
                    <Row :style="{marginBottom: '12px'}">
                        <Col span="4"  >
                            <Input v-model="selectData.name"  placeholder="按名称筛选" class="form-element-base"></Input>
                        </Col>
                        <Col span="4" offset="1" >
                            <Input v-model="selectData.code"  placeholder="按内部编码筛选" class="form-element-base"></Input>
                        </Col>
                        <!-- <Col span="4" offset="1" class="margin-top-5">
                            <Input v-model="selectData.extCode1"  placeholder="按外部编码筛选" class="form-element-base"></Input>
                        </Col> -->
                        <Col span="4" offset="1" >
                            <Select v-model="selectData.productTypeId" placeholder="筛选商品类别...">
                                <Option v-for="item in productTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option> 
                            </Select>
                        </Col>
                        <Col span="5" offset="1" v-if="selectData.productId == ''"  >
                            <Button type="dashed" size="large" @click="showProductModal">点击选择商品</Button>
                        </Col>
                        <Col span="5" offset="1" v-if="selectData.productId != ''">
                            <Tag closable color="blue" type="dot" @on-close="handleClose"  style="height:35px">{{selectData.productName}}</Tag>   
                        </Col>
                        <Col span="4">
                            <Button @click="refresh" type="primary">确认筛选</Button>
                            <Button @click="selectReset" type="ghost">重置</Button>
                        </Col>
                    </Row>
                    <Row :style="{marginBottom: '12px'}">
                        <Table border :columns="skuColumns" :data="skuData" style="width: 100%;"></Table>
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
                            <Button type="primary" @click="addVirtuaProperty" >新增sku</Button>
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
import {baseUrl} from '../../../conf/env'
import loading from '../../loading/loading'
import addProductSelect from '@/views/product/sku/sku-product-select'
export default {
    components:{
        loading,addProductSelect
    },
    data () {
        return {
            productTypeList:[],
            productModal:false,
            productModalTitle:'选取商品',
            isMutilple:0,
            productList:[],
            //virtuaPropertyList:[],
            selectData:{
                name:'',
                code:'',
                //extCode1:'',
                productId:'',
                productName:'',
                productTypeId:'',
                //virtuaPropertyId:''
            },
            totalRecord:0,
            pageSize:10,
            pageNum:1,
            spinShow:true,
            skuColumns: [
                {
                    type: 'index',
                    title: '序号',
                    width: 60,
                    align: 'center'
                },
/*                {
                    title:'条形码',
                    key:'barCode',
                    align: 'center'
                },*/
                {
                    title: 'sku名称',
                    key:'name',
                    align: 'center',
                },
                {
                    title: 'sku内部编码',
                    key: 'code',
                    width: 200,
                    align: 'center'
                },
/*                {
                    title: 'sku外部编码',
                    key: 'extCode1',
                    align: 'center'
                },*/
                {
                    title: '所属商品',
                    key:'productName',
                    align: 'center',
                },
                {
                    title:'sku规格',
                    key:'skuSize',
                    align: 'center'
                },
/*                {
                    title:'sku颜色',
                    key:'color',
                    align: 'center'
                },*/
                {
                    title:'sku价格',
                    key:'price',
                    align: 'center'
                },
                {
                    title:'虚拟商品属性',
                    key:'classType',
                    align: 'center'
                },
                {
                    title: '图片',
                    key: 'url',
                    align: 'center',
                    columns: {
                        'width':'50px'
                    },
                    render: (h, params) => {
                        return h('div', [
                            h('img', {
                                attrs: {
                                    src: params.row.url
                                },
                                style: {
                                    width: '40px',
                                    height: '40px'
                                }
                            }),
                        ]);
                    }
                },
                {
                    title:'操作',
                    width: 160,
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
                                            this.show(params.index)
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            let query = {id: params.row.id};
                                            this.$router.push({
                                                name: 'editSku',
                                                query: query
                                            });
                                        }
                                    }
                                }, '编辑'),


                            ]);
                        }
                }
            ],
            skuData: [
            ]
        };
    },
    computed: {
        avatorImage () {
            return localStorage.avatorImgPath;
        }
    },
    created(){
        this.init();
        //获取所有虚拟商品属性
/*              axios({
                method:'get',
                url:baseUrl + '/skuVirtuaProperty/findAllSkuVirtuaProperty',
                params:{
                    currentPage:1,
                    pageSize:1000
                },
                responseType:'json'
            }).then(res=> {
                console.log(res);
                this.skuVirtuaPropertyList = [];
                for(var i = 0 ; i < res.data.list.length ; i ++){
                    var skuVirtuaPropertySingle = {
                        value:res.data.list[i].id,
                        label:res.data.list[i].classTypeName
                    }
                    this.virtuaPropertyList.push(skuVirtuaPropertySingle);
                }
                console.log(this.virtuaPropertyList);
                
              })
              .catch(res=> {
                   console.log(res);
                   this.error("请求失败,获取虚拟属性列表失败！");
              });*/
        //获取所有商品

    },
    methods:{
        getProductType(){
            axios({
                method:'get',
                url:baseUrl + '/product/findAllProductType',
                params:{
                    pageSize:1000,
                    currentPage:1
                },
                responseType:'json'
            }).then(res=> {
                //console.log(res)
                if(res.data.result == -2){
                    console.log(res);
                    this.error("请求失败,获取商品类型错误！");
              }else{
                    //this.productTypeData = res.data;
                    this.productTypeList = res.data.list;
              }
              })
              .catch(res=> {
                  console.log(res);
                  this.error("请求失败,获取商品类型错误！");
              });
             
        },
        selectReset(){
            this.selectData.name = '';
            this.selectData.code = '';
            //this.selectData.extCode1 = '';
            this.selectData.productId = '';
            this.selectData.productName = '';
            this.selectData.productTypeId = '';
            this.productList=[];
            this.init();
        },
        handleClose(){
            this.selectData.productId = '';
            this.selectData.productName = '';
            this.productList=[];
        },
        chooseProduct(){
            this.productModal = false;
            this.selectData.productId = this.productList[0].id;
            this.selectData.productName = this.productList[0].name;
            this.init();
        },
        productOk(){
            this.productModal=false;
        },
        productCancel(){
        },
        showProductModal(){
            this.productModal = true;
        },
        hideProductModal(){
            //console.log(111)
            this.productModal = false;
        },
        selectProduct(){
            this.modal=true;
        },
        error (nodesc) {
            this.$Notice.error({
                title: '错误',
                desc: nodesc 
            });
        },
        init(){
            this.spinShow = true;
            //获取商品类别
            this.getProductType();
            //获取所有sku列表
            let reqData = this.selectData;
            reqData["currentPage"]=this.pageNum;
            reqData["pageSize"]=this.pageSize;
            axios({
                method:'post',
                url:baseUrl + '/sku/findAllSkuList',
                params:reqData,
                responseType:'json'
            }).then(res=> {
                //console.log(res);
                if(res.data.result == -2){
                    console.log(res);
                    this.error("服务器请求失败！");
                }else{
                    this.totalRecord=res.data.total;
                    this.skuData=res.data.list;
                }
                this.spinShow = false;
                this.$Message.success("获取成功");
            }).catch(res=> {
                console.log(res);
                this.error("服务器请求失败！");
                this.spinShow = false;
            });
        },
        changePageSize(){
            this.pageNum=1;
            this.init();
        },
        show(index){
            this.$Modal.info({
                    title: 'sku详情',
                    content: `sku名称：${this.skuData[index].name}<br>sku内部编码：${this.skuData[index].code}
                             <br>所属商品：${this.skuData[index].productName}
                             <br>sku规格：${this.skuData[index].skuSize}<br>sku价格：${this.skuData[index].price}
                             <br>sku颜色：${this.skuData[index].color}<br>虚拟商品属性：${this.skuData[index].classType}
                             <br>能否重复购买：${this.skuData[index].isRepeat == true ? '是' : '否'}
                             <br>更新时间：${this.skuData[index].updateTime}<br>创建时间：${this.skuData[index].createTime}`
                })
        },
        changepage(curPage){
            this.pageNum = curPage;
            this.init();
        },
        addVirtuaProperty(){
            this.$router.push({
                name: 'addSku',
            });
        },
        refresh(){
            this.init();
        }
    }
};
</script>