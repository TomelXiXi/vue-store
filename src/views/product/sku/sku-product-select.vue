<style lang="less">
    @import "../../../styles/common.less";
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
                        <Table border :columns="productColumns" :data="productData" style="width: 100%;"
                        @on-row-click="chooseComboSku" :row-class-name="rowClassName"></Table>
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
    props:["productList","isMutilple"],
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
                    title: '是否虚拟商品',
                    key:'isVirtua',
                    align: 'center',
                    width: 150,
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
                // {
                //     title:'操作',
                //     width: 160,
                //     align: 'center',
                //     render: (h, params) => {
                //             return h('div', [
                //                 h('Button', {
                //                     props: {
                //                         type: 'success',
                //                         size: 'small'
                //                     },
                //                     style: {
                //                         marginRight: '5px'
                //                     },
                //                     on: {
                //                         click: () => {
                //                             this.confirmSelect(params.index);
                //                         }
                //                     }
                //                 }, '选择')
                //             ]);
                //         }
                // }
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
        chooseComboSku(row,index){
            //判断是否多选
            if(this.isMutilple == 1){
                //console.log(row)
                let flag = true;
                for(let i = 0 ; i < this.productList.length ; i ++){
                    if(this.productList[i].id == row.id){
                        this.productList.splice(i,1);
                        flag = false;
                    }
                }
                if(flag == true){
                    this.productList.push(row);
                }
            }else{
                this.productList.splice(0,this.productList.length);
                // this.comboSku.comboCode = this.comboSkuData[index].comboCode;
                // this.comboSku.name = this.comboSkuData[index].name;
                // this.comboSku.price = this.comboSkuData[index].price;
                this.productList.push(row);
                this.$emit("chooseProductId");
            }
        },
        rowClassName(row, index){
            //console.log(this.productList);
            for(let i = 0 ; i < this.productList.length ; i ++){
            	if(this.productList[i].id == row.id){
                    return 'demo-table-info-row';
            	}
            }
	        return '';
    	},
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
                    content: `商品编码：${this.productData[index].code}<br>是否虚拟商品：${this.productData[index].isVirtua}
                             <br>商品名称：${this.productData[index].name}<br>创建时间：${this.productData[index].createTime}
                             <br>更新时间：${this.productData[index].updateTime}
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
        confirmSelect(index){
            let id = this.productData[index].id;
            let name = this.productData[index].name;
            console.log(id);
            this.$emit("chooseProductId",id,name);
            this.$emit("hideModal");
        }
    }
};
</script>