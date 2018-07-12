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
                        组合商品列表
                    </p>
                    <Row :style="{marginBottom: '10px'}">
                    </Row>
                    <Row :style="{marginBottom: '10px'}">
                        <Table border :columns="comboSkuColumns" :data="comboSkuData" style="width: 100%;" 
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
	props:["comboSkuList","isMutilple","comboSku"],
    components:{
        loading
    },
    data () {
        return {
            totalRecord:0,
            pageSize:10,
            pageNum:1,
            spinShow:true,
            comboSkuColumns: [
                {
                    type: 'index',
                    title: '序号',
                    width: 60,
                    align: 'center'
                },
                {
                    title:'组合商品名称',
                    key:'name',
                    align: 'center'
                },
                {
                    title: '商品编码',
                    key: 'comboCode',
                    align: 'center'
                },
                {
                    title: '状态',
                    key:'status',
                    align: 'center',
                    width: 120,
                },

                {
                    title:'价格',
                    key:'price',
                    align: 'center'
                },
                {
                    title:'备注',
                    key:'remark',
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
                //                             this.show(params.index)
                //                         }
                //                     }
                //                 }, '查看'),
                //                 h('Button', {
                //                     props: {
                //                         type: 'primary',
                //                         size: 'small'
                //                     },
                //                     style: {
                //                         marginRight: '5px'
                //                     },
                //                     on: {
                //                         click: () => {
                //                             this.chooseComboSku(params.index)
                //                         }
                //                     }
                //                 }, '选择'),
                //             ]);
                //         }
                // }
            ],
            comboSkuData: [
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
                url:baseUrl + '/comboSku/findAllComboSkuList',
                params:{
                    currentPage:this.pageNum,
                    pageSize:this.pageSize
                },
                responseType:'json'
            }).then(res=> {
                  //console.log(res);
                  let comboList = res.data.list;
                  for(let i = 0; i < comboList.length ; i++){
                      let isVir = comboList[i].status;
                      let isV = '作废'
                      if(isVir == 1){
                        isV = '有效'
                      }
                  }
                  this.totalRecord=res.data.total;
                  this.comboSkuData=comboList;
                  this.spinShow = false;
                  this.$Message.success("获取成功");
              })
              .catch(res=> {
                  console.log(res);
                  this.error("组合商品列表获取异常！");
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
                    content: `商品编码：${this.comboSkuData[index].comboCode}<br>状态：${this.comboSkuData[index].status}
                             <br>商品名称：${this.comboSkuData[index].name}<br>价格：${this.comboSkuData[index].price}
                             <br>备注：${this.comboSkuData[index].remark}<br>创建时间：${this.comboSkuData[index].createTime}
                             <br>更新时间：${this.comboSkuData[index].updateTime}<br>创建人：${this.comboSkuData[index].userId}`
                })
        },
        changepage(curPage){
            this.pageNum = curPage;
            this.init();
        },
        chooseComboSku(row,index){
            //判断是否多选
            if(this.isMutilple == 1){
                let flag = true;
                for(let i = 0 ; i < this.comboSkuList.length ; i ++){
                    if(this.comboSkuList[i].id == row.id){
                        this.comboSkuList.splice(i,1);
                        flag = false;
                    }
                }
                if(flag == true){
                    this.comboSkuList.push(row);
                }
            }else{
                this.comboSkuList.splice(0,this.comboSkuList.length);
                this.comboSku.comboCode = this.comboSkuData[index].comboCode;
                this.comboSku.name = this.comboSkuData[index].name;
                this.comboSku.price = this.comboSkuData[index].price;
                this.comboSkuList.push(row);
                this.$emit("hideComboModal");
            }
        },
        rowClassName(row, index){
            for(let i = 0 ; i < this.comboSkuList.length ; i ++){
            	if(this.comboSkuList[i].id == row.id){
                    return 'demo-table-info-row';
            	}
            }
	        return '';
    	},
    }
};
</script>