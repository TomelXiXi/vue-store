 <style lang="less">
 .list-complete-item {
    transition: all 0.5s;
    height:40px;
    line-height: 40px;
    background: #287bd3e8;
    color:#fff;
    text-align: center;
    font-size:16px;
    margin-top:10px;
}
.styleclass{
    width:60px;
    float:left;
}
.styleclass2{
    float:left;
}
.list-complete-enter, .list-complete-leave-active {
  opacity: 0;
  height: 0px;
  margin-top: 0px;
  padding: 0px;
  border: solid 0px;
}
.list-complete-sortable-chosen,.list-complete-sortable-ghost{
  opacity: 0;
  height: 0px;
  margin-top: 0px;
  padding: 0px;
  border: solid 0px;
}
.dargDiv{
    cursor:move;
    
}
.wrods{
    margin-top:50px;
}
.slide-fade-enter-active {
  transition: all 1s ease;
}
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to{
  transform: translateX(10px);
  opacity: 0;
}

    @import "../../styles/common.less";
</style>

<template>
    <div>
    	<Row>
            <Col span="24" >
                <Card>
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        上下架商品列表
                        <a  slot="extra" class="ivu-card-extra" @click.prevent="showSort" v-if="isSort == 0">
                            <Icon type="navicon-round"></Icon>
                            排序
                        </a>
                        <a  slot="extra" class="ivu-card-extra" @click.prevent="hideSort" v-if="isSort == 1">
                            <Icon type="chevron-up"></Icon>
                            收起排序
                        </a>
                    </p>
                    <Row :style="{marginBottom: '10px'}">
                         <Col span="4" >
                            <Select v-model="selectData.isOnSale" placeholder="筛选上下架..." @on-change="init()">
                                <Option value=""></Option>
                                <Option key="1" value="1">上架</Option>
                                <Option key="0" value="0">下架</Option>
                            </Select>
                        </Col> 
                        <Col span="4" offset="1">
                            <Select v-model="selectData.primaryDisplayId"   @on-change="primaryChange" placeholder="筛选一级列表...">
                                <Option v-for="item in primaryList" :value="item.value" :key="item.value">{{ item.label }}</Option> 
                            </Select>
                        </Col> 
                        <Col span="4" offset="1">
                            <Select v-model="selectData.displayTypeId" placeholder="筛选二级列表..." @on-change="displayTypeIdChange">
                                <Option v-for="item in displayTypeListSelect" :value="item.id" :key="item.id">{{ item.displayLabel }}</Option> 
                            </Select>
                        </Col> 
                        <Col span="9" offset="1">
                            <Button @click="refresh" type="primary" icon="search">搜索</Button>
                            <Button @click="selectReset" type="ghost">重置</Button>
                        </Col>
                    </Row>
                    <Row :style="{marginBottom: '10px'}">
                        <Table border :columns="skuConfColumns" :data="skuConfData" style="width: 100%;" @on-row-click="showDate"></Table>
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
                            <Button type="primary" @click="addSkuConf" >新增上架</Button>
                            <Button @click="refresh" >刷新</Button>
                        </Col>
                    </Row>
                    <loading v-bind:spinShow='spinShow'></loading>
                </Card>
            </Col>
        </Row>
        <transition name="slide-fade">
            <Card class="margin-top-8" v-if="isSort == 1">
                 <p slot="title">
                        <Icon type="ios-list"></Icon>
                        排序列表
                    </p>
                    <Row>
                        <Col span="12">
                            <draggable :list="skuConfData" :move="getdata" @update="datadragEnd" :options="{animation: 300,handle:'.dargDiv'}">
                                <transition-group name="list-complete" >
                                    <div v-for="(element,index) in skuConfData" :key="element.id"  class="list-complete-item">
                                        <div class="styleclass dargDiv"><Icon type="navicon-round" color="black"></Icon></div>
                                        <div class="styleclass2 dargDiv">{{element.name}}</div>
                                    </div>
                                </transition-group>
                            </draggable>
                        </Col>
                    </Row>
                    <Row type="flex" justify="end">
                        <Col class="margin-right-10">
                            <Button type="primary" @click="confirmSort" >确认排序</Button>
                        </Col>
                    </Row>
            </Card>
        </transition>
    </div>
</template>

<script>
import axios from 'axios'
import {baseUrl} from '../../conf/env'
import loading from '../loading/loading'
import {setCookie, getCookie, removeCookie} from '@/conf/cookie'
import draggable from 'vuedraggable'
export default {
    components:{
        loading,draggable
    },
    data () {
        return {
            list2:[
                {id:"id1",it:{name:'bbbb'}},
                {id:"id2",it:{name:'2222'}},
                {id:"id3",it:{name:'3333'}},
                {id:"id4",it:{name:'4444'}}
            ], 
            isSort:0,
            popupList:[],
            primaryList:[],
            displayTypeListSelect:[],
            displayTypeListAll:[],
            selectData:{
                isOnSale:undefined,
                primaryDisplayId:0,
                displayTypeId:0
            },
            totalRecord:0,
            pageSize:10,
            pageNum:1,
            spinShow:true,
            primaryDiplayList:[],
            displayTypeList:[],
            skuConfColumns: [
                {
                    type: 'index',
                    title: '序号',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '商品名称',
                    key: 'name',
                    align: 'center',
                    width: 160,
                },
                {
                    title:'是否上架',
                    key:'isOnSale',
                    align: 'center',
                    width: 130,
                    render: (h, params) => {
                        return h('i-switch', {
                            props: {
                                value: params.row.isOnSale
                            },
                            on: {  
                                'on-change': (value) => {  
                                    this.changeOnSale(params.index,value); 
                                }
                            } 
                        })
                    }
                },
                {
                    title:'能否购买',
                    key:'canBuy',
                    align: 'center',
                    width:140,
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.canBuy === true ? 'blue' : 'red';
                        const text = row.canBuy === true ? '可购买' : '不可购买';
                        return h('Tag', {
                            props: {
                                type: 'dot',
                                color: color
                            }
                        }, text);
                    }
                },
                {
                    title:'上架价格',
                    key:'realPrice',
                    align: 'center',
                    render: (h, params) => {
                        let texts = '';
                        texts = params.row.realPrice+'元'
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },
/*              {
                    title:'会员价格',
                    key:'vipPrice',
                    align: 'center',
                    render: (h, params) => {
                        let texts = '';
                        if(params.row.vipPrice == null){
                            texts = '暂无'
                        }else{
                            texts = params.row.vipPrice+'元'
                        }
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },*/
                {
                    title:'一级分类',
                    key:'primaryDisplayId',
                    align: 'center',
                    render: (h, params) => {
                        let texts = '';
                        for(let i = 0 ; i < this.primaryDiplayList.length ; i ++){
                            if(this.primaryDiplayList[i].id == params.row.primaryDisplayId){
                                texts = this.primaryDiplayList[i].label;
                            }
                        }
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },
                {
                    title:'二级分类',
                    key:'displayTypeId',
                    align: 'center',
                    render: (h, params) => {
                        let texts = '';
                        for(let i = 0 ; i < this.displayTypeList.length ; i ++){
                            //console.log(this.displayTypeList[i].id + "||" + params.row.displayTypeId)
                            if(this.displayTypeList[i].id == params.row.displayTypeId){
                                texts = this.displayTypeList[i].displayLabel;
                            }
                        }
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },
                {
                    title:'商品描述',
                    key:'remark',
                    align: 'center',
                    render: (h, params) => {
                      return h('div', [
                         h('span', {
                             style: {
                                 display: 'inline-block',
                                 width: '100%',
                                 overflow: 'hidden',
                                 textOverflow: 'ellipsis',
                                 whiteSpace: 'nowrap'
                             },
                             domProps: {
                                 title: params.row.remark
                             }
                         }, params.row.remark)
                     ]);
                  }
                },
                {
                    title:'折扣',
                    key:'discount',
                    align: 'center'
                },
/*                {
                    title: '是否虚拟商品',
                    key:'isVirtua',
                    align: 'center',
                    render: (h, params) => {
                        let _this = this;
                        let texts = '';
                        if(params.row.isVirtua == true){
                            texts='是'
                        }else{
                            texts='否'
                        }
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },*/
                {
                    title: '是否组合商品',
                    key:'isCombo',
                    align: 'center',
                    render: (h, params) => {
                        let _this = this;
                        let texts = '';
                        if(params.row.isCombo == true){
                            texts='是'
                        }else{
                            texts='否'
                        }
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },
/*                {
                    title: '能否使用优惠券',
                    key:'isUseCoupon',
                    align: 'center',
                    render: (h, params) => {
                        let _this = this;
                        let texts = '';
                        if(params.row.isUseCoupon == true){
                            texts='是'
                        }else{
                            texts='否'
                        }
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },
                {
                    title: '能否使用积分',
                    key:'isUsePoints',
                    align: 'center',
                    render: (h, params) => {
                        let _this = this;
                        let texts = '';
                        if(params.row.isUsePoints == true){
                            texts='是'
                        }else{
                            texts='否'
                        }
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },
                {
                    title: '能否返积分',
                    key:'isReturnPoints',
                    align: 'center',
                    render: (h, params) => {
                        let _this = this;
                        let texts = '';
                        if(params.row.isReturnPoints == true){
                            texts='是'
                        }else{
                            texts='否'
                        }
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },*/
                {
                    title: '配置信息',
                    key:'popupId',
                    align: 'center',
                    render: (h, params) => {
                        let texts = '';
                        for(let i = 0 ; i < this.popupList.length ; i ++){
                            //console.log(this.popupList[i].id,params.row.popupId)
                            if(this.popupList[i].id == params.row.popupId){
                                texts = this.popupList[i].remark;
                            }
                        }
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },
                {
                    title:'操作',
                    align: 'center',
                    width:160,
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
                                            let query = {skuConfId: params.row.id,isCopy:0};
                                            this.$router.push({
                                                name: 'addSkuConf',
                                                query: query
                                            });
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            let query = {skuConfId: params.row.id,isCopy:1};
                                            this.$router.push({
                                                name: 'addSkuConf',
                                                query: query
                                            });
                                        }
                                    }
                                }, '复制商品'),
                            ]);
                        }
                }
            ],
            skuConfData: [
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
        this.getPrimaryType();
        this.getDisplayType();
    },
    methods:{
        confirmSort(){
            let sortList = [];
            for(let i = 0 ; i < this.skuConfData.length ; i ++){
                //console.log(i,this.skuConfData[i].id,this.skuConfData[i].name);
                let sortSingle = {
                    skuConfId:this.skuConfData[i].id,
                    sort:i
                }
                sortList.push(sortSingle);
            }
            axios({
                method:'post',
                url:baseUrl + '/skuConf/sortByManage',
                params:{
                    sortListStr:JSON.stringify(sortList)
                },
                responseType:'json'
            }).then(res=> {
                console.log(res)
                if(res.data.status != 1){
                    console.log(res);
                    this.error("保存失败");
                }else{
                    this.$Message.success("保存成功")
                    this.init();
                }   
            })
            .catch(res=> {
                console.log(res);
                this.error("保存失败");
            });

        },
        hideSort(){
            this.isSort = 0;
        },
        showSort(){
            if(this.selectData.displayTypeId == 0){
                this.$Message.error("请先筛选所需排序的二级分类")
            }else{
                this.isSort = 1;
            }
            
        },
        getdata (evt) {
            //console.log(evt.draggedContext.element.id)
        },
        datadragEnd (evt) {
            //console.log('拖动前的索引 :' + evt.oldIndex)
            //console.log('拖动后的索引 :' + evt.newIndex)
        },
        info (nodesc) {
            this.$Notice.info({
                title: '已设置自动上下架时间',
                desc: nodesc
            });
        },
        showDate(selection,index){
            /*if(selection.isOnSale == false){
                this.info('当前商品已下架');
            }else{
                if(selection.canBuy == false){
                    //this.$Message.info('已设置自动上下架时间[' + selection.aut);
                    this.info('自动上架时间：' + selection.autoUpTime + '<br>' + '自动下架时间：' + selection.autoDownTime);
                }
            }*/
        },
        selectReset(){
            this.selectData.primaryDisplayId = 0;
            this.selectData.displayTypeId = 0;
            this.selectData.isOnSale = undefined;
            this.getDisplayType();
        },
        changeOnSale(index,value){
            this.spinShow = true;
            this.skuConfData[index].isOnSale = value;
            axios({
                method:'post',
                url:baseUrl + '/skuConf/updateSkuConf',
                params:{
                    id:this.skuConfData[index].id,
                    isOnSale:value,
                    updateId:getCookie('userId')
                },
                responseType:'json'
            }).then(res=> {
                //console.log(res);
                if(value == true){
                    this.$Message.success("商品上架成功");
                }else{
                    this.$Message.success("商品下架成功");
                }
                this.spinShow = false;
            })
            .catch(res=> {
                console.log(res);
                if(value == true){
                    this.error("商品上架失败");
                }else{
                    this.error("商品下架失败");
                }
                this.spinShow = false;
            });
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
                method:'post',
                url:baseUrl + '/skuConf/findSkuConfDetailList',
                params:{
                    currentPage:this.pageNum,
                    pageSize:this.pageSize,
                    primaryDisplayId:this.selectData.primaryDisplayId,
                    displayTypeId:this.selectData.displayTypeId,
                    isOnSale:this.selectData.isOnSale
                },
                responseType:'json'
            }).then(res=> {
                console.log(res);
                this.totalRecord=res.data.total;
                this.skuConfData=res.data.list;
                if(res.data.result != 0){
                    this.$Message.success("获取成功");
                }
              this.spinShow = false;
              })
              .catch(res=> {
                  //console.log(res);
                  this.error("服务器请求失败！");
                  this.spinShow = false;
              });
              //获取一级分类
             axios({
                method:'get',
                url:baseUrl + '/skuConf/findAllPrimaryDisplay',
                responseType:'json'
            }).then(res=> {
                //console.log(res)
                if(res.data.result == -2){
                    console.log(res);
                    this.error("请求失败,获取上架类型错误！");
              }else{
                    this.primaryDiplayList = res.data;
              }
                
              })
              .catch(res=> {
                  console.log(res);
                  this.error("请求失败,获取上架类型错误！");
              });
              //获取二级分类
              axios({
                method:'get',
                url:baseUrl + '/skuConf/findAllDisplay',
                responseType:'json'
            }).then(res=> {
                //console.log(res)
                if(res.data.result == -2){
                    console.log(res);
                    this.error("请求失败,获取上架类型错误！");
              }else{
                    this.displayTypeList = res.data;
              }
                
              })
              .catch(res=> {
                  console.log(res);
                  this.error("请求失败,获取上架类型错误！");
              });
              this.findAllPopup();
        },
        findAllPopup(){
            axios({
                method:'post',
                url:baseUrl + '/popup/findAllPopup',
                params:{
                    currentPage:1,
                    pageSize:100000,
                },
                responseType:'json'
            }).then(res=> {
                //console.log(res)
                this.popupList = res.data.list;
            })
            .catch(res=> {
                console.log(res);
                this.error("获取配置信息异常");
            });
        },
        changePageSize(){
            this.pageNum=1;
            this.init();
        },
        changepage(curPage){
            this.pageNum = curPage;
            this.init();
        },
        addSkuConf(){
            this.$router.push({
                name: 'addSkuConf',
            });
        },
        addSkuToProduct(index){
            this.productData[index].id;
        },
        refresh(){
            this.init();
        },
        replaceBoolean(item,key){
            let value = item.key;
            if(value == true){
                value = '是'
            }else{
                value = '否'
            }
            //console.log(value);
        },
        primaryChange(value){
            this.selectData.displayTypeId = 0;
            this.displayTypeListSelect=[];
            for(let i = 0 ; i < this.displayTypeListAll.length ; i ++){
                if(this.displayTypeListAll[i].primaryId == this.selectData.primaryDisplayId){
                    this.displayTypeListSelect.push(this.displayTypeListAll[i]);
                }
            }
            this.init();
        },
        displayTypeIdChange(value){
            this.init();
        },
        getPrimaryType(){
            //获取一级类别
                axios({
                    method:'get',
                    url:baseUrl + '/skuConf/findAllPrimaryDisplay',
                    responseType:'json'
                }).then(res=> {
                    //console.log(res);
                    for(let i = 0 ; i < res.data.length ; i ++){
                        let primaryListSingle = {
                            value:res.data[i].id,
                            label:res.data[i].label
                        } 
                        this.primaryList.push(primaryListSingle);
                    }    
                })
                .catch(res=> {
                      console.log(res);
                      this.error("获取上架一级列表失败");
                });
        },
        getDisplayType(){
            //获取二级类型
            axios({
                method:'get',
                url:baseUrl + '/skuConf/findAllDisplay',
                responseType:'json'
            }).then(res=> {
                this.displayTypeListSelect = res.data;
                this.displayTypeListAll = res.data;
            })
            .catch(res=> {
                  console.log(res);
                  this.error("获取上架二级列表失败");
            });
        }
    }
};
</script>