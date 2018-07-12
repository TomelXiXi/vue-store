
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
            <Col span="24">
                <Card>
                    <Row>
	                    <Col span="4"  class="margin-top-5">
	                        <Input v-model="selectData.name"  placeholder="按名称筛选" class="form-element-base"></Input>
	                    </Col>
	                    <Col span="4" offset="1" class="margin-top-5">
	                        <Input v-model="selectData.code"  placeholder="按内部编码筛选" class="form-element-base"></Input>
	                    </Col>
<!-- 	                    <Col span="4" offset="1" class="margin-top-5">
	                        <Input v-model="selectData.extCode1"  placeholder="按外部编码筛选" class="form-element-base"></Input>
	                    </Col> -->
	                    <Col span="4" offset="1" v-if="selectData.productId == ''"  >
	                        <Button type="dashed" size="large" @click="showProductModal">点击筛选商品</Button>
	                    </Col>
	                    <Col span="4" offset="1" v-if="selectData.productId != ''">
	                        <Tag closable color="blue" type="dot" @on-close="handleClose"  style="height:35px">{{selectData.productName}}</Tag>   
	                    </Col>
	                    <Col span="4">
	                        <Button @click="refresh" type="primary">确认筛选</Button>
	                        <Button @click="selectReset" type="ghost">重置</Button>
	                    </Col>
	                </Row>
                    <Row :style="{marginBottom: '10px'}"></Row>
                    <Row :style="{marginBottom: '10px'}">
                        <Table :row-class-name="rowClassName" border :columns="skuColumns" 
                        :data="skuData" style="width: 100%;" @on-row-click="clickRow"></Table>
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
                        <Col class="padding-left-10">
                            已选中 {{selectSkuList.length}} 条数据
                        </Col>
<!--                         <Col class="padding-left-10">
                            <Button @click="selectReset" type="ghost">清空</Button>
                        </Col> -->
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
	props:["selectSkuList","isMutilple"],
    components:{
        loading,addProductSelect
    },
    data () {
        return {
        	//selectSkuList:[],
            productModal:false,
            productModalTitle:'选取商品',
            productList:[],
            //virtuaPropertyList:[],
            selectData:{
                name:'',
                code:'',
                //extCode1:'',
                productId:'',
                productName:'',
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
                {
                    title: '所属商品',
                    key:'productName',
                    align: 'center',
                },
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
/*                {
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
                                

                            ]);
                        }
                }*/
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
    },
    methods:{
    	clickRow(row,index){
            
            if(this.isMutilple == 0){
                this.selectSkuList.splice(0,this.selectSkuList.length);
                //console.log(this.isMutilple)
            }
    		//console.log(this.selectSkuList)
            let flag = true;
            for(let i = 0 ; i < this.selectSkuList.length ; i ++){
            	if(this.selectSkuList[i].skuId == row.id){
                    this.selectSkuList.splice(i,1);
                    flag = false;
            	}
            }
            if(flag == true){
            	var selectSkuSingle = {
                    code:row.code,
                    price:row.price,
            		skuId:row.id,
            		name:row.name,
                    isVirtua:row.isVirtua,
            		unitPrice:row.price,
            		extCode1:row.extCode1,
                    quantity:1,
                    remark:''
            	}
            	this.selectSkuList.push(selectSkuSingle);
            }
            //console.log(this.isMutilple)
            if(this.isMutilple == 0){
                this.$emit("hideModal");
            }
    	},
    	rowClassName(row, index){
            for(let i = 0 ; i < this.selectSkuList.length ; i ++){
            	if(this.selectSkuList[i].skuId == row.id){
                    return 'demo-table-info-row';
            	}
            }
	        return '';
    	},
        selectReset(){
            this.selectData.name = '';
            this.selectData.code = '';
            this.selectData.extCode1 = '';
            this.selectData.productId = '';
            this.selectData.productName = '';
            this.productList=[];
            this.init();
        },
        handleClose(){
            this.selectData.productId = '';
            this.selectData.productName = '';
            this.productList=[];
            this.init();
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
            this.productModal = false;
        },
        chooseProductId(id,name){
            this.selectData.productId = id;
            this.selectData.productName = name;
            this.init();
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
                //this.$Message.success("获取成功");
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
                             <br>sku外部编码：${this.skuData[index].extCode1}<br>所属商品：${this.skuData[index].productName}
                             <br>sku规格：${this.skuData[index].skuSize}<br>sku价格：${this.skuData[index].price}
                             <br>sku颜色：${this.skuData[index].color}<br>虚拟商品属性：${this.skuData[index].classType}
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