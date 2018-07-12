 <style lang="less">
    @import "../../styles/common.less";
</style>

<template>
    <div>
        <Modal ref="modal"
            v-model="modal"
            v-bind:title='modalTitle'
            width=50%
            loading="loading">      
            <add-user-coupon @showModal="showModal()" @hideModal="hideModal()" ref="addUserCouponComponent" 
           @init="init()" :couponName="couponName" :couponId="couponId"></add-user-coupon>

           <div slot="footer">
                <Button type="text" size="large" @click="cancel">取消</Button>
                <Button type="primary" size="large" @click="ok">确定</Button>
            </div>
        </Modal>
    	<Row>
            <Col span="24" >
                <Card>
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        优惠券列表
                    </p>
                    <Row :style="{marginBottom: '10px'}">
                    </Row>
                    <Row :style="{marginBottom: '10px'}">
                        <Table border :columns="couponColumns" :data="couponData" style="width: 100%;"></Table>
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
                            <Button type="primary" @click="addCoupon" >新增优惠券</Button>
                            <Button @click="init" >刷新</Button>
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
import {baseUrl} from '../../conf/env'
import loading from '../loading/loading'
import addUserCoupon from './components/addUserCoupon.vue'
export default {
    components:{
        loading,addUserCoupon
    },
    data () {
        return {
            couponName:'',
            couponId:'',
            modal:false,
            modalTitle:'发放优惠券',
            totalRecord:0,
            pageSize:10,
            pageNum:1,
            spinShow:true,
            displayTypeList:[],
            couponColumns: [
                {
                    type: 'index',
                    title: '序号',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '优惠券名称',
                    key: 'title',
                    align: 'center'
                },
                {
                    title: '优惠券编号',
                    key: 'couponId',
                    align: 'center'
                },
                {
                    title:'是否可用',
                    key:'status',
                    align: 'center',
                    width: 130,
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.status == true ? 'blue' : 'red';
                        const text = row.status == true ? '可用' : '不可用';
                        return h('Tag', {
                            props: {
                                type: 'dot',
                                color: color
                            }
                        }, text);
                    }
                },
                {
                    title:'优惠券类型',
                    key:'isCommon',
                    align: 'center',
                    width: 130,
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.isCommon == true ? 'blue' : 'green';
                        const text = row.isCommon == true ? '通用券' : '特定券';
                        return h('Tag', {
                            props: {
                                type: 'dot',
                                color: color
                            }
                        }, text);
                    }
                },
                {
                    title:'最低使用价',
                    key:'minUsePrice',
                    align: 'center',
                    render: (h, params) => {
                        let texts = '';
                        texts = params.row.minUsePrice+'元'
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },
                {
                    title:'抵扣价格',
                    key:'price',
                    align: 'center',
                    render: (h, params) => {
                        let texts = '';
                        texts = params.row.price+'元'
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    }
                },
                {
                    title:'描述',
                    key:'content',
                    align: 'center'
                },
                {
                    title:'开始时间',
                    key:'startTime',
                    align: 'center'
                },
                {
                    title: '结束时间',
                    key:'endTime',
                    align: 'center'
                },
                {
                    title:'操作',
                    align: 'center',
                    width:130,
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
                                            this.couponName = params.row.title;
                                            this.couponId = params.row.couponId;
                                            this.modal = true;
                                        }
                                    }
                                }, '发放'),
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
                                                name: 'addCoupon',
                                                query: query
                                            });
                                        }
                                    }
                                }, '编辑'),
                            ]);
                        }
                }
            ],
            couponData: [
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
                method:'post',
                url:baseUrl + '/coupon/selectCouponList',
                params:{
                    currentPage:this.pageNum,
                    pageSize:this.pageSize
                },
                responseType:'json'
            }).then(res=> {
                console.log(res);
                this.totalRecord=res.data.total;
                this.couponData=res.data.list;

/*                  for(let i = 0; i < this.skuConfData.length ; i++){
                  this.replace(this.skuConfData[i],isOnSale);
                }*/
                if(res.data.result != 0){
                    this.$Message.success("获取成功");
                }
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
        changepage(curPage){
            this.pageNum = curPage;
            this.init();
        },
        addCoupon(){
            this.$router.push({
                name: 'addCoupon',
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
            console.log(value);
        },
        ok(){
            //this.$refs.addUserCouponComponent.buttonLoading = false;
            this.$refs.addUserCouponComponent.handleSubmit();
            setTimeout(() => {
                            this.loading=true;
                        }, 100);
            //this.modal=false;
        },
        cancel(){
            this.modal = false;
        },
        showModal(){
            this.modal = true;
        },
        hideModal(){
            this.modal = false;
        },
    }
};
</script>