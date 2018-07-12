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
                        虚拟商品属性
                    </p>
                    <Row :style="{marginBottom: '10px'}"></Row>
                    <Row :style="{marginBottom: '10px'}">
                        <Table border :columns="virtuaPropertyColumns" :data="virtuaPropertyData" style="width: 100%;"></Table>
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
                            <Button type="primary" @click="addVirtuaProperty" >新增属性</Button>
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
        	skuVirtuaPropertyTypList:[],
            totalRecord:0,
            pageSize:10,
            pageNum:1,
            spinShow:true,
            virtuaPropertyColumns: [
                {
                    type: 'index',
                    title: '序号',
                    width: 60,
                    align: 'center'
                },
                {
                    title:'虚拟属性名称',
                    key:'name',
                    align: 'center'
                },
                {
                    title:'虚拟商品类型',
                    key:'typeName',
                    align: 'center'
                },
                {
                    title: '充值课程数',
                    key: 'classNum',
                    align: 'center'
                },
                {
                    title: '充值起始课程',
                    key:'startClass',
                    align: 'center',
                },
                {
                    title:'充值结束课程',
                    key:'endClass',
                    align: 'center'
                },
                {
                    title:'充值课程类型',
                    key:'classTypeName',
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
                                            let query = {id: params.row.id};
                                            this.$router.push({
                                                name: 'addVirtuaProperty',
                                                query: query
                                            });
                                        }
                                    }
                                }, '编辑'),

                            ]);
                        }
                }
            ],
            virtuaPropertyData: [
            ]
        };
    },
    computed: {
        avatorImage () {
            return localStorage.avatorImgPath;
        }
    },
    created(){
    	//查询sku虚拟商品类型
	    axios({
	        method:'get',
	        url:baseUrl + '/chooseOption/findChooseOptionByCodeAvailable',
	        params:{
	            categoryCode:"skuVirtuaPropertyTyp"
	        },
	        responseType:'json'
	    }).then(res=> {
	        //console.log(res)
	        for(var i = 0 ; i < res.data.length ; i ++){
	            var skuVirtuaPropertyTypSingle = {
	                value:res.data[i].optionKey,
	                label:res.data[i].optionValue
	            }
	            this.skuVirtuaPropertyTypList.push(skuVirtuaPropertyTypSingle);
	        }
	        //console.log(this.skuVirtuaPropertyTypList)
	    }).catch(res=> {
	        console.log(res);
	        this.error("请求失败,获取虚拟商品类型错误！");
	    });
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
                url:baseUrl + '/skuVirtuaProperty/findAllSkuVirtuaProperty',
                params:{
                    currentPage:this.pageNum,
                    pageSize:this.pageSize
                },
                responseType:'json'
            }).then(res=> {
            	console.log(res);
                  if(res.data.description == '出错了！'){
                  	  console.log(res);
                  	  this.error("服务器请求失败！");
                  	  this.spinShow = false;
                  }else{
	                  this.totalRecord=res.data.total;
	                  this.virtuaPropertyData=res.data.list;
	                  this.spinShow = false;
                      this.$Message.success("获取成功");
                  }
              })
              .catch(res=> {
                  console.log(res);
                  this.error("数据获取异常！");
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
                    content: `虚拟商品类型：${this.virtuaPropertyData[index].type}<br>充值课程数：${this.virtuaPropertyData[index].classNum}
                             <br>充值开始课程：${this.virtuaPropertyData[index].startClass}<br>充值结束课程：${this.virtuaPropertyData[index].endClass}
                             <br>更新时间：${this.virtuaPropertyData[index].updateTime}
                             <br>创建人：${this.virtuaPropertyData[index].userId}`
                })
        },
        changepage(curPage){
            this.pageNum = curPage;
            this.init();
        },
        addVirtuaProperty(){
            this.$router.push({
                name: 'addVirtuaProperty',
            });
        },
        refresh(){
            this.init();
        }
    }
};
</script>