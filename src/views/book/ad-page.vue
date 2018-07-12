<style lang="less">

</style>

<template>
    <div>
        <Modal ref="modal"
            v-model="modal"
            v-bind:title='modalTitle'
            width=50%
            loading="loading">      
           <cover-update @showModal="showModal()" @hideModal="hideModal()" ref="coverDetail" 
           @init="init()"></cover-update> 
           <div slot="footer">
                <Button type="text" size="large" @click="cancel">取消</Button>
                <Button type="primary" size="large" @click="ok('formValidate')">确定</Button>
            </div>
        </Modal>
    	<Row>
            <Col span="24" >
                <Card> 
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        封面广告
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
                            <Button @click="refresh" >刷新</Button>
                        </Col>
                    </Row>
                    <loading v-bind:spinShow='spinShow'></loading>
                </Card>
            </Col>
        </Row>
        <Row type="flex" justify="end">
                        <Col class="margin-right-10">
                            <Button type="primary" @click="addCover" >新增广告页</Button>
                            <Button @click="refresh" >刷新</Button>
                        </Col>
        </Row>
        <loading v-bind:spinShow='spinShowComp'></loading>
    </div>
</template>

<script>
import axios from 'axios'
import {baseUrl} from '../../conf/env'
import loading from '../loading/loading'
import coverUpdate from '@/views/book/cover-update.vue'
import {timestampToDate} from '@/conf/date-format.js'
export default {
    components:{
        loading ,coverUpdate
    },
    data () {
        return {
            spinShowComp:false,
            modal:false,
            modalTitle:'封面页广告维护',
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
                    title: '图片',
                    key: 'imgUrl',
                    align: 'center',
                    columns: {
                        'width':'50px'
                    },
                    render: (h, params) => {
                        return h('div', [
                            h('img', {
                                attrs: {
                                    src: params.row.imgUrl
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
                    title: '链接地址',
                    key: 'url',
                    align: 'center'
                },
                {
                    title: '是否允许跳过',
                    key:'isSkip',
                    align: 'center',
                    width: 170,
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.isSkip == true ? 'blue' : 'red';
                        const text = row.isSkip == true ? '允许' : '不允许';
                        return h('Tag', {
                            props: {
                                type: 'dot',
                                color: color
                            }
                        }, text);
                    }
                },

                {
                    title:'广告驻留时间',
                    key:'residenceTime',
                    align: 'center'
                },
                {
                    title:'跳过时间',
                    key:'skipTime',
                    align: 'center'
                },
                {
                    title: '状态',
                    key:'status',
                    align: 'center',
                    width: 170,
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
                                        /*this.code=params.row.code;
                                        console.log(this.code);*/
                                        this.setIdParent(params.row.id);
                                        this.modal = true;
                                        this.$refs.coverDetail.init();
                                    }
                                }
                            }, '编辑'),

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
                method:'post',
                url:baseUrl + '/book/findCoverList',
                params:{
                    currentPage:this.pageNum,
                    pageSize:this.pageSize
                },
                responseType:'json'
            }).then(res=> {
                  console.log(res);
                  var proList = res.data.info.list;
                  this.totalRecord=res.data.total;
                  for (let i = 0 ; i < proList.length ; i++) {
                        proList[i].startTime =  proList[i].startTime == '' ? '' : timestampToDate(proList[i].startTime);
                        proList[i].endTime =  proList[i].endTime == '' ? '' : timestampToDate(proList[i].endTime);
                        proList[i].createTime =  proList[i].createTime == '' ? '' : timestampToDate(proList[i].createTime);
                        proList[i].updateTime =  proList[i].updateTime == '' ? '' : timestampToDate(proList[i].updateTime);
                  }
                  this.productData=proList;
                  this.spinShow = false;
                  console.log(timestampToDate);
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
                    title: '封面广告详情',
                    content: `驻留时间：${this.productData[index].residenceTime}<br>是否跳过：${this.productData[index].isSkip == true ? '是' : '否'}
                             <br>跳过时间：${this.productData[index].skipTime}<br>创建时间：${this.productData[index].createTime}
                             <br>是否可用：${this.productData[index].status == true ? '是' : '否'}<br>
                             开始生效时间：${this.productData[index].startTime}
                             <br>结束可用时间：${this.productData[index].endTime}`
                })
        },
        changepage(curPage){
            this.pageNum = curPage;
            this.init();
        },
        setIdParent(id){
            this.$refs.coverDetail.setId(id);
        },
        ok(){
            this.$refs.coverDetail.updateCover();
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
        refresh(){
            this.init();
        },
        addCover(){
            this.$refs.coverDetail.setId('');
            this.modal = true;
            this.$refs.coverDetail.init();
        },
    }
};
</script>