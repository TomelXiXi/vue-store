<template>
    <div>
        <Modal ref="modal"
            v-model="modal"
            v-bind:title='modalTitle'
            width=50%
            loading="loading"
            @on-ok="ok"
            @on-cancel="cancel">      
           <order-detail @showModal="showModal()" @hideModal="hideModal()" ref="orderDetailComp" 
           @init="init()"></order-detail>
        </Modal>
        <Row>
            <Col span="24" >
                <Card>
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        订单列表
                    </p>
                    <Row class="margin-bottom-12">
                        <Col span="4" >
                            <Input v-model="selectData.code"  placeholder="按订单号筛选" class="form-element-base" icon="ios-search"></Input>
                        </Col>
                        <Col span="4" offset="1" >
                            <Input v-model="selectData.phone"  placeholder="手机号码" class="form-element-base" icon="ios-search"></Input>
                        </Col>
                        <Col span="4" offset="1" >
                            <Input v-model="selectData.outerOrderCode"  placeholder="按外部编码筛选" class="form-element-base" icon="ios-search"></Input>
                        </Col>
                        <Col span="4" offset="1" >
                            <Select v-model="selectData.paymentStatus" placeholder="筛选付款状态...">
                                <Option value=""></Option>
                                <Option key="1" value="1">已付款</Option>
                                <Option key="0" value="0">未付款</Option>
                            </Select>
                        </Col>
                        
                    </Row>
                    <Row class="margin-bottom-12">
                        <Col span="4" >
                            <Select v-model="selectData.status" placeholder="筛选订单状态...">
                                <Option value=""></Option>
                                <Option key="1" value="1">新建</Option>
                                <Option key="2" value="2">已发货</Option>
                                <Option key="0" value="0">作废</Option>
                            </Select>
                        </Col>
                        <Col span="4" offset="1">
                            <Select v-model="selectData.isNeedAddress" placeholder="是否需要发货...">
                                <Option value=""></Option>
                                <Option key="1" value="1">需发货</Option>
                                <Option key="0" value="0">无需发货</Option>
                            </Select>
                        </Col>
                        <Col span="3" offset="12">
                            <Button @click="refresh" type="primary">确认筛选</Button>
                            <Button @click="selectReset" type="ghost">重置</Button>
                        </Col>
                    </Row>
                    <Row class="margin-bottom-12 searchable-table-con1">
                        <Table  border :columns="orderColumns" :data="orderData" style="width: 100%;"></Table>
                    </Row>
                    <Row class="paging">
                        <Col>
                            <Page :total="totalRecord" :page-size="pageSize" show-total  @on-change="changepage"></Page>
                        </Col>
                        <Col>
                            <Select v-model="pageSize"  style="width:100px" @on-change="changePageSize" class="padding-left-8">
                                <!-- <Option key="1条/页" :value="1">1条/页</Option> -->
                                <Option key="10条/页" :value="10">10条/页</Option>
                                <Option key="20条/页" :value="20">20条/页</Option>
                                <Option key="50条/页" :value="50">50条/页</Option>
                                <Option key="100条/页" :value="100">100条/页</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row type="flex" justify="end">
                        <Col class="margin-right-10">
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
import {baseUrl} from '@/conf/env'
import loading from '@/views/loading/loading'
import expandRow from '@/views/order/orderLine.vue'
import orderDetail from '@/views/order/components/orderDetail.vue'
export default {
    components:{
        loading ,expandRow,orderDetail
    },
    data () {
        return {
            modal:false,
            modalTitle:'订单维护',
            code:'',
            selectData:{
                code:'',
                outerOrderCode:'',
                phone:'',
                paymentStatus:undefined,
                status:undefined,
                isNeedAddress:''
            },
            totalRecord:0,
            pageSize:10,
            pageNum:1,
            spinShow:true,
            orderColumns: [
                {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(expandRow, {
                            props: {
                                row: params.row
                            }
                        })
                    }
                },
                {
                    type: 'index',
                    title: '序号',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '订单编码',
                    key: 'code',
                    align: 'center'
                },
/*                {
                    title: '外部平台编码',
                    key: 'outerOrderCode',
                    align: 'center'
                },*/
                /*{
                    title: '物流号',
                    key: 'outerOrderCode',
                    align: 'center'
                },
                {
                    title: '外部平台编码',
                    key: 'outerOrderCode',
                    align: 'center'
                },*/
                {
                    title: '原价',
                    key: 'actualPrice',
                    align: 'center',
                    render: (h, params) => {
                        let texts = '';
                        texts = params.row.actualPrice+'元'
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },
                 {
                    title:'实际支付总金额',
                    key:'totalActual',
                    align: 'center',
                    render: (h, params) => {
                        let texts = '';
                        texts = params.row.totalActual+'元'
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },
                {
                    title:'积分支付总金额',
                    key:'totalPoint',
                    align: 'center',
                    render: (h, params) => {
                        let texts = '';
                        texts = params.row.totalPoint+'元'
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },
                {
                    title:'优惠券支付总金额',
                    key:'couponAmount',
                    align: 'center',
                    render: (h, params) => {
                        let texts = '';
                        texts = params.row.couponAmount+'元'
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },
/*                {
                    title:'积分使用总数量',
                    key:'numberPoint',
                    align: 'center'
                },*/
                {
                    title:'订单状态',
                    key:'status',
                    width:140,
                    align: 'center',
                    render: (h, params) => {
                        //let _this = this;
                        let texts = '';
                        let color = '';
                        if(params.row.status == 0){
                            texts='作废'
                            color='red'
                        }else if(params.row.status == 1){
                            texts='新建'
                            color='green'
                        }else if(params.row.status == 2){
                            texts='已发货'
                            color='yellow'
                        }else if(params.row.status == 3){
                            texts='已完成'
                            color='blue'
                        }
                        return h('Tag', {
                            props: {
                                type: 'dot',
                                color: color
                            }
                        }, texts);
                    }
                },
                {
                    title:'支付状态',
                    key:'paymentStatus',
                    align: 'center',
                    width:140,
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.paymentStatus === 1 ? 'blue' : 'red';
                        const text = row.paymentStatus === 1 ? '已付款' : '未付款';
                        return h('Tag', {
                            props: {
                                type: 'dot',
                                color: color
                            }
                        }, text);
                    }
                },
                {
                    title:'创建时间',
                    key:'createTime',
                    width:150,
                    align: 'center'
                },
                {
                    title:'是否需要发货',
                    key:'isNeedAddress',
                    align: 'center',
                    render: (h, params) => {
                        const row = params.row;
                        const text = row.isNeedAddress === true ? '是' : '否';
                        return h('div', {
                            props: {
                            }
                        }, text);
                    }
                },
                {
                    title:'操作',
                    align: 'center',
                    width:130,
                    render: (h, params) => {
                        let dis = false;
                        if(params.row.isNeedAddress == false){
                            dis = true;
                        }
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
                                    size: 'small',
                                    disabled:dis
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        /*this.code=params.row.code;
                                        console.log(this.code);*/
                                        this.setCodeParent(params.row.code);
                                        this.modal = true;
                                        this.$refs.orderDetailComp.init();
                                    }
                                }
                            }, '编辑'),
                        ]);
                    }
                }
            ],
            orderData: [
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
        setCodeParent(code){
            this.$refs.orderDetailComp.setCode(code);
        },
        ok(){
            this.$refs.orderDetailComp.updateOrder();
            //this.modal=false;
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
            this.spinShow = true;
            axios({
                method:'get',
                url:baseUrl + '/order/findSoList',
                params:{
                    currentPage:this.pageNum,
                    pageSize:this.pageSize,
                    code:this.selectData.code,
                    outerOrderCode:this.selectData.outerOrderCode,
                    phone:this.selectData.phone,
                    paymentStatus:this.selectData.paymentStatus,
                    status:this.selectData.status,
                    isNeedAddress:this.selectData.isNeedAddress
                },
                responseType:'json'
            }).then(res=> {
                  console.log(res);
                  var proList = res.data.list;
                  this.totalRecord=res.data.total;
                  this.orderData=proList;
                  this.spinShow = false;
                  if(res.data.result == -2){
                      this.$Message.error("获取失败！");
                  }else{
                      this.$Message.success("获取成功");
                  }
                  
              })
              .catch(res=> {
                  console.log(res);
                  this.error("服务器请求失败！");
                  this.spinShow = false;
              });
        },
        error (nodesc) {
            this.$Notice.error({
                title: '错误',
                desc: nodesc 
            });
        },
        changePageSize(){
            this.pageNum=1;
            this.init();
        },
        show(index){
            this.$Modal.info({
                    title: '订单详情',
                    content: `订单编码：${this.orderData[index].code}
                             <br>外部平台订单号：${this.orderData[index].outerOrderCode == null ? '暂无' : this.orderData[index].outerOrderCode}
                             <br>创建时间：${this.orderData[index].createTime}
                             <br>更新时间：${this.orderData[index].updateTime}
                             <br>创建人：${this.orderData[index].userId}
                             <br>实际价格：${this.orderData[index].actualPrice}元
                             <br>积分支付总金额：${this.orderData[index].totalPoint}元
                             <br>用户实际支付总金额：${this.orderData[index].totalActual}元
                             <br>优惠券支付总金额：${this.orderData[index].couponAmount}元
                             <br>快递单号：${this.orderData[index].trackingNo  == null ? '暂无' : this.orderData[index].trackingNo}
                             <br>快递公司：${this.orderData[index].transCode  == null ? '暂无' : this.orderData[index].transCode}
                             <br>积分使用总数量：${this.orderData[index].numberPoint}
                             <br>订单来源：${this.orderData[index].source}
                             <br>支付流水号：${this.orderData[index].payNo  == null ? '暂无' : this.orderData[index].payNo}
                             <br>订单状态: ${this.orderData[index].status == 0 ? '作废' : this.orderData[index].status == 1 ? '新建' : '已发货'}
                             <br>支付状态：${this.orderData[index].paymentStatus == 1 ? '已付款' : '未付款'}
                             <br>订单类型：${this.orderData[index].orderType}
                             <br>更改时间：${this.orderData[index].createTime}`
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
            this.orderData[index].id;
        },
        refresh(){
            this.init();
        },
         selectReset(){
            this.selectData.outerOrderCode = '';
            this.selectData.code = '';
            this.selectData.phone = '';
            this.selectData.paymentStatus = undefined;
            this.selectData.status = undefined;
            this.selectData.isNeedAddress = '';
        },
        refresh(){
            this.init();
        }

    }
};
</script>   