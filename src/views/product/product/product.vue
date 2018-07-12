<style lang="less">
    @import "../../../styles/common.less";
    @import './product.less';
</style>

<template>
    <div>
    	<Row>
            <Col span="24" >
                <Card>
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        基础商品列表
                    </p>
                    <Row :style="{marginBottom: '10px'}">


                    </Row>
                    <Row :style="{marginBottom: '10px'}">
                        <Table border :columns="productColumns" :data="productData" style="width: 100%;"></Table>
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
                            <Button type="primary" @click="addProduct" >新增商品</Button>
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
export default {
    components:{
        loading
    },
    data () {
        return {
            totalRecord:0,
            pageSize:10,
            pageNum:1,
            spinShow:true,
            productColumns: [
                {
                    type: 'index',
                    title: '序号',
                    width: 60,
                    align: 'center'
                },
                {
                    title:'商品名称',
                    key:'name',
                    align: 'center'
                },
                {
                    title: '商品编码',
                    key: 'code',
                    align: 'center'
                },
                {
                    title: '是否虚拟',
                    key:'isVirtua',
                    align: 'center',
                    width: 170,
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.isVirtua == true ? 'blue' : 'green';
                        const text = row.isVirtua == true ? '虚拟商品' : '实体商品';
                        return h('Tag', {
                            props: {
                                type: 'dot',
                                color: color
                            }
                        }, text);
                    }
                },

                {
                    title:'商品类别',
                    key:'productTypeName',
                    align: 'center'
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
                                            let query = {productId: params.row.id};
                                            this.$router.push({
                                                name: 'addProductSku',
                                                query: query
                                            });
                                        }
                                    }
                                }, '创建sku'),

                            ]);
                        }
                }
            ],
            productData: [
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
        error (nodesc) {
            this.$Notice.error({
                title: '错误',
                desc: nodesc 
            });
        },
        init(){
            this.spinShow = true;
            axios({
                method:'get',
                url:baseUrl + '/product/findAllProduct',
                params:{
                    currentPage:this.pageNum,
                    pageSize:this.pageSize
                },
                responseType:'json'
            }).then(res=> {
                  //console.log(res);
                  var proList = res.data.list;
                  for(var i = 0; i < proList.length ; i++){
                      var isVir = proList[i].isVirtua;
                      var isV = '否'
                      if(isVir == true){
                        isV = '是'
                      }
                  }
                  this.totalRecord=res.data.total;
                  this.productData=proList;
                  this.spinShow = false;
                  this.$Message.success("获取成功");
              })
              .catch(res=> {
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
                    title: '商品详情',
                    content: `商品编码：${this.productData[index].code}<br>是否虚拟商品：${this.productData[index].isVirtua == true ? '是' : '否'}
                             <br>商品名称：${this.productData[index].name}<br>创建时间：${this.productData[index].createTime}
                             <br>能否重复购买：${this.productData[index].isRepeat == true ? '是' : '否'}<br>更新时间：${this.productData[index].updateTime}
                             <br>创建人：${this.productData[index].userId}<br>商品类别：${this.productData[index].productTypeName}`
                })
        },
        changepage(curPage){
            this.pageNum = curPage;
            this.init();
        },
        addProduct(){
            this.$router.push({
                name: 'addProduct',
            });
        },
        addSkuToProduct(index){
            this.productData[index].id;
        },
        refresh(){
            this.init();
        }
    }
};
</script>